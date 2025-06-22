import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Medal, Facebook } from "lucide-react";
import type { User } from "@shared/schema";

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  const { data: userActivities } = useQuery({
    queryKey: [`/api/users/${user.id}/activities`],
  });

  const getRankInfo = (totalTraces: number) => {
    if (totalTraces >= 2000) return { rank: "Arquitecto del alma", medal: "Arquitecto de Personajes" };
    if (totalTraces >= 1500) return { rank: "Escritor de introspecciones", medal: "Lector de huellas" };
    if (totalTraces >= 1000) return { rank: "Narrador de atmósferas", medal: "Excelente narrador" };
    if (totalTraces >= 500) return { rank: "Voz en boceto", medal: "Susurros que germinan" };
    return { rank: "Alma en tránsito", medal: "" };
  };

  const rankInfo = getRankInfo(user.totalTraces);

  return (
    <div className="glass-effect rounded-2xl p-8 animate-slide-up border-gray-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold mb-2">
            Bienvenido, <span className="text-lavender-400">{user.fullName}</span>
          </h2>
          <p className="text-gray-300">Aquí tienes tu perfil artístico</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Rango Actual</div>
          <div className="font-serif text-xl text-lavender-400">{rankInfo.rank}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-dark-700 border-gray-600">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 text-lavender-200">Información Personal</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Firma:</span>
                <span className="text-lavender-400">{user.signature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Edad:</span>
                <span className="text-white">{user.age} años</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cumpleaños:</span>
                <span className="text-white">{user.birthday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Facebook:</span>
                <a 
                  href={user.facebookLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lavender-400 hover:text-lavender-200 transition-colors flex items-center"
                >
                  <Facebook className="mr-1 h-4 w-4" /> Ver perfil
                </a>
              </div>
              {user.isAdmin && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Rol:</span>
                  <Badge variant="secondary" className="bg-lavender-400 text-dark-900">
                    Administrador
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-700 border-gray-600">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 text-lavender-200">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total de Trazos:</span>
                <span className="text-green-400 font-bold">{user.totalTraces.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total de Palabras:</span>
                <span className="text-blue-400 font-bold">{user.totalWords.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total de Actividades:</span>
                <span className="text-purple-400 font-bold">{user.totalActivities}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Badge */}
      {rankInfo.medal && (
        <div className="bg-gradient-to-r from-lavender-400 to-purple-500 rounded-xl p-6 text-center">
          <Medal className="mx-auto h-8 w-8 mb-3" />
          <h3 className="font-serif text-xl font-bold mb-2">Medalla Actual</h3>
          <p className="text-lg">"{rankInfo.medal}"</p>
        </div>
      )}

      {/* Face Claim */}
      <Card className="bg-dark-700 border-gray-600 mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-lavender-200">Face Claim</h3>
          <p className="text-gray-300">{user.faceClaim}</p>
        </CardContent>
      </Card>

      {/* Motivation */}
      <Card className="bg-dark-700 border-gray-600 mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-lavender-200">Motivación</h3>
          <p className="text-gray-300 leading-relaxed">{user.motivation}</p>
        </CardContent>
      </Card>
    </div>
  );
}
