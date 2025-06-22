import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import PortalNav from "@/components/portal-nav";

export default function PortalPage() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="glass-effect border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="font-serif text-2xl font-bold text-lavender-200">𝐈𝐧𝐭𝐫𝐨𝐬𝐩𝐞𝐧𝐬</h1>
              <span className="text-gray-400">/</span>
              <span className="text-lavender-400 font-medium">{user.signature}</span>
            </div>
            <button 
              onClick={() => {
                logout();
                setLocation("/");
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </nav>

      <PortalNav user={user} />
    </div>
  );
}
