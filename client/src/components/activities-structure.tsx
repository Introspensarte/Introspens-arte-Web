import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, Sparkles } from "lucide-react";
import type { User } from "@shared/schema";

interface ActivitiesStructureProps {
  user: User;
}

const aristas = [
  {
    id: 1,
    title: "𝐈. 𝐈𝐍𝐕𝐄𝐍𝐓𝐀𝐑𝐈𝐎 𝐃𝐄 𝐋𝐀 𝐕𝐈𝐃𝐀",
    albums: [
      "𝑰𝒏𝒗𝒆𝒏𝒕𝒂𝒓𝒊𝒐 𝒅𝒆 𝑺𝒆𝒏𝒕𝒊𝒅𝒐𝒔",
      "𝑪𝒐𝒎𝒑𝒓𝒂𝒔 𝒚 𝑫𝒊𝒍𝒆𝒎𝒂𝒔",
      "𝑪𝒂𝒓𝒕𝒂𝒔 𝒅𝒆𝒔𝒅𝒆 𝒍𝒂 𝒓𝒖𝒕𝒊𝒏𝒂",
      "𝑪𝒉𝒆𝒒𝒖𝒆𝒐𝒔 𝒚 𝒅𝒆𝒔𝒄𝒖𝒊𝒅𝒐𝒔"
    ]
  },
  {
    id: 2,
    title: "𝐈𝐈. 𝐌𝐀𝐏𝐀 𝐃𝐄𝐋 𝐈𝐍𝐂𝐎𝐍𝐒𝐂𝐈𝐄𝐍𝐓𝐄",
    albums: [
      "𝑪𝒐𝒏𝒗𝒆𝒓𝒔𝒂𝒄𝒊𝒐𝒏𝒆𝒔 𝒆𝒏 𝒆𝒍 𝒕𝒊𝒆𝒎𝒑𝒐",
      "𝑫𝒊𝒂𝒓𝒊𝒐 𝒅𝒆 𝒍𝒐𝒔 𝒔𝒖𝒆ñ𝒐𝒔",
      "𝑯𝒂𝒃𝒊𝒕𝒂𝒄𝒊𝒐𝒏𝒆𝒔 𝒔𝒊𝒏 𝒔𝒂𝒍𝒊𝒅𝒂𝒔"
    ]
  },
  {
    id: 3,
    title: "𝐈𝐈𝐈. 𝐄𝐂𝐎𝐒 𝐃𝐄𝐋 𝐂𝐎𝐑𝐀𝐙𝐎𝐍",
    albums: [
      "𝑪𝒊𝒄𝒂𝒕𝒓𝒊𝒄𝒆𝒔 𝑰𝒏𝒗𝒊𝒔𝒊𝒃𝒍𝒆𝒔",
      "𝑴𝒆𝒍𝒐𝒅𝒊𝒂𝒔 𝒆𝒏 𝒆𝒍 𝒂𝒊𝒓𝒆",
      "𝑻𝒆𝒓𝒏𝒖𝒓𝒂𝒔 𝒚 𝒕𝒓𝒂𝒊𝒄𝒊𝒐𝒏𝒆𝒔"
    ]
  },
  {
    id: 4,
    title: "𝐈𝐕. 𝐑𝐄𝐅𝐋𝐄𝐉𝐎𝐒 𝐄𝐍 𝐄𝐋 𝐓𝐈𝐄𝐌𝐏𝐎",
    albums: [
      "𝑺𝒖𝒔𝒖𝒓𝒓𝒐𝒔 𝒅𝒆 𝒐𝒕𝒓𝒂𝒔 𝒗𝒊𝒅𝒂𝒔",
      "𝑬𝒄𝒐𝒔 𝒅𝒆𝒍 𝒂𝒍𝒎𝒂",
      "𝑪𝒐𝒏𝒆𝒙𝒊𝒐𝒏 𝑬𝒔𝒑𝒊𝒓𝒊𝒕𝒖𝒂𝒍"
    ]
  },
  {
    id: 5,
    title: "𝐕. 𝐆𝐀𝐋𝐄𝐑𝐈𝐀 𝐃𝐄𝐋 𝐀𝐋𝐌𝐀",
    albums: [
      "𝑽𝒆𝒔𝒕𝒊𝒈𝒊𝒐𝒔 𝒅𝒆 𝒍𝒂 𝑴𝒐𝒅𝒂",
      "𝑶𝒃𝒓𝒂𝒔 𝒅𝒆𝒍 𝑺𝒆𝒓",
      "𝑬𝒍 𝒓𝒆𝒇𝒍𝒆𝒋𝒐 𝒅𝒆 𝒍𝒂𝒔 𝒑𝒂𝒍𝒂𝒃𝒓𝒂𝒔"
    ]
  }
];

export default function ActivitiesStructure({ user }: ActivitiesStructureProps) {
  const [openAristas, setOpenAristas] = useState<number[]>([]);

  const toggleArista = (aristaId: number) => {
    setOpenAristas(prev => 
      prev.includes(aristaId) 
        ? prev.filter(id => id !== aristaId)
        : [...prev, aristaId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BookOpen className="h-6 w-6 text-lavender-400" />
        <h2 className="text-3xl font-bold text-white">Actividades por Realizar</h2>
      </div>

      <p className="text-gray-300 text-lg leading-relaxed">
        Explora las cinco aristas del proyecto artístico. Cada arista contiene álbumes específicos donde puedes encontrar actividades inspiradoras para tu crecimiento creativo.
      </p>

      <div className="grid gap-6">
        {aristas.map((arista) => {
          const isOpen = openAristas.includes(arista.id);
          
          return (
            <Card key={arista.id} className="bg-gray-800/50 border-gray-700 overflow-hidden">
              <Collapsible>
                <CollapsibleTrigger
                  onClick={() => toggleArista(arista.id)}
                  className="w-full"
                >
                  <CardHeader className="hover:bg-gray-700/30 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-lavender-500 to-lavender-600 flex items-center justify-center">
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                          <CardTitle className="text-white text-xl font-serif">
                            {arista.title}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {arista.albums.length} álbumes disponibles
                          </CardDescription>
                        </div>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="h-5 w-5 text-lavender-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-lavender-400" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0 pb-6">
                    <div className="grid md:grid-cols-2 gap-4 ml-16">
                      {arista.albums.map((album, index) => (
                        <div 
                          key={index}
                          className="p-4 bg-gray-700/30 rounded-lg border border-gray-600 hover:border-lavender-400/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-lavender-400 rounded-full"></div>
                            <span className="text-gray-200 font-medium italic">
                              {album}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {user.isAdmin && (
        <Card className="bg-gradient-to-r from-gold-900/20 to-lavender-900/20 border-gold-400/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="h-5 w-5 text-gold-400" />
              <h3 className="text-lg font-semibold text-white">Nota para Administradores</h3>
            </div>
            <p className="text-gray-300">
              Al crear nuevas actividades, asegúrate de seleccionar la arista y álbum correspondiente para mantener la organización del proyecto artístico.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}