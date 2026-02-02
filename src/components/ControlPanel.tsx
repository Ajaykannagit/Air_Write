import React from 'react';
import { Settings, Sparkles, Brain, Zap, Trash2, Download, Palette, Move } from 'lucide-react';
import Instructions from './Instructions';
import { useStore } from '../store/useStore';

const ControlPanel: React.FC = () => {
    const {
        showInstructions,
        showSettings,
        toggleUI,
        showAbout,
        sensitivity,
        setSensitivity,
        timeoutVal,
        setTimeoutVal,
        brushColor,
        setBrushColor,
        strokeWidth,
        setStrokeWidth,
        clearHistory,
        recognizedText
    } = useStore();

    const colorPresets = [
        { name: 'Cyan', value: '#4ecdc4' },
        { name: 'Purple', value: '#a855f7' },
        { name: 'Green', value: '#22c55e' },
        { name: 'Yellow', value: '#eab308' },
        { name: 'Red', value: '#ef4444' },
        { name: 'White', value: '#ffffff' }
    ];

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([recognizedText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "airscript_note.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-6 overflow-hidden">
            {/* Instructions */}
            {showInstructions && <Instructions />}

            {/* About Panel */}
            {showAbout && (
                <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-lg p-4 border border-yellow-700/50 shadow-xl flex-shrink-0 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-600 scrollbar-track-yellow-900/30">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                            <div className="bg-yellow-600 p-2 rounded-lg mr-3">
                                <Sparkles className="text-white" size={18} />
                            </div>
                            <h3 className="text-lg font-semibold text-white">About AirScript AI</h3>
                        </div>
                        <button
                            onClick={() => toggleUI('showAbout', false)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            ×
                        </button>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        Experience the future of text input with our AI-powered air drawing technology.
                        Using advanced computer vision and hand tracking.
                    </p>

                    <div className="grid grid-cols-1 gap-4 mt-4">
                        <div className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Brain size={20} className="text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-1 text-sm">AI-Powered</h4>
                                <p className="text-gray-400 text-xs text-balance">Advanced ML for accurate recognition</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                            <div className="bg-green-500 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Zap size={20} className="text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-1 text-sm">Real-Time</h4>
                                <p className="text-gray-400 text-xs text-balance">Instant processing and feedback</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-700 shadow-xl flex-shrink-0 overflow-y-auto max-h-[500px] scrollbar-hide">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center">
                            <div className="bg-blue-600 p-2 rounded-xl mr-3 shadow-lg shadow-blue-500/20">
                                <Settings className="text-white" size={18} />
                            </div>
                            <h3 className="text-lg font-bold text-white tracking-tight">System Settings</h3>
                        </div>
                        <button
                            onClick={() => toggleUI('showSettings', false)}
                            className="p-1.5 bg-gray-700/50 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white transition-all shadow-inner"
                        >
                            <Settings size={16} className="rotate-90" />
                        </button>
                    </div>

                    <div className="space-y-5">
                        {/* Sensitivity */}
                        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-colors">
                            <div className="flex items-center justify-between mb-3 text-sm">
                                <span className="text-gray-300 font-medium">Recognition Sensitivity</span>
                                <span className="text-blue-400 font-mono py-0.5 px-2 bg-blue-500/10 rounded-md">{(sensitivity * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0.3"
                                max="0.9"
                                step="0.1"
                                value={sensitivity}
                                onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        {/* Brush Color */}
                        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-300">
                                <Palette size={14} className="text-blue-400" />
                                <span>Brush Color</span>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                                {colorPresets.map((c) => (
                                    <button
                                        key={c.value}
                                        onClick={() => setBrushColor(c.value)}
                                        className={`w-full aspect-square rounded-lg border-2 transition-all ${brushColor === c.value ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                                        style={{ backgroundColor: c.value }}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Stroke Width */}
                        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-300">
                                <Move size={14} className="text-blue-400" />
                                <span>Stroke Width</span>
                            </div>
                            <input
                                type="range"
                                min="2"
                                max="15"
                                step="1"
                                value={strokeWidth}
                                onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        {/* Drawing Timeout */}
                        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                            <h4 className="text-gray-300 font-medium mb-2 text-sm">Drawing Timeout</h4>
                            <select
                                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                value={timeoutVal}
                                onChange={(e) => setTimeoutVal(parseInt(e.target.value))}
                            >
                                <option value="1000">⚡ Fast (1.0s)</option>
                                <option value="1500">🛡️ Balanced (1.5s)</option>
                                <option value="2000">🐢 Careful (2.0s)</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2">
                        <button
                            onClick={clearHistory}
                            className="flex items-center justify-center space-x-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 py-3 rounded-xl border border-red-500/20 font-bold transition-all active:scale-95"
                        >
                            <Trash2 size={18} />
                            <span>Clear All Data</span>
                        </button>

                        <button
                            onClick={handleDownload}
                            disabled={!recognizedText}
                            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                            <Download size={18} />
                            <span>Download Text</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ControlPanel;
