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
      {/* Enhanced Navigation Header */}
      <nav className="glass-effect border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="font-serif text-3xl font-bold artistic-title">𝐈𝐧𝐭𝐫𝐨𝐬𝐩𝐞𝐧𝐬</h1>
              <div className="h-6 w-px bg-gradient-to-b from-transparent via-lavender-400 to-transparent"></div>
              <div className="flex items-center space-x-3">
                <span className="text-lavender-300 font-semibold text-lg">{user.signature}</span>
                {user.isAdmin && (
                  <span className="px-3 py-1 bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 rounded-full text-xs font-bold">
                    ADMIN
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={() => {
                logout();
                setLocation("/");
              }}
              className="px-4 py-2 text-gray-400 hover:text-white transition-all duration-300 hover:bg-gray-800 rounded-lg"
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
