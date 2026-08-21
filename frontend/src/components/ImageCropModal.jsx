import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { ZoomIn, ZoomOut, Check, X, Loader2, Crop } from 'lucide-react';

export default function ImageCropModal({ 
  imageSrc, 
  aspect = 1, 
  cropShape = 'round', 
  title = 'Crop Image', 
  onCropComplete, 
  onClose 
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onCropChange = (crop) => setCrop(crop);
  const onZoomChange = (zoom) => setZoom(zoom);

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    setProcessing(true);

    try {
      const image = new Image();
      image.src = imageSrc;
      image.crossOrigin = 'anonymous';

      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.92);
      await onCropComplete(croppedBase64);
    } catch (err) {
      console.error('Error cropping image:', err);
      alert('Failed to crop image.');
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="neon-border-box max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">{title}</h3>
              <p className="text-xs text-slate-400">Drag to reposition • Use slider to zoom</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative w-full h-80 sm:h-96 bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={true}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteHandler}
          />
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-4 px-2">
          <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 border border-slate-700 hover:border-white text-slate-300 hover:text-white text-xs font-black rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={processing}
            onClick={createCroppedImage}
            className="px-6 py-2.5 neon-airflow-btn text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xl flex items-center space-x-2"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>{processing ? 'Uploading...' : 'Crop & Save Photo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
