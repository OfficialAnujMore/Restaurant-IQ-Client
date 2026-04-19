import { useEffect, useRef, useState } from 'react';
import ArcGISMap from '@arcgis/core/Map.js';
import ArcGISMapView from '@arcgis/core/views/MapView.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
import Graphic from '@arcgis/core/Graphic.js';
import { getRentPressure } from '../services/api.js';

const RANK_COLORS = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'];

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function catchmentPolygon(lng, lat, radiusMiles = 3, points = 36) {
  const ring = [];
  const latRad = (lat * Math.PI) / 180;
  const dLat = radiusMiles / 69;
  const dLng = radiusMiles / (69 * Math.cos(latRad));
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    ring.push([lng + dLng * Math.cos(angle), lat + dLat * Math.sin(angle)]);
  }
  return ring;
}

export default function MapView({ results, activeLocation, layerVisibility, loading, city, mapRef }) {
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  const layersRef = useRef({});

  // Init map once
  useEffect(() => {
    if (!containerRef.current) return;

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
      basemap: 'dark-gray-vector',
      layers: [
        gridLayer,
        rentPressureLayer,
        competitorLayer,
        universityLayer,
        mallLayer,
        catchmentLayer,
        top5Layer,
        labelLayer,
      ],
    });

    const view = new ArcGISMapView({
      container: containerRef.current,
      map,
      center: [-98.5795, 39.8283],
      zoom: 4,
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
            if (point.pressureIndex < 0.33) color = [34, 197, 94, 130];
            else if (point.pressureIndex < 0.66) color = [234, 179, 8, 130];
            else color = [239, 68, 68, 150];

            const bar = point.pressureIndex < 0.33
              ? '#22c55e'
              : point.pressureIndex < 0.66
                ? '#eab308'
                : '#ef4444';

            const content = `
              <div style="font-family:sans-serif;padding:8px">
                <div style="font-size:1.2rem;font-weight:bold;margin-bottom:8px">
                  Pressure Index: ${point.pressureScore}/100
                </div>
                <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
                  <tr>
                    <td style="padding:4px 0;color:#64748b">Median Income</td>
                    <td style="text-align:right;font-weight:600">$${(point.raw.income || 0).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#64748b">Total Population</td>
                    <td style="text-align:right;font-weight:600">${(point.raw.totalPop || 0).toLocaleString()}</td>
                  </tr>
                </table>
                <div style="margin-top:8px;padding:6px;background:#1e293b;border-radius:4px">
                  <div style="font-size:0.75rem;color:#94a3b8">Pressure bar:</div>
                  <div style="background:#334155;border-radius:4px;height:6px;margin-top:4px">
                    <div style="width:${point.pressureScore}%;height:100%;border-radius:4px;background:${bar}"></div>
                  </div>
                </div>
                <p style="margin-top:8px;font-size:0.7rem;color:#64748b;font-style:italic">
                  Higher index = higher estimated commercial rent pressure.
                  Source: US Census ACS 5-year (2022).
                </p>
              </div>`;

            layer.add(
              new Graphic({
                geometry: { type: 'point', latitude: point.lat, longitude: point.lng },
                symbol: { type: 'simple-marker', color, size: 16, outline: null },
                attributes: point,
                popupTemplate: {
                  title: 'Leasing Pressure Estimate',
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

  // Render results
  useEffect(() => {
    const view = viewRef.current;
    const layers = layersRef.current;
    if (!view || !results) return;

    Object.values(layers).forEach((l) => l.removeAll());

    // Grid candidates (optional layer)
    if (results.allCandidates) {
      results.allCandidates.forEach((c) => {
        layers.gridLayer.add(
          new Graphic({
            geometry: { type: 'point', longitude: c.lng, latitude: c.lat },
            symbol: {
              type: 'simple-marker',
              style: 'square',
              color: [100, 116, 139, 0.4],
              size: 4,
              outline: { color: [148, 163, 184, 0.6], width: 0.5 },
            },
          })
        );
      });
    }

    // Competitors
    (results.competitors || []).forEach((c) => {
      layers.competitorLayer.add(
        new Graphic({
          geometry: { type: 'point', longitude: c.lng, latitude: c.lat },
          symbol: {
            type: 'simple-marker',
            color: [239, 68, 68, 0.85],
            size: 8,
            outline: { color: [255, 255, 255, 1], width: 0.5 },
          },
          popupTemplate: { title: `🍽 Competitor — ${c.name}`, content: '' },
        })
      );
    });

    // Anchors (universities + malls)
    (results.anchors || []).forEach((a) => {
      if (a.type === 'university') {
        layers.universityLayer.add(
          new Graphic({
            geometry: { type: 'point', longitude: a.lng, latitude: a.lat },
            symbol: {
              type: 'simple-marker',
              style: 'diamond',
              color: [245, 158, 11, 0.9],
              size: 12,
              outline: { color: [255, 255, 255, 1], width: 1 },
            },
            popupTemplate: { title: `🎓 University — ${a.name}`, content: '' },
          })
        );
      } else if (a.type === 'mall') {
        layers.mallLayer.add(
          new Graphic({
            geometry: { type: 'point', longitude: a.lng, latitude: a.lat },
            symbol: {
              type: 'simple-marker',
              style: 'diamond',
              color: [168, 85, 247, 0.9],
              size: 12,
              outline: { color: [255, 255, 255, 1], width: 1 },
            },
            popupTemplate: { title: `🛍 Shopping Mall — ${a.name}`, content: '' },
          })
        );
      }
    });

    // Top 5 catchments, pins, and labels
    (results.top5 || []).forEach((loc, idx) => {
      const color = RANK_COLORS[idx] || '#3b82f6';
      const [r, g, b] = hexToRgb(color);
      const ring = catchmentPolygon(loc.lng, loc.lat, 3, 36);

      layers.catchmentLayer.add(
        new Graphic({
          geometry: { type: 'polygon', rings: [ring] },
          symbol: {
            type: 'simple-fill',
            color: [r, g, b, 0.1],
            outline: { color: [r, g, b, 0.5], width: 1.5, style: 'dash' },
          },
        })
      );

      const s = loc.scores || {};
      const popupContent = `
        <table style="width:100%;font-size:12px;border-collapse:collapse">
          <tr><td style="padding:2px 4px;color:#94a3b8">Population</td><td style="padding:2px 4px">${Math.round(s.populationScore ?? 0)}/20</td></tr>
          <tr><td style="padding:2px 4px;color:#94a3b8">Income</td><td style="padding:2px 4px">${Math.round(s.incomeScore ?? 0)}/20</td></tr>
          <tr><td style="padding:2px 4px;color:#94a3b8">Anchors</td><td style="padding:2px 4px">${Math.round(s.anchorScore ?? 0)}/20</td></tr>
          <tr><td style="padding:2px 4px;color:#94a3b8">Competitors</td><td style="padding:2px 4px">${Math.round(s.competitorScore ?? 0)}/20</td></tr>
          <tr><td style="padding:2px 4px;color:#94a3b8">Foot Traffic</td><td style="padding:2px 4px">${Math.round(s.footScore ?? 0)}/20</td></tr>
          <tr><td style="padding:2px 4px;color:#94a3b8">Catchment</td><td style="padding:2px 4px">${Math.round(s.catchmentScore ?? 0)}/20</td></tr>
          <tr><td colspan="2" style="border-top:1px solid #334155;padding-top:4px"></td></tr>
          <tr><td style="padding:2px 4px;color:#94a3b8">Population</td><td style="padding:2px 4px">${(loc.population ?? 0).toLocaleString()}</td></tr>
          <tr><td style="padding:2px 4px;color:#94a3b8">Median Income</td><td style="padding:2px 4px">$${(loc.medianIncome ?? 0).toLocaleString()}</td></tr>
          <tr><td style="padding:2px 4px;color:#94a3b8">Nearest Anchor</td><td style="padding:2px 4px">${loc.nearestAnchor ?? '—'}</td></tr>
        </table>`;

      layers.top5Layer.add(
        new Graphic({
          geometry: { type: 'point', longitude: loc.lng, latitude: loc.lat },
          symbol: {
            type: 'simple-marker',
            color: [r, g, b, 1],
            size: 22,
            outline: { color: [255, 255, 255, 1], width: 2 },
          },
          attributes: { rank: loc.rank, id: loc.id },
          popupTemplate: {
            title: `📍 Rank #${loc.rank} — Score: ${Math.round(loc.totalScore ?? 0)}/100`,
            content: popupContent,
          },
        })
      );

      layers.labelLayer.add(
        new Graphic({
          geometry: { type: 'point', longitude: loc.lng, latitude: loc.lat },
          symbol: {
            type: 'text',
            color: [255, 255, 255, 1],
            text: String(loc.rank ?? ''),
            font: { size: 9, weight: 'bold' },
          },
        })
      );
    });

    if (results.cityCenter) {
      view.goTo(
        { center: [results.cityCenter.lng, results.cityCenter.lat], zoom: 12 },
        { duration: 1200 }
      );
    }
  }, [results]);

  // Focus active location
  useEffect(() => {
    const view = viewRef.current;
    const layers = layersRef.current;
    if (!view || !activeLocation) return;

    view.goTo(
      { center: [activeLocation.lng, activeLocation.lat], zoom: 14 },
      { duration: 800 }
    );

    const match = layers.top5Layer?.graphics?.find(
      (g) => g.attributes?.rank === activeLocation.rank
    );
    if (match) {
      view.openPopup({ features: [match], location: match.geometry });
    }
  }, [activeLocation]);

  // Layer visibility
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
        strategy: results.strategy,
        count: results.top5?.length ?? 0,
      }
    : null;

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="absolute inset-0" />

      {info && (
        <div className="absolute top-4 left-4 bg-[#1e293b]/90 backdrop-blur border border-[#334155] rounded-lg px-4 py-3 shadow-lg">
          <div className="text-lg font-semibold text-slate-100">{info.city}</div>
          <div className="text-xs text-slate-400 mt-0.5">
            {info.category} · {info.strategy} · {info.count} locations found
          </div>
        </div>
      )}

      {info && (
        <div className="absolute bottom-4 right-4 bg-[#1e293b]/90 backdrop-blur border border-[#334155] rounded-lg px-3 py-2.5 shadow-lg">
          <div className="text-[0.65rem] uppercase tracking-wider text-slate-400 mb-1.5">
            Legend
          </div>
          <div className="flex flex-col gap-1 text-xs text-slate-200">
            <LegendRow color="#ef4444" label="Competitor" />
            <LegendRow color="#f59e0b" label="University" shape="diamond" />
            <LegendRow color="#a855f7" label="Mall" shape="diamond" />
            <LegendRow color="#22c55e" label="Drive-time zone" ring />
            <LegendRow color="#22c55e" label="Top 5 Location" />
          </div>
          <div className="mt-2 pt-2 border-t border-[#334155]">
            <div className="text-[0.6rem] uppercase tracking-wider text-slate-500 mb-1">
              Rent Pressure
            </div>
            <div className="flex flex-col gap-1 text-xs text-slate-200">
              <LegendRow color="#22c55e" label="Low" />
              <LegendRow color="#eab308" label="Medium" />
              <LegendRow color="#ef4444" label="High" />
            </div>
          </div>
        </div>
      )}

      {loading && <LoadingOverlay city={city} />}

      {results?.error && (
        <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="max-w-md bg-[#1e293b] border border-red-500/40 rounded-lg px-5 py-4 text-center">
            <div className="text-red-400 text-2xl mb-2">⚠️</div>
            <div className="text-sm text-slate-100 font-medium">Pipeline failed</div>
            <div className="text-xs text-slate-400 mt-1">
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
  'Geocoding city...',
  'Finding competitors...',
  'Enriching demographics...',
  'Scoring locations...',
];

function LoadingOverlay({ city }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStage((s) => (s + 1) % LOADING_STAGES.length), 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute inset-0 bg-[#0f172a]/70 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="flex flex-col items-center gap-4 px-6 py-5 bg-[#1e293b]/90 border border-[#334155] rounded-lg">
        <div className="w-10 h-10 border-4 border-[#334155] border-t-[#3b82f6] rounded-full animate-spin" />
        <div className="text-sm text-slate-100 font-medium">
          Analyzing {city || '...'}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
          {LOADING_STAGES[stage]}
        </div>
      </div>
    </div>
  );
}

function LegendRow({ color, label, shape = 'circle', ring = false }) {
  const style = ring
    ? { border: `1.5px dashed ${color}`, backgroundColor: 'transparent' }
    : { backgroundColor: color };
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block w-3 h-3"
        style={{ ...style, borderRadius: shape === 'circle' && !ring ? '9999px' : shape === 'diamond' ? '2px' : '9999px', transform: shape === 'diamond' ? 'rotate(45deg)' : 'none' }}
      />
      {label}
    </div>
  );
}
