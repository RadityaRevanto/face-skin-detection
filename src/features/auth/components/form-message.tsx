type FormMessageProps = {
  message?: string;
  isSuccess?: boolean;
};

export function FormMessage({ message, isSuccess }: FormMessageProps) {
  if (!message) return null;

  return (
    <div
      className={[
        "rounded-xl px-4 py-3 text-sm font-semibold",
        isSuccess
          ? "bg-emerald-50 text-emerald-700"
          : "bg-rose-50 text-rose-700",
      ].join(" ")}
    >
      {message}
    </div>
  );
}
