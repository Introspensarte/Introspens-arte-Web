import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertUserSchema, type InsertUser } from "@shared/schema";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      fullName: "",
      age: 18,
      birthday: "",
      faceClaim: "",
      signature: "#",
      motivation: "",
      facebookLink: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      return await apiRequest("POST", "/api/register", data);
    },
    onSuccess: () => {
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        title: "Error en el registro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertUser) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <Link href="/">
            <Button variant="ghost" className="text-lavender-400 hover:text-lavender-200 transition-colors mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Únete al Proyecto</h1>
          <p className="text-gray-300 text-lg">Comparte tu arte con nuestra comunidad</p>
        </div>

        {/* Registration Form */}
        <Card className="glass-effect animate-slide-up border-gray-700">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Nombre y Apellido</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Tu nombre completo" 
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
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Edad</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Tu edad"
                            className="bg-dark-700 border-gray-600 text-white"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 18)}
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
                    name="birthday"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Cumpleaños (dd/mm)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="15/03" 
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
                    name="faceClaim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Face Claim</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Personaje o referencia visual" 
                            className="bg-dark-700 border-gray-600 text-white"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="signature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Firma (inicia con #)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="#TuFirmaUnica" 
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
                  name="facebookLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Link de Facebook</FormLabel>
                      <FormControl>
                        <Input 
                          type="url" 
                          placeholder="https://facebook.com/tu-perfil" 
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
                  name="motivation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">¿Por qué desea ingresar al proyecto?</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Comparte tu motivación artística..." 
                          className="bg-dark-700 border-gray-600 text-white resize-none"
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full btn-primary py-4 text-lg"
                  disabled={registerMutation.isPending}
                >
                  <Palette className="mr-2 h-5 w-5" />
                  {registerMutation.isPending ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
