"use client";

import Markdown from "react-markdown";
import { getConcernDisplayName, translateSkinLabel } from "@/lib/utils/skin-labels";
import { Scan } from "lucide-react";

type ChatMessageContentProps = {
  content: string;
  type: string;
};

type ScanData = {
  kondisi: string;
  akurasi: string;
  probabilitas: Record<string, string>;
  tanggal: string;
  fotoUrl: string | null;
};

function tryParseJsonScan(content: string): ScanData | null {
  try {
    const parsed = JSON.parse(content);
    if (typeof parsed !== "object" || parsed === null) return null;
    if (!("kondisi" in parsed || "akurasi" in parsed || "fotoUrl" in parsed)) return null;
    return {
      kondisi: typeof parsed.kondisi === "string" ? parsed.kondisi : "",
      akurasi: typeof parsed.akurasi === "string" ? parsed.akurasi : "",
      probabilitas: typeof parsed.probabilitas === "object" && parsed.probabilitas !== null
        ? Object.fromEntries(
            Object.entries(parsed.probabilitas).map(([k, v]) => [k, String(v)]),
          )
        : {},
      tanggal: typeof parsed.tanggal === "string" ? parsed.tanggal : "",
      fotoUrl: typeof parsed.fotoUrl === "string" ? parsed.fotoUrl : null,
    };
  } catch {
    return null;
  }
}

function parseScanContent(content: string): ScanData | null {
  if (!content.includes("[DOKUMEN_HASIL_SCAN]")) return null;

  const kondisiMatch = content.match(/Kondisi:\s*([^\n🎯]+)/);
  const akurasiMatch = content.match(/Akurasi:\s*([^\n📊]+)/);
  const tanggalMatch = content.match(/Tanggal:\s*([^\n🖼📅]+)/);
  const fotoMatch = content.match(/Foto:\s*(https?:\/\/\S+)/);

  const probabilitas: Record<string, string> = {};
  const probSection = content.match(/Probabilitas Lain:\s*([^\n📅]+)/);
  if (probSection) {
    const entries = probSection[1].match(/(\w[\w\s]*?)\s*\((\d+%)\)/g);
    if (entries) {
      for (const entry of entries) {
        const m = entry.match(/([\w\s]+?)\s*\((\d+%)\)/);
        if (m) {
          const label = translateSkinLabel(m[1].trim());
          probabilitas[label] = m[2];
        }
      }
    }
  }

  return {
    kondisi: kondisiMatch?.[1]?.trim() ?? "",
    akurasi: akurasiMatch?.[1]?.trim() ?? "",
    probabilitas,
    tanggal: tanggalMatch?.[1]?.trim() ?? "",
    fotoUrl: fotoMatch?.[1]?.trim() ?? null,
  };
}

function extractScanDataFromRawText(content: string): ScanData | null {
  const kondisiMatch = content.match(/Kondisi[:\s]+([^\n,]+)/i);
  const akurasiMatch = content.match(/Akurasi[:\s]+([^\n,]+)/i);
  const tanggalMatch = content.match(/Tanggal[:\s]+([^\n,]+)/i);
  const fotoMatch = content.match(/Foto[:\s]*(https?:\/\/\S+)/i);

  const probabilitas: Record<string, string> = {};
  const probMatches = content.matchAll(/([\w\s]+?)\s*\((\d+%)\)/g);
  for (const m of probMatches) {
    const label = translateSkinLabel(m[1].trim());
    probabilitas[label] = m[2];
  }

  const hasData =
    kondisiMatch || akurasiMatch || tanggalMatch || fotoMatch || Object.keys(probabilitas).length > 0;
  if (!hasData) return null;

  return {
    kondisi: kondisiMatch?.[1]?.trim() ?? "",
    akurasi: akurasiMatch?.[1]?.trim() ?? "",
    probabilitas,
    tanggal: tanggalMatch?.[1]?.trim() ?? "",
    fotoUrl: fotoMatch?.[1]?.trim() ?? null,
  };
}

function ScanResultCard({ data }: { data: ScanData }) {
  const kondisiLabel = data.kondisi ? getConcernDisplayName(null, data.kondisi) : "Hasil Scan";

  return (
    <div className="w-full max-w-xs sm:max-w-sm rounded-xl overflow-hidden border border-emerald-200 bg-white shadow-sm my-1">
      {data.fotoUrl ? (
        <img
          src={data.fotoUrl}
          alt="Hasil scan"
          className="w-full h-36 object-cover"
        />
      ) : (
        <div className="w-full h-36 bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col items-center justify-center gap-2">
          <Scan className="h-10 w-10 text-emerald-300" strokeWidth={1.5} />
          <span className="text-xs text-emerald-400 font-medium">Foto Scan</span>
        </div>
      )}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">🔍</span>
          <span className="text-xs font-bold text-slate-900">{kondisiLabel}</span>
        </div>
        {data.akurasi && (
          <div className="flex items-center gap-2">
            <span className="text-sm">🎯</span>
            <span className="text-xs text-slate-600">Akurasi {data.akurasi}</span>
          </div>
        )}
        {Object.keys(data.probabilitas).length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Probabilitas Lain</span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(data.probabilitas).map(([label, val]) => (
                <span key={label} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                  {label} <span className="font-bold">{val}</span>
                </span>
              ))}
            </div>
          </div>
        )}
        {data.tanggal && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            <span className="text-sm">📅</span>
            <span className="text-[10px] text-slate-400">{data.tanggal}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function scanFallback(): ScanData {
  return {
    kondisi: "",
    akurasi: "",
    probabilitas: {},
    tanggal: "",
    fotoUrl: null,
  };
}

export function ChatMessageContent({ content, type }: ChatMessageContentProps) {
  const jsonScan = tryParseJsonScan(content);
  if (jsonScan) {
    return <ScanResultCard data={jsonScan} />;
  }

  const scanData = parseScanContent(content);
  if (scanData) {
    return <ScanResultCard data={scanData} />;
  }

  if (type === "scan_result") {
    const extracted = extractScanDataFromRawText(content);
    return <ScanResultCard data={extracted ?? scanFallback()} />;
  }

  return (
    <Markdown
      components={{
        h1: ({ children }) => <h1 className="text-base font-bold text-slate-900 mt-3 mb-1">{children}</h1>,
        h2: ({ children }) => <h2 className="text-sm font-bold text-slate-900 mt-3 mb-1">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-semibold text-slate-800 mt-2 mb-1">{children}</h3>,
        p: ({ children }) => <p className="text-[14.5px] leading-relaxed text-slate-700 mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 mb-2 text-sm text-slate-700">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside space-y-0.5 mb-2 text-sm text-slate-700">{children}</ol>,
        li: ({ children }) => <li className="text-[14px] leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
        em: ({ children }) => <em className="italic text-slate-600">{children}</em>,
        code: ({ children, className }) => {
          const isInline = !className;
          return isInline ? (
            <code className="bg-slate-100 text-emerald-700 px-1.5 py-0.5 rounded text-[13px] font-mono">{children}</code>
          ) : (
            <code className="block bg-slate-100 text-slate-800 p-3 rounded-lg text-[13px] font-mono overflow-x-auto mb-2">{children}</code>
          );
        },
        br: () => <br />,
      }}
    >
      {content}
    </Markdown>
  );
}
