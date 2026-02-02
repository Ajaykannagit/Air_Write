import React from 'react';
import { History, Target } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface StatusOverlayProps {
    gestureStatus: 'ready' | 'drawing' | 'processing';
    confidence: number;
    isActive: boolean;
}

const StatusOverlay: React.FC<StatusOverlayProps> = ({
    gestureStatus,
    confidence,
    isActive
}) => {
    const { recognitionHistory } = useStore();

    return (
        <div className="absolute top-4 left-4 space-y-2 pointer-events-none">
            <div className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${gestureStatus === 'ready' ? 'bg-blue-500/90 text-white' :
                gestureStatus === 'drawing' ? 'bg-green-500/90 text-white animate-pulse' :
                    'bg-purple-500/90 text-white'
                }`}>
                {gestureStatus === 'ready' && '🟢 Ready to Draw'}
                {gestureStatus === 'drawing' && '✍️ Drawing...'}
                {gestureStatus === 'processing' && '🤖 Processing...'}
            </div>

            {confidence > 0 && (
                <div className="bg-gray-800/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs border border-gray-600">
                    Confidence: {Math.round(confidence * 100)}%
                </div>
            )}

            {/* History Feed */}
            <div className="flex flex-col gap-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1 flex items-center">
                    <History size={10} className="mr-1" /> Recent
                </span>
                <div className="flex flex-col gap-2">
                    {recognitionHistory.map((item, i) => (
                        <div key={i} className="flex flex-col bg-gray-900/40 rounded-lg p-2 border border-blue-500/10 min-w-[120px]">
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-white">{item.letter}</span>
                                <span className="text-[10px] text-blue-400 font-mono">{(item.confidence * 100).toFixed(0)}%</span>
                            </div>
                            {item.topPredictions && item.topPredictions.length > 1 && (
                                <div className="flex gap-1.5 mt-1 border-t border-gray-700/30 pt-1">
                                    {item.topPredictions.slice(1, 4).map((pred, idx) => (
                                        <div key={idx} className="flex items-center gap-0.5 opacity-50">
                                            <span className="text-[10px] text-gray-300">{pred.letter}</span>
                                            <span className="text-[8px] text-gray-500">{(pred.confidence * 100).toFixed(0)}%</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {recognitionHistory.length === 0 && (
                        <div className="text-[10px] text-gray-600 italic px-1">No letters recognized yet</div>
                    )}
                </div>
            </div>

            {isActive && (
                <div className="bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs border border-gray-600 flex items-center gap-1.5">
                    <Target size={12} className="text-green-400" />
                    AI Tracking Active
                </div>
            )}
        </div>
    );
};

export default StatusOverlay;
