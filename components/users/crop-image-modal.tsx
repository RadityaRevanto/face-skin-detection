"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut } from "lucide-react";

interface CropImageModalProps {
  imageSrc: string;
  onCropComplete: (croppedImageFile: File, croppedImageUrl: string) => void;
  onClose: () => void;
}

export function CropImageModal({ imageSrc, onCropComplete, onClose }: CropImageModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
  ): Promise<{ file: File; url: string }> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], "avatar-cropped.jpeg", { type: "image/jpeg" });
        resolve({
          file,
          url: URL.createObjectURL(blob),
        });
      }, "image/jpeg");
    });
  };

  const handleSave = async () => {
    try {
      if (croppedAreaPixels) {
        const { file, url } = await getCroppedImg(imageSrc, croppedAreaPixels);
        onCropComplete(file, url);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <h3 className="font-semibold text-lg text-zinc-800">Sesuaikan Foto</h3>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="relative h-64 sm:h-80 w-full bg-zinc-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <ZoomOut size={20} className="text-zinc-400 shrink-0" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(Number(e.target.value));
              }}
              className="w-full accent-emerald-500 h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
            />
            <ZoomIn size={20} className="text-zinc-400 shrink-0" />
          </div>
          
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1 rounded-xl h-11" onClick={onClose}>
              Batal
            </Button>
            <Button type="button" onClick={handleSave} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 shadow-md shadow-emerald-500/20">
              Terapkan Foto
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
