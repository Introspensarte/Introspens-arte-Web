import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { UserPlus, LogIn } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, var(--lavender-500) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, var(--gold-500) 0%, transparent 40%),
              radial-gradient(circle at 40% 70%, hsl(280, 70%, 55%) 0%, transparent 35%),
              linear-gradient(135deg, transparent 30%, rgba(139, 127, 191, 0.05) 70%)
            `
          }}></div>
        </div>
        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-lavender-400 rounded-full animate-float opacity-60"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-gold-400 rounded-full animate-float opacity-40" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-lavender-300 rounded-full animate-float opacity-50" style={{animationDelay: '4s'}}></div>
        </div>
      </div>
      
      <div className="text-center z-10 max-w-4xl mx-auto px-6 animate-fade-in">
        <div className="mb-8">
          <h1 className="font-serif text-6xl md:text-8xl font-bold mb-6 artistic-title leading-tight tracking-tight">
            𝐈𝐧𝐭𝐫𝐨𝐬𝐩𝐞𝐧𝐬<span className="text-3xl md:text-4xl gradient-text italic">/𝒂𝒓𝒕𝒆/</span>
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-lavender-400 to-transparent mx-auto mb-8"></div>
        </div>
        
        <p className="text-gray-300 text-xl md:text-2xl mb-16 leading-relaxed max-w-3xl mx-auto font-light">
          Un espacio <span className="text-lavender-300 font-medium">exclusivo</span> para la introspección artística y la expresión literaria.<br/>
          Donde cada trazo cuenta una historia y cada palabra construye un universo.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          <Link href="/register">
            <Button className="btn-primary-glow px-12 py-6 rounded-2xl text-white font-bold text-xl w-[280px] h-[70px] shadow-2xl group">
              <UserPlus className="mr-3 h-6 w-6 transition-transform group-hover:scale-110" />
              Unirse al Proyecto
            </Button>
          </Link>
          <Link href="/login">
            <Button 
              variant="outline" 
              className="nav-button px-12 py-6 rounded-2xl text-lavender-300 font-bold text-xl w-[280px] h-[70px] group"
            >
              <LogIn className="mr-3 h-6 w-6 transition-transform group-hover:scale-110" />
              Acceder
            </Button>
          </Link>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm font-light tracking-wide">
            Una comunidad de escritores y artistas
          </p>
        </div>
      </div>
    </div>
  );
}
