import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, ExternalLink, User as UserIcon, Crown, Activity } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { User, Activity as ActivityType } from "@shared/schema";

interface UserProfileModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ user, isOpen, onClose }: UserProfileModalProps) {
  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/users", user?.id, "activities"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user?.id && isOpen,
  });

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl flex items-center space-x-2">
            <UserIcon className="h-6 w-6 text-lavender-400" />
            <span>Perfil de {user.fullName}</span>
            {user.isAdmin && (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica */}
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-lg">Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Firma</p>
                  <p className="text-white font-mono">{user.signature}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Edad</p>
                  <p className="text-white">{user.age} años</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Cumpleaños</p>
                  <p className="text-white flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-lavender-400" />
                    {user.birthday}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Face Claim</p>
                  <p className="text-white">{user.faceClaim}</p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Motivación</p>
                <p className="text-white mt-1">{user.motivation}</p>
              </div>

              {user.facebookLink && (
                <div>
                  <p className="text-gray-400 text-sm">Facebook</p>
                  <a 
                    href={user.facebookLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-lavender-400 hover:text-lavender-300 flex items-center mt-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver perfil
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-lg">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-lavender-400">{user.totalTraces}</div>
                  <div className="text-gray-400 text-sm">Trazos Totales</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gold-400">{user.totalWords}</div>
                  <div className="text-gray-400 text-sm">Palabras Totales</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{user.totalActivities}</div>
                  <div className="text-gray-400 text-sm">Actividades</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <Badge variant="outline" className="text-lavender-300 border-lavender-300">
                    {user.rank}
                  </Badge>
                  <div className="text-gray-400 text-sm mt-2">Rango</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actividades recientes */}
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center">
                <Activity className="h-5 w-5 mr-2 text-lavender-400" />
                Actividades Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-800 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity: ActivityType) => (
                    <div key={activity.id} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium">{activity.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{activity.date}</span>
                        <span>{activity.words} palabras</span>
                        <span>{activity.traces} trazos</span>
                      </div>
                      {activity.description && (
                        <p className="text-gray-300 text-sm mt-2">{activity.description}</p>
                      )}
                    </div>
                  ))}
                  {activities.length > 5 && (
                    <p className="text-gray-400 text-sm text-center">
                      Y {activities.length - 5} actividades más...
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No hay actividades registradas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}