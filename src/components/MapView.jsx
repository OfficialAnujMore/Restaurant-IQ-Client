import { useEffect, useRef, useState } from 'react';
import ArcGISMap from '@arcgis/core/Map.js';
import ArcGISMapView from '@arcgis/core/views/MapView.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
import Graphic from '@arcgis/core/Graphic.js';
import { getRentPressure } from '../services/api.js';

const RANK_COLORS = ['#3B82F6', '#78C6A3', '#F4B860', '#F1D36B', '#F59F65'];
const BASEMAP_OPTIONS = [
  {
    id: 'streets-vector',
    label: 'Streets',
    accent: '#0891b2',
  },
  {
    id: 'gray-vector',
    label: 'Light Gray',
    accent: '#64748b',
  },
  {
    id: 'topo-vector',
    label: 'Topographic',
    accent: '#0f766e',
  },
  // {
  //   id: 'osm-standard',
  //   label: 'OpenStreetMap',
  //   accent: '#2563eb',
  // },
  {
    id: 'hybrid',
    label: 'Hybrid',
    accent: '#7c3aed',
  },
];

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function svgToDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createRankPinSvg(rank, color, selected = false) {
  const stroke = selected ? '#0f172a' : 'rgba(255,255,255,0.96)';
  const shadow = selected ? 'rgba(15,23,42,0.26)' : 'rgba(15,23,42,0.18)';
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="78" viewBox="0 0 64 78" fill="none">
      <defs>
        <filter id="shadow" x="0" y="0" width="64" height="78" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="${shadow}"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path d="M32 68C32 68 52 47.62 52 31C52 19.95 43.05 11 32 11C20.95 11 12 19.95 12 31C12 47.62 32 68 32 68Z" fill="white"/>
        <path d="M32 64C32 64 48 45.29 48 31.3C48 22.57 40.84 15.5 32 15.5C23.16 15.5 16 22.57 16 31.3C16 45.29 32 64 32 64Z" fill="${color}" stroke="${stroke}" stroke-width="${selected ? '3.2' : '2.4'}"/>
        <circle cx="32" cy="31" r="13.5" fill="rgba(255,255,255,0.24)"/>
        <text x="32" y="36.2" text-anchor="middle" font-family="Inter, SF Pro Display, Arial, sans-serif" font-size="18" font-weight="700" fill="white">${rank}</text>
      </g>
    </svg>
  `;
}

function createAnchorSvg(type) {
  const config =
    type === 'university'
      ? { color: '#F3B857', glyph: 'U' }
      : { color: '#8EA5D8', glyph: 'M' };
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
      <defs>
        <filter id="anchor-shadow" x="0" y="0" width="34" height="34" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="rgba(15,23,42,0.16)"/>
        </filter>
      </defs>
      <g filter="url(#anchor-shadow)">
        <circle cx="17" cy="17" r="11.5" fill="white" stroke="rgba(148,163,184,0.28)" />
        <circle cx="17" cy="17" r="8" fill="${config.color}" fill-opacity="0.22" />
        <text x="17" y="20.4" text-anchor="middle" font-family="Inter, SF Pro Display, Arial, sans-serif" font-size="10" font-weight="700" fill="#475569">${config.glyph}</text>
      </g>
    </svg>
  `;
}

