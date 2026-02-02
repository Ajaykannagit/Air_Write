import React from 'react';

interface LoadingOverlayProps {
    isLoading: boolean;
    loadingProgress: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, loadingProgress }) => {
    if (!isLoading) return null;

    return (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center z-10 text-center px-6">
            <div>
                <div className="relative mb-6">
                    <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                    <div
                        className="absolute inset-0 rounded-full h-20 w-20 border-4 border-purple-500 border-b-transparent animate-spin mx-auto"
                        style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                    ></div>
                </div>
                <p className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Initializing AI Hand Tracking
                </p>
                <p className="text-gray-300 mb-4">Please allow camera access when prompted</p>
                <div className="w-64 h-3 bg-gray-700 rounded-full overflow-hidden mx-auto mb-2">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${loadingProgress}%` }}
                    />
                </div>
                <p className="text-sm text-gray-400">{loadingProgress}% loaded</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
