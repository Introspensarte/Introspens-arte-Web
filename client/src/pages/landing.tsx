import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { UserPlus, LogIn } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, var(--lavender-400) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, hsl(245, 58%, 51%) 0%, transparent 50%)`
        }}></div>
      </div>
      
      <div className="text-center z-10 max-w-2xl mx-auto px-6 animate-fade-in">
        <h1 className="font-serif text-6xl md:text-8xl font-bold mb-6 artistic-title leading-tight">
          𝐈𝐧𝐭𝐫𝐨𝐬𝐩𝐞𝐧𝐬
        </h1>
        <h2 className="font-serif text-2xl md:text-3xl text-lavender-200 mb-4 italic">
          /𝒂𝒓𝒕𝒆/
        </h2>
        <p className="text-gray-300 text-lg mb-12 leading-relaxed max-w-lg mx-auto">
          Un espacio para la introspección artística y la expresión literaria. 
          Donde cada trazo cuenta una historia y cada palabra construye un universo.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/register">
            <Button className="btn-primary px-8 py-4 rounded-full text-white font-medium text-lg min-w-[200px] shadow-lg">
              <UserPlus className="mr-2 h-5 w-5" />
              Registrarse
            </Button>
          </Link>
          <Link href="/login">
            <Button 
              variant="outline" 
              className="border-lavender-400 hover:bg-lavender-400 hover:text-dark-900 px-8 py-4 rounded-full text-lavender-400 font-medium text-lg min-w-[200px] transition-all duration-300"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
