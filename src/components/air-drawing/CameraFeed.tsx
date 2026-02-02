import React from 'react';

interface CameraFeedProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ videoRef, isLoading, error, onRetry }) => {
    return (
        <>
            <video ref={videoRef} className="hidden" playsInline muted autoPlay />
            {error && !isLoading && (
                <div className="absolute inset-0 bg-red-900/95 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-white text-center px-6 max-w-md">
                        <div className="text-6xl mb-4">⚠️</div>
                        <p className="text-xl font-bold mb-3">Camera Access Required</p>
                        <p className="text-gray-200 mb-6 text-sm leading-relaxed">{error}</p>
                        <button
                            onClick={onRetry}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                        >
                            🔄 Retry Camera Access
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CameraFeed;
