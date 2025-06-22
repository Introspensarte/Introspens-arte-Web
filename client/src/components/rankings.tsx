import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown } from "lucide-react";
import type { User } from "@shared/schema";

interface RankingsProps {
  type: "traces" | "words";
  user: User;
}

export default function Rankings({ type, user }: RankingsProps) {
  const { data: rankings, isLoading } = useQuery({
    queryKey: [`/api/rankings/${type}`],
  });

  const title = type === "traces" ? "Ranking Global - Trazos" : "Ranking Global - Palabras";
  const statKey = type === "traces" ? "totalTraces" : "totalWords";
  const statLabel = type === "traces" ? "trazos" : "palabras";

  const getRankIcon = (position: number) => {
    if (position === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
    if (position === 2) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (position === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return null;
  };

  const getRankBadge = (position: number) => {
    if (position === 1) return "bg-yellow-400 text-dark-900";
    if (position === 2) return "bg-gray-400 text-dark-900";
    if (position === 3) return "bg-amber-600 text-white";
    return "bg-lavender-400 text-dark-900";
  };

  if (isLoading) {
    return (
      <div className="glass-effect rounded-2xl p-8 animate-slide-up border-gray-700">
        <h2 className="font-serif text-3xl font-bold mb-6 text-lavender-200">{title}</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-dark-700 rounded-xl p-4 animate-pulse">
              <div className="h-16 bg-dark-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const userRankings = rankings?.rankings || [];
  const userPosition = userRankings.findIndex((u: User) => u.id === user.id) + 1;

  return (
    <div className="glass-effect rounded-2xl p-8 animate-slide-up border-gray-700">
      <h2 className="font-serif text-3xl font-bold mb-6 text-lavender-200">{title}</h2>
      
      {userPosition > 0 && (
        <Card className="bg-lavender-400/20 border-lavender-400 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge className={getRankBadge(userPosition)}>
                  #{userPosition}
                </Badge>
                <div>
                  <div className="font-semibold text-lavender-200">Tu posición</div>
                  <div className="text-sm text-lavender-400">{user.signature}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-lavender-200">
                  {user[statKey].toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">{statLabel}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-4">
        {userRankings.map((rankedUser: User, index: number) => {
          const position = index + 1;
          const isCurrentUser = rankedUser.id === user.id;
          
          return (
            <Card 
              key={rankedUser.id} 
              className={`${
                isCurrentUser 
                  ? "bg-lavender-400/10 border-lavender-400" 
                  : "bg-dark-700 border-gray-600"
              } hover:bg-dark-600 transition-colors`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Badge className={getRankBadge(position)}>
                        {position <= 3 && getRankIcon(position)}
                        {position <= 3 ? "" : `#${position}`}
                      </Badge>
                    </div>
                    <div>
                      <div className={`font-semibold ${isCurrentUser ? "text-lavender-200" : "text-white"}`}>
                        {rankedUser.fullName}
                      </div>
                      <div className="text-sm text-lavender-400">{rankedUser.signature}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      type === "traces" ? "text-green-400" : "text-blue-400"
                    }`}>
                      {rankedUser[statKey].toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">{statLabel}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {userRankings.length === 0 && (
        <Card className="bg-dark-700 border-gray-600">
          <CardContent className="p-8 text-center">
            <Trophy className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400">No hay datos de ranking disponibles aún.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
