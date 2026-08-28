import { useState, useEffect } from "react";
import { X, Search, Star } from "lucide-react";
import { getDoctors } from "@/lib/api/consultations-query";

interface DoctorSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDoctor: (doctorId: string) => void;
}

export function DoctorSearchModal({ isOpen, onClose, onSelectDoctor }: DoctorSearchModalProps) {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchDoctors();
    }
  }, [isOpen]);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      // getDoctors from API proxy
      const res = await getDoctors(1); 
      // The API returns paginated structure: { data: [...], meta: {...} }
      setDoctors(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) => 
    doc.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    doc.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-800">Mulai Chat Baru</h2>
          <button onClick={onClose} className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
            <X size={18} className="text-zinc-600" />
          </button>
        </div>

        <div className="p-4 border-b border-zinc-100">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari nama atau spesialisasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center p-8 text-zinc-500 text-sm">
              Tidak ada dokter yang ditemukan
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
              <div 
                key={doctor.uuid}
                onClick={() => onSelectDoctor(doctor.uuid)}
                className="flex items-center gap-4 p-3 hover:bg-zinc-50 rounded-xl cursor-pointer transition-colors"
              >
                <img
                  src={doctor.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(doctor.full_name) + "&background=10b981&color=fff"}
                  alt={doctor.full_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900">{doctor.full_name}</h3>
                  <p className="text-xs text-emerald-600 mt-0.5 mb-1">
                    {doctor.doctor_verification?.specialization || "Dokter"}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Star size={12} className={doctor.rating_avg ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200"} />
                    <span className="font-medium text-zinc-700">
                      {doctor.rating_avg ? Number(doctor.rating_avg).toFixed(1) : "Belum ada rating"}
                    </span>
                    {doctor.rating_count > 0 && (
                      <span className="text-zinc-400">({doctor.rating_count} ulasan)</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
