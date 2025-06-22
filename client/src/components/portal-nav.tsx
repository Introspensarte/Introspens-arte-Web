import { useState } from "react";
import { User, Newspaper, Megaphone, ListTodo, Upload, Trophy, Medal } from "lucide-react";
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
      default:
        return <UserProfile user={user} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="glass-effect rounded-2xl p-6 sticky top-24 border-gray-700">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full justify-start px-4 py-3 text-gray-300 hover:bg-dark-700 hover:text-lavender-400 transition-colors ${
                      activeSection === item.id ? "bg-dark-700 text-lavender-400" : ""
                    }`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
