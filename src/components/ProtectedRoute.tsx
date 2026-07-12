import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, tenant, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">J</span>
          </div>
          <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  // Logged in but not an admin (no tenant) → must be a member
  if (!tenant) return <Navigate to="/member" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
