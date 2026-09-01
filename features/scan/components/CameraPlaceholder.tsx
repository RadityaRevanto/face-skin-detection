"use client";

export function CameraPlaceholder() {
  return (
    <div className="absolute bottom-0 left-1/2 h-[500px] w-[420px] origin-bottom -translate-x-1/2 scale-[0.7] sm:scale-90 lg:scale-100">
      <div className="absolute left-1/2 top-10 h-44 w-60 -translate-x-1/2 rounded-t-full bg-slate-950" />
      <div className="absolute left-1/2 top-[92px] h-[240px] w-[205px] -translate-x-1/2 rounded-[46%] bg-illustration-skin-alt" />
      <div className="absolute left-[145px] top-[200px] h-3 w-3 rounded-full bg-slate-900" />
      <div className="absolute right-[145px] top-[200px] h-3 w-3 rounded-full bg-slate-900" />
      <div className="absolute left-1/2 top-[245px] h-3 w-12 -translate-x-1/2 rounded-full bg-rose-300" />
      <div className="absolute bottom-0 left-1/2 h-36 w-[380px] -translate-x-1/2 rounded-t-[120px] bg-white" />
    </div>
  );
}
