import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Camera, X, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { uploadApi } from '../../api/upload.api';
interface ChatInputProps {
    onSend: (message: string, images: string[]) => void;
    isLoading: boolean;
    onImageCapture?: (file: File) => void;
}

export default function ChatInput({
    onSend,
    isLoading,
    onImageCapture,
}: ChatInputProps) {
    const [message, setMessage] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if ((!message.trim() && !selectedImage) || isLoading) return;

        let imageUrl: string | null = null;

        try {
            if (selectedImage) {
                setIsUploading(true);

                const data = await uploadApi.uploadFile(selectedImage);
                imageUrl = data.file_url;

                setIsUploading(false);
            }

            onSend(message, imageUrl ? [imageUrl] : []);

            setMessage('');
            setSelectedImage(null);

        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            if (onImageCapture) {
                onImageCapture(file);
            }
        }
    };

    return (
        <div className="bg-white border-t border-slate-100 px-6 py-4 max-w-4xl mx-auto w-full">
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-3"
                    >
                        <div className="relative inline-block">
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Selected"
                                className="h-20 rounded-lg object-cover border border-slate-200"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 
                           flex items-center justify-center text-white"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 w-10 h-10 rounded-xl hover:bg-slate-100"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Camera className="w-5 h-5 text-slate-500" />
                </Button>

                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isLoading}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 
                       placeholder-slate-400 text-sm focus:outline-none focus:ring-2 
                       focus:ring-cyan-200 focus:bg-white transition-all"
                    />
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 w-10 h-10 rounded-xl hover:bg-slate-100"
                >
                    <Mic className="w-5 h-5 text-slate-500" />
                </Button>

                <Button
                    type="submit"
                    disabled={
                        isLoading || isUploading || (!message.trim() && !selectedImage)
                    }
                    className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 
                     hover:from-cyan-600 hover:to-teal-700 disabled:opacity-50"
                >
                    {isLoading || isUploading ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                        <Send className="w-5 h-5 text-white" />
                    )}
                </Button>
            </form>
        </div>
    );
}