export function calculateTraces(type: string, words: number, comments: number = 0): number {
  switch (type) {
    case "narrativa":
      if (words >= 300 && words < 500) return 300;
      if (words >= 500 && words < 1000) return 400;
      if (words >= 1000 && words < 1500) return 500;
      if (words >= 1500 && words < 2000) return 600;
      break;
    
    case "microcuento":
      if (words < 100) return 100;
      break;
    
    case "drabble":
      if (words < 150) return 150;
      if (words < 200) return 200;
      break;
    
    case "hilo":
      if (comments < 5) return 100;
      if (comments < 10) return 150;
      break;
    
    case "rol":
      if (comments < 5) return 250;
      if (comments < 10) return 400;
      if (comments < 15) return 550;
      if (comments < 20) return 700;
      break;
    
    case "otro":
      // Other types: Encuesta, Collage, Poemas, Pinturas, Interpretación
      if (words <= 50) return 100; // Encuesta
      if (words <= 100) return 150; // Collage, Poemas
      return 200; // Pinturas, Interpretación
    
    default:
      return 0;
  }
  
  return 0;
}
