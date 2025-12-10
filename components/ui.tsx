import React, { useState } from 'react';

export const Card: React.FC<{
    title: React.ReactNode;
    subTitle?: string;
    children: React.ReactNode;
    id?: string;
    contentClassName?: string;
    logo?: string;
}> = ({ title, subTitle, children, id, contentClassName, logo }) => {
    return (
        <div id={id} className="bg-white dark:bg-dark-card rounded-xl shadow-md border border-gray-200 dark:border-dark-border overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-4 border-b border-gray-100 dark:border-dark-border/50 bg-gradient-to-r from-gray-50 to-white dark:from-dark-card dark:to-slate-800">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            {title}
                        </h3>
                        {subTitle && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide font-medium">
                                {subTitle}
                            </p>
                        )}
                    </div>
                    {logo && (
                        <img src={logo} alt="Logo" className="h-8 w-8 object-contain opacity-80" />
                    )}
                </div>
            </div>
            <div className={`p-4 ${contentClassName || ''}`}>
                {children}
            </div>
        </div>
    );
};

export const TeamLogoWithFallback: React.FC<{
    src: string;
    alt: string;
    className?: string;
}> = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            // Fallback to a generic shield or transparent placeholder
            setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=random&color=fff&size=64`);
        }
    };

    return (
        <img 
            src={imgSrc || `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=random&color=fff&size=64`} 
            alt={alt} 
            className={`${className} bg-gray-50 dark:bg-white/5 rounded-full`}
            onError={handleError}
            loading="lazy"
        />
    );
};