function createActiveHaloSvg() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="92" height="92" viewBox="0 0 92 92" fill="none">
      <circle cx="46" cy="46" r="20" fill="rgba(59,130,246,0.12)" />
      <circle cx="46" cy="46" r="28" stroke="rgba(59,130,246,0.35)" stroke-width="2" stroke-dasharray="4 5" />
    </svg>
  `;
}

function catchmentPolygon(lng, lat, radiusMiles = 3, points = 72) {
  const ring = [];
  const latRad = (lat * Math.PI) / 180;
  const dLat = radiusMiles / 69;
  const dLng = radiusMiles / (69 * Math.cos(latRad));
  for (let i = 0; i <= points; i += 1) {
    const angle = (i / points) * Math.PI * 2;
    ring.push([lng + dLng * Math.cos(angle), lat + dLat * Math.sin(angle)]);
  }
  return ring;
}

function strategyLabel(value) {
  if (value === 'gap') return 'Gap Finder';
  if (value === 'cluster') return 'Join Hotspot';
  if (value === 'both') return 'Show Both';
  return value;
}

function popupHtml(loc) {
  const s = loc.scores || {};
  return `
    <div style="font-family:Inter,Arial,sans-serif;padding:4px 2px;color:#0f172a">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px">
        <div>
          <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#64748b;margin-bottom:4px">Recommended Zone</div>
          <div style="font-size:18px;font-weight:700;line-height:1.1">Rank #${loc.rank}</div>
        </div>
        <div style="min-width:52px;height:52px;border-radius:999px;border:1px solid rgba(148,163,184,0.25);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;background:#f8fafc">${Math.round(loc.totalScore ?? 0)}</div>
      </div>
      <table style="width:100%;font-size:12px;border-collapse:collapse">
        <tr><td style="padding:4px 0;color:#64748b">Population</td><td style="padding:4px 0;text-align:right">${Math.round(s.populationScore ?? 0)}/20</td></tr>
        <tr><td style="padding:4px 0;color:#64748b">Income</td><td style="padding:4px 0;text-align:right">${Math.round(s.incomeScore ?? 0)}/20</td></tr>
        <tr><td style="padding:4px 0;color:#64748b">Anchors</td><td style="padding:4px 0;text-align:right">${Math.round(s.anchorScore ?? 0)}/20</td></tr>
        <tr><td style="padding:4px 0;color:#64748b">Competitors</td><td style="padding:4px 0;text-align:right">${Math.round(s.competitorScore ?? 0)}/20</td></tr>
        <tr><td style="padding:4px 0;color:#64748b">Foot Traffic</td><td style="padding:4px 0;text-align:right">${Math.round(s.footScore ?? 0)}/20</td></tr>
        <tr><td style="padding:4px 0;color:#64748b">Catchment</td><td style="padding:4px 0;text-align:right">${Math.round(s.catchmentScore ?? 0)}/20</td></tr>
      </table>
      <div style="height:1px;background:#e2e8f0;margin:10px 0"></div>
      <table style="width:100%;font-size:12px;border-collapse:collapse">
        <tr><td style="padding:4px 0;color:#64748b">Population</td><td style="padding:4px 0;text-align:right">${(loc.population ?? 0).toLocaleString()}</td></tr>
        <tr><td style="padding:4px 0;color:#64748b">Median Income</td><td style="padding:4px 0;text-align:right">$${(loc.medianIncome ?? 0).toLocaleString()}</td></tr>
        <tr><td style="padding:4px 0;color:#64748b">Nearest Anchor</td><td style="padding:4px 0;text-align:right">${loc.nearestAnchor ?? '—'}</td></tr>
      </table>
    </div>
  `;
}

export default function MapView({ results, activeLocation, layerVisibility, loading, city, mapRef, basemapId = 'streets-vector' }) {
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  const layersRef = useRef({});
  const [legendMinimized, setLegendMinimized] = useState(false);
  const [summaryMinimized, setSummaryMinimized] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const gridLayer = new GraphicsLayer({ id: 'grid' });
    const competitorLayer = new GraphicsLayer({ id: 'competitors' });
    const universityLayer = new GraphicsLayer({ id: 'universities' });
    const mallLayer = new GraphicsLayer({ id: 'malls' });
    const catchmentLayer = new GraphicsLayer({ id: 'catchment' });
    const top5Layer = new GraphicsLayer({ id: 'top5' });
    const labelLayer = new GraphicsLayer({ id: 'labels' });
    const rentPressureLayer = new GraphicsLayer({ id: 'rentPressure', title: 'rentPressure' });
    rentPressureLayer.visible = false;

    const map = new ArcGISMap({
      basemap: basemapId,
      layers: [
        gridLayer,
        rentPressureLayer,
        catchmentLayer,
        competitorLayer,
        universityLayer,
        mallLayer,
        labelLayer,
        top5Layer,
      ],
    });

    const view = new ArcGISMapView({
      container: containerRef.current,
      map,
      center: [-98.5795, 39.8283],
      zoom: 4,
      constraints: { snapToZoom: false },
      popup: {
        dockEnabled: false,
        collapseEnabled: false,
      },
    });

    view.when(() => {
      view.popup.viewModel.includeDefaultActions = false;
    });

    viewRef.current = view;
    layersRef.current = {
      gridLayer,
      competitorLayer,
      universityLayer,
      mallLayer,
      catchmentLayer,
      top5Layer,
      labelLayer,
      rentPressure: rentPressureLayer,
    };

    if (mapRef) {
      mapRef.current = {
        loadRentHeatmap: async (lat, lng) => {
          const data = await getRentPressure({ lat, lng });
          const layer = layersRef.current.rentPressure;
          if (!layer) return { success: false, pointCount: 0 };
          layer.removeAll();
          layer.visible = true;

          data.pressureData.forEach((point) => {
            let color;
            if (point.pressureIndex < 0.33) color = [80, 186, 138, 110];
            else if (point.pressureIndex < 0.66) color = [244, 184, 96, 125];
            else color = [236, 99, 86, 135];

            const bar =
              point.pressureIndex < 0.33
                ? '#50ba8a'
                : point.pressureIndex < 0.66
                  ? '#f4b860'
                  : '#ec6356';

            const content = `
              <div style="font-family:Inter,Arial,sans-serif;padding:6px 4px;color:#0f172a">
                <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#64748b;margin-bottom:4px">Leasing Pressure</div>
                <div style="font-size:22px;font-weight:700;margin-bottom:8px">${point.pressureScore}/100</div>
                <table style="width:100%;border-collapse:collapse;font-size:12px">
                  <tr><td style="padding:4px 0;color:#64748b">Median Income</td><td style="text-align:right;font-weight:600">$${(point.raw.income || 0).toLocaleString()}</td></tr>
                  <tr><td style="padding:4px 0;color:#64748b">Total Population</td><td style="text-align:right;font-weight:600">${(point.raw.totalPop || 0).toLocaleString()}</td></tr>
                </table>
                <div style="margin-top:10px">
                  <div style="font-size:11px;color:#64748b">Pressure index</div>
                  <div style="background:#e2e8f0;border-radius:999px;height:8px;margin-top:6px;overflow:hidden">
                    <div style="width:${point.pressureScore}%;height:100%;border-radius:999px;background:${bar}"></div>
                  </div>
                </div>
                <p style="margin-top:10px;font-size:11px;color:#94a3b8;line-height:1.45">
                  Higher index indicates higher estimated commercial rent pressure. Source: US Census ACS 5-year (2022).
                </p>
              </div>`;

            layer.add(
              new Graphic({
                geometry: { type: 'point', latitude: point.lat, longitude: point.lng },
                symbol: {
                  type: 'simple-marker',
                  color,
                  size: 18,
                  outline: { color: [255, 255, 255, 0.75], width: 1 },
                },
                attributes: point,
                popupTemplate: {
                  title: 'Rent Pressure Estimate',
                  content,
                },
              })
            );
          });

          return { success: true, pointCount: data.pointCount };
        },
      };
    }

    return () => {
      view?.destroy();
      viewRef.current = null;
      layersRef.current = {};
      if (mapRef) mapRef.current = null;
    };
  }, [mapRef]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view?.map) return;
    if (view.map.basemap !== basemapId) {
      view.map.basemap = basemapId;
    }
  }, [basemapId]);

  useEffect(() => {
    const view = viewRef.current;
    const layers = layersRef.current;
    if (!view || !results) return;

    Object.values(layers).forEach((layer) => layer.removeAll());

    if (results.allCandidates) {
      results.allCandidates.forEach((candidate) => {
        layers.gridLayer.add(
          new Graphic({
            geometry: { type: 'point', longitude: candidate.lng, latitude: candidate.lat },
            symbol: {
              type: 'simple-marker',
              style: 'circle',
              color: [148, 163, 184, 0.16],
              size: 4,
              outline: { color: [148, 163, 184, 0.25], width: 0.5 },
            },
          })
        );
      });
    }

    (results.competitors || []).forEach((competitor) => {
      layers.competitorLayer.add(
        new Graphic({
          geometry: { type: 'point', longitude: competitor.lng, latitude: competitor.lat },
          symbol: {
            type: 'simple-marker',
            color: [232, 91, 86, 0.9],
            size: 7,
            outline: { color: [255, 255, 255, 0.95], width: 1.1 },
          },
          popupTemplate: {
            title: competitor.name || 'Competitor',
            content: 'Nearby competitor location',
          },
        })
      );
    });

    (results.anchors || []).forEach((anchor) => {
      const targetLayer = anchor.type === 'university' ? layers.universityLayer : layers.mallLayer;
      targetLayer.add(
        new Graphic({
          geometry: { type: 'point', longitude: anchor.lng, latitude: anchor.lat },
          symbol: {
            type: 'picture-marker',
            url: svgToDataUri(createAnchorSvg(anchor.type)),
            width: '18px',
            height: '18px',
          },
          popupTemplate: {
            title: anchor.name || (anchor.type === 'university' ? 'University' : 'Mall'),
            content: anchor.type === 'university' ? 'Anchor: university' : 'Anchor: shopping mall',
          },
        })
      );
    });

    (results.top5 || []).forEach((loc, idx) => {
      const color = RANK_COLORS[idx] || '#3B82F6';
      const selected = activeLocation?.rank === loc.rank;
      const [r, g, b] = hexToRgb(color);
      const ring = catchmentPolygon(loc.lng, loc.lat, 3, 72);

      layers.catchmentLayer.add(
        new Graphic({
          geometry: { type: 'polygon', rings: [ring] },
          symbol: {
            type: 'simple-fill',
            color: [r, g, b, selected ? 0.2 : 0.14],
            outline: {
              color: [r, g, b, selected ? 0.9 : 0.72],
              width: selected ? 2.6 : 2,
              style: 'solid',
            },
          },
          attributes: { rank: loc.rank },
        })
      );

      if (selected) {
        layers.labelLayer.add(
          new Graphic({
            geometry: { type: 'point', longitude: loc.lng, latitude: loc.lat },
            symbol: {
              type: 'picture-marker',
              url: svgToDataUri(createActiveHaloSvg()),
              width: '50px',
              height: '50px',
            },
          })
        );
      }

      layers.top5Layer.add(
        new Graphic({
          geometry: { type: 'point', longitude: loc.lng, latitude: loc.lat },
          symbol: {
            type: 'picture-marker',
            url: svgToDataUri(createRankPinSvg(loc.rank ?? idx + 1, color, selected)),
            width: selected ? '32px' : '28px',
            height: selected ? '39px' : '34px',
            yoffset: selected ? '8px' : '7px',
          },
          attributes: { rank: loc.rank, id: loc.id },
          popupTemplate: {
            title: `Location #${loc.rank} · ${Math.round(loc.totalScore ?? 0)}/100`,
            content: popupHtml(loc),
          },
        })
      );
    });

    if (results.cityCenter) {
      view.goTo(
        { center: [results.cityCenter.lng, results.cityCenter.lat], zoom: 12 },
        { duration: 1200, easing: 'ease-in-out' }
      );
    }
  }, [results, activeLocation]);

  useEffect(() => {
    const view = viewRef.current;
    const layers = layersRef.current;
    if (!view || !activeLocation) return;

    view.goTo(
      { center: [activeLocation.lng, activeLocation.lat], zoom: 14 },
      { duration: 900, easing: 'ease-in-out' }
    );

    const match = layers.top5Layer?.graphics?.find(
      (graphic) => graphic.attributes?.rank === activeLocation.rank
    );
    if (match) {
      view.openPopup({ features: [match], location: match.geometry });
    }
  }, [activeLocation]);

  useEffect(() => {
    const layers = layersRef.current;
    if (!layers.competitorLayer || !layerVisibility) return;
    layers.competitorLayer.visible = layerVisibility.competitors !== false;
    layers.universityLayer.visible = layerVisibility.universities !== false;
    layers.mallLayer.visible = layerVisibility.malls !== false;
    layers.top5Layer.visible = layerVisibility.top5 !== false;
    layers.labelLayer.visible = layerVisibility.top5 !== false;
    layers.catchmentLayer.visible = layerVisibility.top5 !== false;
    layers.gridLayer.visible = layerVisibility.grid === true;
    if (layers.rentPressure) {
      layers.rentPressure.visible = layerVisibility.rentPressure ?? false;
    }
  }, [layerVisibility]);

  const info = results
    ? {
        city: results.city,
        category: results.category,
        strategy: strategyLabel(results.strategy),
        count: results.top5?.length ?? 0,
      }
    : null;
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#dff6f7]">
      <div ref={containerRef} className="absolute inset-0" />

      {info && (
        <div className="absolute left-5 top-5 z-10 max-w-[300px] rounded-[16px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.74)_0%,rgba(236,254,255,0.7)_100%)] px-4 py-3 shadow-[0_20px_40px_rgba(8,145,178,0.18)] backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[1.5rem] font-semibold tracking-[-0.04em] text-slate-900">
                {info.city}
              </div>
              <div className="mt-0.5 text-sm text-slate-500">
                {info.category} · {info.strategy}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSummaryMinimized((value) => !value)}
              className="rounded-lg border border-cyan-100 bg-white/80 px-2 py-1 text-[0.8rem] font-semibold leading-none text-slate-500 transition hover:border-cyan-200 hover:text-slate-800"
              aria-label={summaryMinimized ? 'Expand map summary' : 'Minimize map summary'}
            >
              {summaryMinimized ? '+' : '−'}
            </button>
          </div>
          {!summaryMinimized && (
            <div className="mt-3 flex items-center gap-2 border-t border-slate-200 pt-2.5">
              {RANK_COLORS.slice(0, info.count).map((color, index) => (
                <span
                  key={color}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white shadow-[0_8px_16px_rgba(15,23,42,0.12)]"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}
                >
                  {index + 1}
                </span>
              ))}
              <span className="ml-1 text-xs font-medium text-slate-500">
                {info.count} recommended zones
              </span>
            </div>
          )}
        </div>
      )}

      {info && (
        <div className="absolute bottom-5 right-5 z-10">
          <div className="rounded-[16px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(236,254,255,0.72)_100%)] px-3.5 py-3.5 shadow-[0_20px_40px_rgba(8,145,178,0.18)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Legend
              </div>
              <button
                type="button"
                onClick={() => setLegendMinimized((value) => !value)}
                className="rounded-lg border border-cyan-100 bg-white/80 px-2 py-1 text-[0.8rem] font-semibold leading-none text-slate-500 transition hover:border-cyan-200 hover:text-slate-800"
                aria-label={legendMinimized ? 'Expand legend' : 'Minimize legend'}
              >
                {legendMinimized ? '+' : '−'}
              </button>
            </div>
            {!legendMinimized && (
              <>
                <div className="mt-3 flex flex-col gap-2 text-xs text-slate-600">
                  <LegendRow color="#E85B56" label="Competitor" />
                  <LegendRow color="#F3B857" label="University" variant="anchor" glyph="U" />
                  <LegendRow color="#8EA5D8" label="Mall" variant="anchor" glyph="M" />
                  <LegendRow color="#7FB6FF" label="Catchment zone" variant="ring" />
                  <LegendRow color="#3B82F6" label="Top locations" variant="pin" />
                </div>
                <div className="mt-3 border-t border-slate-200 pt-2.5">
                  <div className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Rent Pressure
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <LegendSwatch color="#50ba8a" />
                    <LegendSwatch color="#f4b860" />
                    <LegendSwatch color="#ec6356" />
                  </div>
                </div>
              </>
            )}
            {legendMinimized && (
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-block h-3 w-3 rounded-full bg-[#E85B56]" />
                <span className="inline-block h-3 w-3 rounded-full bg-[#3B82F6]" />
                <span className="inline-block h-3 w-3 rounded-full border border-dashed border-[#7FB6FF]" />
              </div>
            )}
          </div>
        </div>
      )}

      {loading && <LoadingOverlay city={city} />}

      {results?.error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[rgba(224,247,250,0.72)] backdrop-blur-md">
          <div className="max-w-md rounded-[16px] border border-red-200 bg-white px-6 py-5 text-center shadow-[0_24px_48px_rgba(239,68,68,0.12)]">
            <div className="mb-2 text-2xl text-red-500">⚠️</div>
            <div className="text-sm font-semibold text-slate-900">Pipeline failed</div>
            <div className="mt-1 text-xs text-slate-500">
              {results.step ? `Step: ${results.step} — ` : ''}
              {results.message || 'Unknown error'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const LOADING_STAGES = [
  'Geocoding city',
  'Finding competitors',
  'Enriching demographics',
  'Scoring recommended zones',
];

function LoadingOverlay({ city }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStage((current) => (current + 1) % LOADING_STAGES.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[rgba(224,247,250,0.56)] backdrop-blur-sm">
      <div className="flex min-w-[280px] flex-col items-center gap-4 rounded-[18px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(236,254,255,0.72)_100%)] px-7 py-6 shadow-[0_30px_60px_rgba(8,145,178,0.22)] backdrop-blur-xl">
        <div className="h-12 w-12 rounded-full border-4 border-cyan-100 border-t-[#0891b2] animate-spin" />
        <div className="text-base font-semibold tracking-[-0.02em] text-slate-900">
          Analyzing {city || 'city'}
        </div>
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#0891b2]" />
          {LOADING_STAGES[stage]}
        </div>
      </div>
    </div>
  );
}

function LegendRow({ color, label, variant = 'dot', glyph }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="inline-flex h-5 w-5 items-center justify-center">
        {variant === 'ring' && (
          <span
            className="inline-block h-4 w-4 rounded-full border border-dashed"
            style={{ borderColor: color }}
          />
        )}
        {variant === 'pin' && (
          <span
            className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold text-white"
            style={{ backgroundColor: color }}
          >
            1
          </span>
        )}
        {variant === 'anchor' && (
          <span
            className="inline-flex h-4 w-4 items-center justify-center rounded-full border text-[9px] font-semibold"
            style={{ borderColor: `${color}55`, backgroundColor: `${color}33`, color: '#475569' }}
          >
            {glyph}
          </span>
        )}
        {variant === 'dot' && (
          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        )}
      </span>
      {label}
    </div>
  );
}

function LegendSwatch({ color }) {
  return <span className="inline-block h-3 w-7 rounded-full" style={{ backgroundColor: color }} />;
}
