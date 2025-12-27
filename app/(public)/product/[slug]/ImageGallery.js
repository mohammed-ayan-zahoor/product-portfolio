"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ImageGallery({ images, title }) {
    const [activeImage, setActiveImage] = useState(images?.[0] || '');

    if (!images || images.length === 0) {
        return (
            <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-slate-100 border border-slate-200 text-slate-400">
                No Image Available
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="aspect-square w-full overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 shadow-inner group relative">
                <img
                    src={activeImage}
                    alt={title}
                    className="h-full w-full object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex flex-wrap gap-4 px-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveImage(img)}
                            className={cn(
                                "h-16 w-16 overflow-hidden rounded-xl border-2 transition-all p-1 bg-white",
                                activeImage === img ? "border-primary ring-2 ring-primary/10 shadow-lg" : "border-transparent hover:border-slate-200"
                            )}
                        >
                            <img src={img} className="h-full w-full object-cover rounded-md" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
