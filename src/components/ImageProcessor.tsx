import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Trash2, Download, Upload } from "lucide-react";
import imageCompression from 'browser-image-compression';
import { removeBackground } from '@imgly/background-removal';

interface ProcessedImage {
  original: File | null;
  originalUrl: string;
  processed: Blob | null;
  processedUrl: string | null;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

const SETTINGS = {
  upload: {
    maxSize: 10 * 1024 * 1024,
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    types: ['image/jpeg', 'image/png', 'image/webp']
  },
  processing: {
    model: "u2net",
    format: "image/png",
    quality: 0.9
  }
};

export const ImageProcessor: React.FC = () => {
  const [image, setImage] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (image?.originalUrl) {
        URL.revokeObjectURL(image.originalUrl);
      }
      if (image?.processedUrl) {
        URL.revokeObjectURL(image.processedUrl);
      }
    };
  }, [image]);

  const processImage = useCallback(async (file: File): Promise<Blob> => {
    try {
      setProgress(0);
      
      const result = await removeBackground(file, {
        model: SETTINGS.processing.model,
        progress: (p) => {
          const progressValue = Math.floor(p * 100);
          setProgress(progressValue);
        },
        output: {
          format: SETTINGS.processing.format,
          quality: SETTINGS.processing.quality,
        }
      });
      
      return new Blob([result], { type: SETTINGS.processing.format });
    } catch (error) {
      console.error('Processing error:', error);
      throw error;
    }
  }, []);

  const handleImageUpload = useCallback(async (files: FileList | File[]) => {
    if (!files.length) return;

    const file = files[0];
    if (!SETTINGS.upload.types.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image",
        variant: "destructive",
      });
      return;
    }

    if (file.size > SETTINGS.upload.maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image under 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      // Clean up previous image
      if (image?.originalUrl) {
        URL.revokeObjectURL(image.originalUrl);
      }
      if (image?.processedUrl) {
        URL.revokeObjectURL(image.processedUrl);
      }

      const compressedFile = await imageCompression(file, {
        maxSizeMB: SETTINGS.upload.maxSize / (1024 * 1024),
        maxWidthOrHeight: Math.max(SETTINGS.upload.maxWidth, SETTINGS.upload.maxHeight),
        useWebWorker: true,
        fileType: file.type as any,
      });

      const originalUrl = URL.createObjectURL(compressedFile);

      setImage({
        original: compressedFile,
        originalUrl,
        processed: null,
        processedUrl: null,
        name: file.name,
        status: 'pending'
      });

      toast({ 
        title: "Upload successful", 
        description: "Image ready for processing" 
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  }, [image, toast]);

  const handleProcess = useCallback(async () => {
    if (!image?.original || isProcessing) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const processedBlob = await processImage(image.original);
      const processedUrl = URL.createObjectURL(processedBlob);

      setImage(prev => {
        if (prev?.processedUrl) {
          URL.revokeObjectURL(prev.processedUrl);
        }
        return {
          ...prev!,
          processed: processedBlob,
          processedUrl: processedUrl,
          status: 'completed'
        };
      });

      toast({
        title: "Success",
        description: "Image processed successfully"
      });
    } catch (error) {
      console.error('Processing error:', error);
      setImage(prev => prev ? { ...prev, status: 'failed' } : null);
      toast({
        title: "Processing failed",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [image, isProcessing, processImage, toast]);

  const handleDelete = useCallback(() => {
    if (!image) return;

    if (image.originalUrl) {
      URL.revokeObjectURL(image.originalUrl);
    }
    if (image.processedUrl) {
      URL.revokeObjectURL(image.processedUrl);
    }

    setImage(null);
    setProgress(0);
    setIsProcessing(false);

    toast({
      title: "Deleted",
      description: "Image has been removed"
    });
  }, [image, toast]);

  const handleDownload = useCallback(() => {
    if (!image?.processed || !image.processedUrl) return;

    const a = document.createElement('a');
    a.href = image.processedUrl;
    a.download = `${image.name.replace(/\.[^/.]+$/, '')}_processed.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [image]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          {!image ? (
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-gray-200'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleImageUpload(e.dataTransfer.files);
              }}
            >
              <div className="mx-auto w-16 h-16 mb-4">
                <Upload className="w-full h-full text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Upload an Image</h3>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop your image here, or click below
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                Choose Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept={SETTINGS.upload.types.join(',')}
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div>
                  <h3 className="font-medium mb-2">Original Image</h3>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={image.originalUrl} 
                      alt="Original" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Processed Image */}
                <div>
                  <h3 className="font-medium mb-2">Processed Image</h3>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {image.processedUrl ? (
                      <img 
                        src={image.processedUrl} 
                        alt="Processed" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {isProcessing ? (
                          <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Processing... {progress}%</p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Click Process to remove background
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>

                <Button
                  onClick={image.processedUrl ? handleDownload : handleProcess}
                  disabled={isProcessing}
                  className="w-full sm:w-auto"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : image.processedUrl ? (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </>
                  ) : (
                    'Process'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};