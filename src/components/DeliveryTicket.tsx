import React, { useEffect } from 'react';
import { PedidosYaLogo } from './PedidosYaLogo';
import { audioEngine } from '../utils/audioEngine';
import { CheckCircle2, ShieldCheck, MapPin, User, Receipt, CreditCard } from 'lucide-react';

interface DeliveryTicketProps {
  onOpenOrder: () => void;
  isOpening?: boolean;
}

export const DeliveryTicket: React.FC<DeliveryTicketProps> = ({
  onOpenOrder,
  isOpening = false,
}) => {
  // Play the characteristic POS terminal print chatter + approved double beep on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      audioEngine.playPosnetPrintAndBeep();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-md mx-auto select-none">
      {/* 
        THERMAL RECEIPT PAPER TICKET CONTAINER
        With perforated zigzag edges, official PedidosYa styling, and stamped seal
      */}
      <div
        className={`relative bg-[#FFFDF7] text-slate-800 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-2 border-slate-200/80 p-3.5 sm:p-6 transition-all duration-500 overflow-hidden ${
          isOpening ? 'scale-95 opacity-50 blur-[1px]' : 'animate-scale-up'
        }`}
      >
        {/* Subtle thermal paper texture background */}
        <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

        {/* Top Perforated Sawtooth Teeth */}
        <div className="absolute -top-1.5 left-0 right-0 flex justify-between overflow-hidden h-3 pointer-events-none">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 bg-slate-950 rotate-45 transform -translate-y-2 shrink-0 border border-slate-900"
            />
          ))}
        </div>

        {/* RECEIPT HEADER */}
        <div className="flex flex-col items-center border-b border-dashed border-slate-300 pb-4 mb-3">
          <div className="mb-2">
            <PedidosYaLogo size="sm" showSubtitle={false} />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500">
            <Receipt className="w-3.5 h-3.5 text-[#EA1D2C]" />
            <span>Comprobante Oficial de Entrega</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5">
            ORDEN #PY-84920-CBA
          </span>
        </div>

        {/* 
          POS TERMINAL / POSTNET DISPENSER SLOT
          The green "PAGADO Y ENTREGADO" badge feeds out animated like a POS receipt with sound
        */}
        <div className="mb-4">
          {/* Postnet Header Slot simulation */}
          <div className="bg-slate-900 text-slate-300 text-[10px] font-mono font-bold px-3 py-1 rounded-t-xl flex items-center justify-between border-t border-x border-slate-800 shadow-inner">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CreditCard className="w-3 h-3" />
              <span>TERMINAL POSNET ONLINE</span>
            </div>
            <span className="text-[9px] text-slate-400">AUT: #892144</span>
          </div>

          {/* Mechanical Ejection Slot */}
          <div className="w-full h-1 bg-slate-950 border-x border-slate-800 shadow-inner" />

          {/* STATUS BANNER: Ejected from POSNET with animation */}
          <div className="relative bg-emerald-50 border-2 border-emerald-500 rounded-b-2xl p-3 flex items-center justify-between shadow-md overflow-hidden animate-posnet-feed">
            <div className="flex items-center gap-2.5 z-10">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-pulse">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-emerald-900 uppercase tracking-wide flex items-center gap-1">
                  <span>Pedido Pagado y Entregado</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Transacción Aprobada · Postnet</span>
                </div>
              </div>
            </div>

            {/* Stamped Badge: Bounces into place after feed */}
            <div className="border-2 border-emerald-600 text-emerald-800 font-black text-[10px] px-2.5 py-0.5 rounded-lg uppercase tracking-wider bg-emerald-200/90 shadow-sm animate-stamp-bounce">
              100% PAGADO
            </div>
          </div>
        </div>

        {/* ORDER DETAILS BREAKDOWN (NO FECHA DE ENTREGA, AS REQUESTED) */}
        <div className="space-y-2.5 text-xs font-medium text-slate-700 mb-4 border-b border-dashed border-slate-300 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#EA1D2C]" />
              Destinataria:
            </span>
            <span className="font-extrabold text-slate-900 text-sm">
              Chinita ✨
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#EA1D2C]" />
              Destino:
            </span>
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Entrega especial a Córdoba
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-500">Contenido del paquete:</span>
            <span className="font-black text-[#EA1D2C] bg-red-50 px-2 py-0.5 rounded border border-red-200">
              1x Pedido Especial Caliente 🔥
            </span>
          </div>
        </div>

        {/* PAYMENT SUMMARY */}
        <div className="space-y-1.5 text-xs mb-5">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal (Comida Caliente):</span>
            <span className="font-mono">$0.00</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Envío Express a Córdoba:</span>
            <span className="font-mono text-emerald-600 font-bold">GRATIS (Pagado)</span>
          </div>
          <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>TOTAL PAGADO:</span>
            <span className="text-[#EA1D2C] font-black font-mono text-base">
              $0.00 (PAGADO ONLINE)
            </span>
          </div>
        </div>

        {/* THE REQUESTED BUTTON: "ABRIR PEDIDO" */}
        <div className="pt-1">
          <button
            onClick={onOpenOrder}
            disabled={isOpening}
            className="w-full relative group flex items-center justify-center gap-2 py-3 sm:py-4 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-[#FF1E46] via-[#EA1D2C] to-[#C40E20] hover:from-[#FF335A] hover:to-[#EA1D2C] text-white font-black text-sm sm:text-base shadow-[0_10px_30px_rgba(234,29,44,0.55)] border-2 border-amber-300/80 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-80 cursor-pointer overflow-hidden"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <span className="text-lg sm:text-xl">🔥</span>
            <span className="tracking-wide uppercase text-xs sm:text-base font-black">
              {isOpening ? 'Descargando Pedido...' : 'Abrir Pedido'}
            </span>
            <span className="text-lg sm:text-xl">📦</span>
          </button>
          <p className="text-[10px] sm:text-[11px] text-center text-slate-500 font-medium mt-1.5">
            ✨ Toca en <strong>Abrir Pedido</strong> para descargar tu foto sorpresa
          </p>
        </div>

        {/* Simulated Thermal Barcode at Bottom */}
        <div className="mt-3 pt-2.5 border-t border-dashed border-slate-300 flex flex-col items-center">
          <div className="flex items-center gap-[2px] h-6 sm:h-8 opacity-80">
            {[4, 2, 6, 2, 5, 2, 7, 3, 2, 6, 3, 5, 2, 8, 2, 4, 3, 6, 2, 4, 6, 2, 5, 3].map(
              (w, i) => (
                <div key={i} className="bg-slate-800 h-full" style={{ width: `${w}px` }} />
              )
            )}
          </div>
          <span className="text-[8.5px] sm:text-[9px] font-mono tracking-widest text-slate-400 mt-1">
            * CHINITA-CORDOBA-2026 *
          </span>
        </div>

        {/* Bottom Perforated Sawtooth Teeth */}
        <div className="absolute -bottom-1.5 left-0 right-0 flex justify-between overflow-hidden h-3 pointer-events-none">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 bg-slate-950 rotate-45 transform translate-y-2 shrink-0 border border-slate-900"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
