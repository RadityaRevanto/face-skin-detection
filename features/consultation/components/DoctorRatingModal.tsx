import { useState } from "react";
import { X, Star, AlertCircle, Loader2 } from "lucide-react";
import { rateDoctor } from "@/lib/api/consultations-query";

interface DoctorRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
  doctorName: string;
  onSuccess: () => void;
}

export function DoctorRatingModal({ isOpen, onClose, doctorId, doctorName, onSuccess }: DoctorRatingModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setErrorMsg("Mohon pilih rating 1-5 bintang terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await rateDoctor(doctorId, rating, review);
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-800">Beri Ulasan</h2>
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            <X size={18} className="text-zinc-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="text-center mb-6">
            <h3 className="font-semibold text-zinc-900 mb-1">{doctorName}</h3>
            <p className="text-sm text-zinc-500">Bagaimana pengalaman konsultasi Anda dengan dokter ini?</p>
          </div>

          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
              <AlertCircle className="shrink-0 mt-0.5" size={18} />
              <p className="text-sm">{errorMsg}</p>
            </div>
          )}

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                disabled={isSubmitting}
                className="p-1 transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  size={40}
                  className={`transition-colors duration-200 ${
                    (hoveredRating || rating) >= star
                      ? "fill-amber-400 text-amber-400"
                      : "fill-zinc-100 text-zinc-200"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label htmlFor="review" className="block text-sm font-medium text-zinc-700 mb-2">
              Ulasan Anda (Opsional)
            </label>
            <textarea
              id="review"
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              disabled={isSubmitting}
              placeholder="Ceritakan pengalaman Anda di sini..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Kirim Ulasan"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
