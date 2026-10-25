import { useRef, useState, useEffect } from 'react';

interface SignatureModalProps {
  title: string;
  onConfirm: (signature: string) => void;
  onClose: () => void;
}

export default function SignatureModal({ title, onConfirm, onClose }: SignatureModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    if ('touches' in e) {
      return { x: (e.touches[0].clientX - rect.left) * sx, y: (e.touches[0].clientY - rect.top) * sy };
    }
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setDrawing(true);
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDraw = () => setDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-[#141414] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl shadow-black/60"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {/* Drag handle for mobile sheet */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-semibold text-white/85">Assinatura Digital</h3>
            <p className="text-[11px] text-white/35 mt-0.5 leading-snug max-w-[300px]">{title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-white/25 hover:text-white/60 transition flex-shrink-0 ml-3 rounded-xl hover:bg-white/[0.05]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          <p className="text-[11px] text-white/30 mb-3">Assine no campo abaixo usando o dedo ou mouse:</p>

          <div className="rounded-xl overflow-hidden border border-white/[0.06] relative">
            <div className="absolute bottom-10 left-6 right-6 h-px bg-white/[0.06] pointer-events-none" />
            <canvas
              ref={canvasRef}
              width={460}
              height={180}
              className="w-full h-44 cursor-crosshair block touch-none"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
          </div>

          {!hasSignature && (
            <p className="text-center text-[11px] text-white/15 mt-2 italic">Assine aqui...</p>
          )}

          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={clearCanvas}
              className="min-h-[44px] px-4 py-2.5 text-[12px] text-white/35 hover:text-white/60 border border-white/[0.07] hover:border-white/15 rounded-xl transition"
            >
              Limpar
            </button>
            <div className="flex-1" />
            <button
              onClick={onClose}
              className="min-h-[44px] px-4 py-2.5 text-[12px] text-white/35 hover:text-white/60 border border-white/[0.07] rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              onClick={() => { const c = canvasRef.current; if (c) onConfirm(c.toDataURL()); }}
              disabled={!hasSignature}
              className="min-h-[44px] px-5 py-2.5 text-[12px] font-semibold bg-orange-500 hover:bg-orange-400 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl transition shadow-lg shadow-orange-500/20 active:scale-95"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
