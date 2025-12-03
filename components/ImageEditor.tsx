import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Icons } from './Icon';

interface ImageEditorProps {
  onClose: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null); // Reset generated image on new upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;

    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Extract base64 data (remove data:image/jpeg;base64, prefix)
      const base64Data = selectedImage.split(',')[1];
      const mimeType = selectedImage.substring(selectedImage.indexOf(':') + 1, selectedImage.indexOf(';'));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            setGeneratedImage(`data:image/png;base64,${base64EncodeString}`);
            foundImage = true;
            break; 
          }
        }
      }

      if (!foundImage) {
        setError('لم يتم توليد صورة. حاول وصف التعديل بشكل مختلف.');
      }

    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء المعالجة. تأكد من مفتاح API وحاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gaming-800 w-full max-w-4xl rounded-2xl border border-gaming-accent shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-gaming-700 flex justify-between items-center bg-gaming-900">
          <div className="flex items-center gap-2 text-white">
            <div className="bg-gaming-accent/20 p-2 rounded-lg">
              <Icons.Wand className="text-gaming-accent" size={24} />
            </div>
            <h2 className="text-xl font-bold">محرر الصور الذكي (Nano Banana)</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-gaming-700 rounded-lg transition-colors"
          >
            <Icons.Close size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="bg-gaming-900/50 border-2 border-dashed border-gaming-700 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px] relative hover:border-gaming-accent/50 transition-colors group">
                {selectedImage ? (
                  <img src={selectedImage} alt="Original" className="w-full h-full object-contain rounded-lg max-h-[400px]" />
                ) : (
                  <div className="text-center text-gray-400">
                    <Icons.Image size={48} className="mx-auto mb-3 opacity-50 group-hover:scale-110 transition-transform" />
                    <p className="font-medium">اضغط لرفع صورة</p>
                    <p className="text-xs mt-1">أو اسحب الصورة هنا</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">وصف التعديل المطلوب</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="مثال: أضف فلتر قديم، احذف الخلفية..."
                    className="flex-1 bg-gaming-900 border border-gaming-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gaming-accent"
                  />
                  <button 
                    onClick={handleGenerate}
                    disabled={!selectedImage || !prompt || isLoading}
                    className="bg-gaming-accent hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                  >
                    {isLoading ? <Icons.Loader className="animate-spin" /> : <Icons.Wand size={20} />}
                    <span>تعديل</span>
                  </button>
                </div>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              </div>
            </div>

            {/* Output Section */}
            <div className="bg-gaming-900/30 border border-gaming-700 rounded-xl p-6 flex items-center justify-center min-h-[300px] relative">
              {isLoading ? (
                <div className="text-center text-gaming-accent">
                  <Icons.Loader size={48} className="mx-auto mb-4 animate-spin" />
                  <p className="animate-pulse">جاري معالجة الصورة...</p>
                  <p className="text-xs text-gray-500 mt-2">قد يستغرق هذا بضع ثوانٍ</p>
                </div>
              ) : generatedImage ? (
                <div className="relative w-full h-full flex flex-col items-center">
                   <img src={generatedImage} alt="Generated" className="w-full h-auto object-contain rounded-lg shadow-2xl border border-gaming-accent/20" />
                   <a 
                     href={generatedImage} 
                     download="edited-image.png"
                     className="mt-4 bg-gaming-success/10 text-gaming-success border border-gaming-success/50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gaming-success/20 transition-colors"
                   >
                     <Icons.Monitor size={16} /> تحميل الصورة
                   </a>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Icons.Wand size={48} className="mx-auto mb-3 opacity-20" />
                  <p>النتيجة ستظهر هنا</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;