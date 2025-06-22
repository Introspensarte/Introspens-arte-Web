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
    <div className="professional-card rounded-3xl p-10 animate-slide-up">
      <div className="flex items-start justify-between mb-12">
        <div>
          <h2 className="font-serif text-4xl font-bold mb-3 leading-tight">
            Bienvenido, <span className="gradient-text">{user.fullName}</span>
          </h2>
          <p className="text-gray-400 text-lg">Tu espacio creativo personal</p>
        </div>
        <div className="text-right">
          <div className="stats-card rounded-2xl p-4 min-w-[200px]">
            <div className="text-sm text-gray-400 mb-1">Rango Actual</div>
            <div className="font-serif text-xl text-lavender-300 font-semibold">{rankInfo.rank}</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="professional-card rounded-2xl p-8">
          <h3 className="font-serif text-xl font-semibold mb-6 gradient-text">Información Personal</h3>
          <div className="space-y-5">
            <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
              <span className="text-gray-400 font-medium">Firma:</span>
              <span className="text-lavender-300 font-semibold">{user.signature}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
              <span className="text-gray-400 font-medium">Edad:</span>
              <span className="text-white font-medium">{user.age} años</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
              <span className="text-gray-400 font-medium">Cumpleaños:</span>
              <span className="text-white font-medium">{user.birthday}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
              <span className="text-gray-400 font-medium">Facebook:</span>
              <a 
                href={user.facebookLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lavender-400 hover:text-lavender-200 transition-colors flex items-center font-medium hover:underline"
              >
                <Facebook className="mr-2 h-4 w-4" /> Ver perfil
              </a>
            </div>
            {user.isAdmin && (
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400 font-medium">Rol:</span>
                <Badge className="bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 font-bold">
                  Administrador
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="professional-card rounded-2xl p-8">
          <h3 className="font-serif text-xl font-semibold mb-6 gradient-text">Estadísticas</h3>
          <div className="space-y-6">
            <div className="stats-card rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Total de Trazos:</span>
                <span className="text-emerald-400 font-bold text-xl">{user.totalTraces.toLocaleString()}</span>
              </div>
            </div>
            <div className="stats-card rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Total de Palabras:</span>
                <span className="text-blue-400 font-bold text-xl">{user.totalWords.toLocaleString()}</span>
              </div>
            </div>
            <div className="stats-card rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Total de Actividades:</span>
                <span className="text-purple-400 font-bold text-xl">{user.totalActivities}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Achievement Badge */}
      {rankInfo.medal && (
        <div className="professional-card rounded-2xl p-8 text-center mb-8 border-2 border-gold-400/30">
          <div className="inline-block p-4 bg-gradient-to-br from-gold-500/20 to-gold-400/10 rounded-full mb-4">
            <Medal className="h-10 w-10 text-gold-400" />
          </div>
          <h3 className="font-serif text-2xl font-bold mb-3 gradient-text">Medalla Actual</h3>
          <p className="text-xl text-gold-300 font-medium">"{rankInfo.medal}"</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Face Claim */}
        <div className="professional-card rounded-2xl p-8">
          <h3 className="font-serif text-xl font-semibold mb-4 gradient-text">Face Claim</h3>
          <p className="text-gray-300 text-lg leading-relaxed">{user.faceClaim}</p>
        </div>

        {/* Motivation */}
        <div className="professional-card rounded-2xl p-8">
          <h3 className="font-serif text-xl font-semibold mb-4 gradient-text">Motivación</h3>
          <p className="text-gray-300 text-lg leading-relaxed">{user.motivation}</p>
        </div>
      </div>
    </div>
  );
}
