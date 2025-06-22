import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Users, Settings } from "lucide-react";
import AdminContent from "@/components/admin-content";
import UserManagement from "@/components/user-management";

export default function PortalAdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("content");

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Crown className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h2>
          <p className="text-gray-400">No tienes permisos de administrador</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Crown className="h-6 w-6 text-gold-400" />
        <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="content" className="text-white data-[state=active]:bg-lavender-600">
            <Settings className="h-4 w-4 mr-2" />
            Gestión de Contenido
          </TabsTrigger>
          <TabsTrigger value="users" className="text-white data-[state=active]:bg-lavender-600">
            <Users className="h-4 w-4 mr-2" />
            Gestión de Usuarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <AdminContent type="activities" user={user} />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UserManagement currentUser={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}