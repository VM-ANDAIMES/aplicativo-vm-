import { useEffect, useRef } from 'react';
import logoSrc from '../imports/LOGO_FUNDO-3.png';

export default function VMAndaimesLogo({ className = 'h-8 w-auto' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = logoSrc;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max - min;
        const brightness = (r + g + b) / 3;

        // White / near-white background → fully transparent
        if (saturation < 30 && brightness > 200) {
          d[i + 3] = 0;
          continue;
        }

        // Anti-aliased edge pixels (light gray, low saturation) → fade out
        if (saturation < 50 && brightness > 150) {
          d[i + 3] = Math.round(((255 - brightness) / 105) * 255);
          continue;
        }

        // Black / dark gray with low saturation → convert to bright white
        if (saturation < 50 && brightness < 120) {
          const whiteness = 1 - brightness / 120;
          d[i]     = Math.round(r + (255 - r) * whiteness);
          d[i + 1] = Math.round(g + (255 - g) * whiteness);
          d[i + 2] = Math.round(b + (255 - b) * whiteness);
          // Boost opacity for crisp rendering
          d[i + 3] = Math.min(255, Math.round(180 + whiteness * 75));
          continue;
        }

        // Colored pixels (orange, etc.) — boost saturation & brightness
        if (saturation >= 50) {
          const boost = 1.15;
          d[i]     = Math.min(255, Math.round(r * boost));
          d[i + 1] = Math.min(255, Math.round(g * boost));
          d[i + 2] = Math.min(255, Math.round(b * boost));
          d[i + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ imageRendering: 'auto' }}
    />
  );
}
