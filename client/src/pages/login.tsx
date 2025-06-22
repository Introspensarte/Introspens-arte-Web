import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { loginSchema, type LoginData } from "@shared/schema";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      signature: "#",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      return await apiRequest("POST", "/api/login", data);
    },
    onSuccess: (data) => {
      login(data.user);
      toast({
        title: "¡Bienvenido de vuelta!",
        description: `Hola ${data.user.fullName}`,
      });
      setLocation("/portal");
    },
    onError: (error: any) => {
      toast({
        title: "Error de autenticación",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-8 animate-slide-up">
          <Link href="/">
            <Button variant="ghost" className="text-lavender-400 hover:text-lavender-200 transition-colors mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          </Link>
          <h1 className="font-serif text-4xl font-bold mb-4">Bienvenido de Vuelta</h1>
          <p className="text-gray-300">Ingresa tu firma para continuar</p>
        </div>

        <Card className="glass-effect animate-slide-up border-gray-700">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="signature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Tu Firma</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="#TuFirma" 
                          className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-lavender-400 focus:ring-lavender-400"
                          style={{
                            backgroundColor: 'hsl(240, 8%, 12%)',
                            color: 'white',
                            borderColor: 'hsl(240, 6%, 16%)'
                          }}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full btn-primary py-6 text-xl font-bold mb-4 h-[60px]"
                  disabled={loginMutation.isPending}
                >
                  <LogIn className="mr-3 h-6 w-6" />
                  {loginMutation.isPending ? "Ingresando..." : "Ingresar al Portal"}
                </Button>

                <div className="text-center">
                  <Link href="/register">
                    <Button variant="link" className="text-lavender-400 hover:text-lavender-200 transition-colors">
                      ¿No tienes cuenta? Regístrate aquí
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
