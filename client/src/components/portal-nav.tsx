import { useState } from "react";
import { User, Newspaper, Megaphone, ListTodo, Upload, Trophy, Medal, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserProfile from "./user-profile";
import ActivityUpload from "./activity-upload";
import Rankings from "./rankings";
import NewsSection from "./news-section";
import AdminContent from "./admin-content";
import type { User as UserType } from "@shared/schema";

interface PortalNavProps {
  user: UserType;
}

export default function PortalNav({ user }: PortalNavProps) {
  const [activeSection, setActiveSection] = useState("profile");

  const navigationItems = [
    { id: "profile", label: "Mi Perfil", icon: User },
    { id: "news", label: "Noticias", icon: Newspaper },
    { id: "announcements", label: "Avisos", icon: Megaphone },
    { id: "activities", label: "Actividades por Realizar", icon: ListTodo },
    { id: "upload", label: "Sube tu Actividad", icon: Upload },
    { id: "ranking-traces", label: "Ranking Trazos", icon: Trophy },
    { id: "ranking-words", label: "Ranking Palabras", icon: Medal },
    ...(user.isAdmin ? [{ id: "admin", label: "Panel Admin", icon: Crown }] : []),
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <UserProfile user={user} />;
      case "upload":
        return <ActivityUpload user={user} />;
      case "ranking-traces":
        return <Rankings type="traces" user={user} />;
      case "ranking-words":
        return <Rankings type="words" user={user} />;
      case "news":
        return <NewsSection type="news" user={user} />;
      case "announcements":
        return <NewsSection type="announcements" user={user} />;
      case "activities":
        return <AdminContent type="activities" user={user} />;
      case "admin":
        return <PortalAdminPage />;
      default:
        return <UserProfile user={user} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-4 gap-10">
        {/* Enhanced Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="professional-card rounded-3xl p-8 sticky top-28">
            <div className="mb-6">
              <h3 className="font-serif text-xl font-semibold gradient-text mb-2">Panel de Control</h3>
              <div className="w-12 h-px bg-gradient-to-r from-lavender-400 to-transparent"></div>
            </div>
            <nav className="space-y-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => setActiveSection(item.id)}
                    className={`nav-button w-full justify-start px-5 py-4 text-left rounded-xl transition-all duration-300 ${
                      isActive 
                        ? "bg-gradient-to-r from-lavender-500/20 to-lavender-400/10 text-lavender-300 border-lavender-400/40" 
                        : "text-gray-400 hover:text-lavender-300"
                    }`}
                  >
                    <Icon className={`mr-4 h-5 w-5 transition-all duration-300 ${
                      isActive ? "text-lavender-400 scale-110" : ""
                    }`} />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Enhanced Main Content Area */}
        <div className="lg:col-span-3">
          <div className="animate-fade-in">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}
