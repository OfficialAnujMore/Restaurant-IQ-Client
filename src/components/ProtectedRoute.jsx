import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0f172a]">
        <div className="w-10 h-10 border-4 border-[#334155] border-t-[#3b82f6] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !token) return <Navigate to="/login" replace />;
  return children;
}
