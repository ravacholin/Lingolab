import React, { useRef, useState } from 'react';
import { Camera, Sparkles, X, ArrowRight } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string, mimeType: string, prompt?: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{base64: string, mimeType: string} | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const resizeImage = (file: File): Promise<{ base64: string, preview: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // SPEED OPTIMIZATION: Reduced max size from 800 to 512 for faster processing
          const MAX_SIZE = 512;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // SPEED OPTIMIZATION: Reduced quality to 0.5 to reduce payload size
          const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
          const base64 = dataUrl.split(',')[1];
          resolve({ base64, preview: dataUrl });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const { base64, preview } = await resizeImage(file);
      setPreview(preview);
      setImageData({ base64, mimeType: 'image/jpeg' });
      setIsProcessing(false);
    }
  };

  const handleAnalyze = () => {
    if (imageData) {
      onImageSelected(imageData.base64, imageData.mimeType, customPrompt);
    }
  };

  const handleRetake = () => {
    setPreview(null);
    setImageData(null);
    setCustomPrompt("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (preview) {
    return (
      <div className="flex flex-col h-full p-4 max-w-sm mx-auto">
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="relative w-full aspect-square border-2 border-black bg-white p-2 shadow-hard">
             <img src={preview} alt="Preview" className="w-full h-full object-cover border border-black" />
             <button 
               onClick={handleRetake}
               className="absolute -top-3 -right-3 p-2 bg-red-500 text-white border-2 border-black hover:bg-red-600 active:shadow-none shadow-hard-sm transition-all"
             >
               <X size={20} strokeWidth={3} />
             </button>
          </div>

          <div className="w-full space-y-2">
             <label className="block text-sm font-bold text-black uppercase tracking-wider">
               Context (Optional)
             </label>
             <div className="relative">
               <input
                 type="text"
                 value={customPrompt}
                 onChange={(e) => setCustomPrompt(e.target.value)}
                 placeholder="e.g. 'Flirting', 'Ordering coffee'..."
                 className="w-full p-4 bg-white border-2 border-black focus:outline-none focus:ring-0 focus:bg-lime-50 placeholder-gray-500 font-medium"
               />
               <div className="absolute right-4 top-1/2 -translate-y-1/2 text-black">
                 <Sparkles size={20} />
               </div>
             </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleAnalyze}
            className="w-full py-4 bg-lime-300 hover:bg-lime-400 text-black border-2 border-black font-black text-xl uppercase tracking-widest shadow-hard active:shadow-none transition-all flex items-center justify-center gap-3"
          >
            Generate
            <ArrowRight size={24} strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 py-12 px-4">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-black uppercase leading-none">Scan<br/>The<br/>World</h2>
        <p className="text-black font-medium border-l-4 border-black pl-4 text-left max-w-[200px] mx-auto mt-4">
          Snap a photo. Get useful phrases. Learn fast.
        </p>
      </div>

      <div className="w-full max-w-xs">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="w-full aspect-square bg-white border-2 border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex flex-col items-center justify-center gap-4 group"
        >
          <div className="p-4 border-2 border-black rounded-full bg-lime-300 group-hover:bg-lime-400 transition-colors">
             <Camera size={48} className="text-black" strokeWidth={2} />
          </div>
          <div className="text-center">
            <span className="block font-black text-2xl uppercase">
              {isProcessing ? "Loading..." : "Take Photo"}
            </span>
            <span className="text-sm font-bold underline decoration-2">
              or select from gallery
            </span>
          </div>
        </button>
        
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
        Powered by Gemini 2.5
      </div>
    </div>
  );
};

export default ImageUploader;