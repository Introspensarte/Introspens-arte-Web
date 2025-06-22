import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { calculateTraces } from "@/lib/trace-calculator";
import { insertActivitySchema, type InsertActivity, type User } from "@shared/schema";

interface ActivityUploadProps {
  user: User;
}

export default function ActivityUpload({ user }: ActivityUploadProps) {
  const [calculatedTraces, setCalculatedTraces] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertActivity>({
    resolver: zodResolver(insertActivitySchema),
    defaultValues: {
      name: "",
      date: new Date().toISOString().split('T')[0],
      words: 0,
      type: "narrativa",
      comments: 0,
      link: "",
      description: "",
    },
  });

  const activityType = form.watch("type");
  const words = form.watch("words");
  const comments = form.watch("comments");

  useEffect(() => {
    const traces = calculateTraces(activityType, words, comments || 0);
    setCalculatedTraces(traces);
  }, [activityType, words, comments]);

  const uploadMutation = useMutation({
    mutationFn: async (data: InsertActivity) => {
      return await apiRequest("POST", "/api/activities", {
        ...data,
        userId: user.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "¡Actividad subida!",
        description: `Has ganado ${calculatedTraces} trazos.`,
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}/activities`] });
      queryClient.invalidateQueries({ queryKey: ["/api/rankings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error al subir actividad",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertActivity) => {
    uploadMutation.mutate(data);
  };

  const needsComments = activityType === "hilo" || activityType === "rol";

  return (
    <div className="glass-effect rounded-2xl p-8 animate-slide-up border-gray-700">
      <h2 className="font-serif text-3xl font-bold mb-6 text-lavender-200">Sube tu Actividad</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Nombre de la Actividad</FormLabel>
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
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Fecha</FormLabel>
                  <FormControl>
                    <Input 
                      type="date"
                      className="bg-dark-700 border-gray-600 text-white"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="words"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Palabras</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Número de palabras"
                      className="bg-dark-700 border-gray-600 text-white"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-dark-700 border-gray-600 text-white">
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-dark-700 border-gray-600">
                      <SelectItem value="narrativa">Narrativa</SelectItem>
                      <SelectItem value="microcuento">Microcuento</SelectItem>
                      <SelectItem value="drabble">Drabble</SelectItem>
                      <SelectItem value="hilo">Hilo</SelectItem>
                      <SelectItem value="rol">Rol</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {needsComments && (
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Comentarios/Respuestas</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Número de respuestas"
                      className="bg-dark-700 border-gray-600 text-white"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Link</FormLabel>
                <FormControl>
                  <Input 
                    type="url" 
                    placeholder="URL de la actividad"
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
                <FormLabel className="text-gray-300">Descripción Breve</FormLabel>
                <FormControl>
                  <Textarea 
                    className="bg-dark-700 border-gray-600 text-white resize-none"
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Calculated Traces Display */}
          <Card className="bg-dark-700 border-gray-600">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3 text-lavender-200">Trazos Calculados</h3>
              <div className="text-2xl font-bold text-green-400">
                {calculatedTraces} trazos
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Los trazos se calculan automáticamente según el tipo y contenido
              </p>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full btn-primary py-4 text-lg"
            disabled={uploadMutation.isPending}
          >
            <Plus className="mr-2 h-5 w-5" />
            {uploadMutation.isPending ? "Subiendo..." : "Subir Actividad"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
