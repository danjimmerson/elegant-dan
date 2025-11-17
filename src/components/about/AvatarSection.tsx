import { useState, useEffect } from "react";
import professionalPhoto from "@/assets/dan-jimmerson-professional.jpg";
import { removeBackground } from "@/lib/backgroundRemoval";

export const AvatarSection = () => {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processImage = async () => {
      try {
        setIsProcessing(true);
        
        // Load the image
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = professionalPhoto;
        });

        // Remove background
        const blob = await removeBackground(img);
        const url = URL.createObjectURL(blob);
        setProcessedImage(url);
        setIsProcessing(false);
      } catch (err) {
        console.error("Failed to process image:", err);
        setError("Failed to process image");
        setIsProcessing(false);
        // Fallback to original image
        setProcessedImage(professionalPhoto);
      }
    };

    processImage();

    // Cleanup
    return () => {
      if (processedImage && processedImage.startsWith('blob:')) {
        URL.revokeObjectURL(processedImage);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {isProcessing ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Processing image...</p>
        </div>
      ) : (
        <div className="relative">
          <img 
            src={processedImage || professionalPhoto}
            alt="Dan Jimmerson - Marketing Executive"
            className="h-[400px] w-auto object-contain"
            style={{
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
            }}
          />
        </div>
      )}
    </div>
  );
};
