import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { Crown, Users, Shield, ShieldOff } from "lucide-react";

interface UserManagementProps {
  currentUser: User;
}

export default function UserManagement({ currentUser }: UserManagementProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/users"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const makeAdminMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest("POST", `/api/users/${userId}/make-admin`, {});
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Usuario promocionado",
        description: "El usuario ahora tiene permisos de administrador",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeAdminMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest("POST", `/api/users/${userId}/remove-admin`, {});
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Permisos removidos",
        description: "El usuario ya no tiene permisos de administrador",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Users className="h-6 w-6 text-lavender-400" />
        <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
      </div>

      <div className="grid gap-4">
        {users.map((user: User) => (
          <Card key={user.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-white text-lg">{user.fullName}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {user.signature} • {user.age} años
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {user.isAdmin && (
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-lavender-300 border-lavender-300">
                    {user.rank}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-lavender-400">{user.totalTraces}</div>
                  <div className="text-gray-400">Trazos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold-400">{user.totalWords}</div>
                  <div className="text-gray-400">Palabras</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{user.totalActivities}</div>
                  <div className="text-gray-400">Actividades</div>
                </div>
              </div>

              <div className="text-sm text-gray-300 space-y-1">
                <p><span className="text-gray-400">Face Claim:</span> {user.faceClaim}</p>
                <p><span className="text-gray-400">Cumpleaños:</span> {user.birthday}</p>
                <p><span className="text-gray-400">Motivación:</span> {user.motivation}</p>
              </div>

              {currentUser.id !== user.id && (
                <div className="flex space-x-2">
                  {!user.isAdmin ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" className="btn-primary">
                          <Shield className="h-4 w-4 mr-2" />
                          Hacer Admin
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-800 border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Confirmar promoción</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-300">
                            ¿Estás seguro de que quieres dar permisos de administrador a {user.fullName}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-700 text-white border-gray-600">Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => makeAdminMutation.mutate(user.id)}
                            className="btn-primary"
                          >
                            Confirmar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <ShieldOff className="h-4 w-4 mr-2" />
                          Remover Admin
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-800 border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Confirmar remoción</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-300">
                            ¿Estás seguro de que quieres remover los permisos de administrador de {user.fullName}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-700 text-white border-gray-600">Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => removeAdminMutation.mutate(user.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Confirmar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}