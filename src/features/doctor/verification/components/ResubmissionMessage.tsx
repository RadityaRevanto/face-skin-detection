type ResubmissionMessageProps = {
  message: string | null;
  isSuccess: boolean;
};

export function ResubmissionMessage({
  message,
  isSuccess,
}: ResubmissionMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${
        isSuccess
          ? "bg-emerald-50 text-emerald-700"
          : "bg-rose-50 text-rose-700"
      }`}
    >
      {message}
    </div>
  );
}
