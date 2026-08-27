import { ChevronLeft, ChevronRight } from "lucide-react";

interface NotificationsPaginationProps {
  currentPage: number;
  lastPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function NotificationsPagination({ currentPage, lastPage, isLoading, onPageChange }: NotificationsPaginationProps) {
  if (lastPage <= 1) return null;

  return (
    <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-between">
      <span className="text-xs font-medium text-slate-500">
        Halaman {currentPage} dari {lastPage}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || isLoading}
          className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 disabled:opacity-50 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(Math.min(lastPage, currentPage + 1))}
          disabled={currentPage === lastPage || isLoading}
          className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 disabled:opacity-50 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
