import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertActivityToDoSchema, type InsertActivityToDo, type User } from "@shared/schema";

interface AdminContentProps {
  type: "activities";
  user: User;
}

export default function AdminContent({ type, user }: AdminContentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities-to-do"],
  });

  const form = useForm<InsertActivityToDo>({
    resolver: zodResolver(insertActivityToDoSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertActivityToDo) => {
      return await apiRequest("POST", "/api/activities-to-do", {
        ...data,
        authorId: user.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "¡Actividad creada!",
        description: "La actividad por realizar ha sido publicada exitosamente.",
      });
      form.reset();
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/activities-to-do"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear actividad",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertActivityToDo) => {
    createMutation.mutate(data);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Ayer";
    if (diffDays <= 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="glass-effect rounded-2xl p-8 animate-slide-up border-gray-700">
        <h2 className="font-serif text-3xl font-bold mb-6 text-lavender-200">Actividades por Realizar</h2>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-dark-700 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-dark-600 rounded mb-4"></div>
              <div className="h-20 bg-dark-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const items = activities?.activitiesToDo || [];

  return (
    <div className="glass-effect rounded-2xl p-8 animate-slide-up border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-3xl font-bold text-lavender-200">Actividades por Realizar</h2>
        {user.isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Actividad
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-lavender-200">
                  Crear Actividad por Realizar
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Título</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-dark-700 border-gray-600 text-white"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="bg-dark-700 border-gray-600 text-white resize-none"
                            rows={6}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full btn-primary"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? "Publicando..." : "Publicar"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="space-y-6">
        {items.map((item: any) => (
          <Card key={item.id} className="bg-dark-700 border-gray-600 hover:bg-dark-600 transition-colors">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-serif text-xl font-semibold text-lavender-200">
                  {item.title}
                </h3>
                <span className="text-sm text-gray-400">
                  {formatDate(item.createdAt)}
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-lavender-400">
                  Por {item.author?.signature || "Admin"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card className="bg-dark-700 border-gray-600">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400">No hay actividades por realizar disponibles aún.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
