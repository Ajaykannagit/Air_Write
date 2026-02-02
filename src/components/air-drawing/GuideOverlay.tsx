import React from 'react';

const GuideOverlay: React.FC = () => {
    return (
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>✋ Extend index finger to draw</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span>🎯 Draw slowly and clearly</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <span>⏱️ Pause briefly to complete</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideOverlay;
