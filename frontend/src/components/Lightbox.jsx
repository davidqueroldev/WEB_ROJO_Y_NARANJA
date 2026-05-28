import { useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({ images, index, onClose, onGoTo }) {
  const stripRef = useRef(null);

  const onNext = useCallback(() => onGoTo((index + 1) % images.length), [index, images.length, onGoTo]);
  const onPrev = useCallback(() => onGoTo((index - 1 + images.length) % images.length), [index, images.length, onGoTo]);

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft")  onPrev();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, onNext, onPrev]);

  // Auto-scroll thumbnail strip to keep active thumb visible
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const thumb = strip.children[index];
    if (thumb) thumb.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
  }, [index]);

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Barra superior */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <span className="text-white/70 text-sm font-medium pointer-events-auto px-3 py-1 rounded-full bg-white/10">
          {index + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="pointer-events-auto w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Imagen principal */}
      <div
        className="relative max-w-6xl w-full mx-16 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={index}
          src={images[index]}
          alt={`Foto ${index + 1}`}
          className="max-h-[80vh] max-w-full w-auto object-contain rounded-xl shadow-2xl animate-fade-in"
          draggable={false}
        />
      </div>

      {/* Flechas laterales */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all hover:scale-110"
            aria-label="Anterior"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all hover:scale-110"
            aria-label="Siguiente"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Tira de miniaturas */}
      <div
        className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={stripRef}
          className="flex gap-2 overflow-x-auto justify-center"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onGoTo(i)}
              className={`shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                i === index
                  ? "ring-2 ring-white scale-110 opacity-100"
                  : "opacity-50 hover:opacity-80 hover:scale-105"
              }`}
              style={{ width: 60, height: 44 }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
