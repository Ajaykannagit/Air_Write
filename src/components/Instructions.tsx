import React, { useState } from 'react';
import { Hand, Eye, Zap, Type, Target, Clock, Lightbulb, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const Instructions: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  
  const steps = [
    {
      icon: Eye,
      title: "Allow Camera Access",
      description: "Grant permission for the website to access your camera for hand tracking.",
      tip: "Ensure good lighting for better detection"
    },
    {
      icon: Hand,
      title: "Extend Index Finger",
      description: "Point your index finger towards the camera. The AI will track your fingertip.",
      tip: "Keep other fingers closed for better recognition"
    },
    {
      icon: Zap,
      title: "Draw in the Air",
      description: "Move your extended finger to draw letters in the air. Keep movements clear and deliberate.",
      tip: "Draw slowly and make letters large for best results"
    },
    {
      icon: Type,
      title: "Watch Text Appear",
      description: "Your air-drawn letters will be recognized and converted to text in real-time.",
      tip: "Pause between letters to complete recognition"
    }
  ];

  const supportedLetters = [
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => ({
      letter: l,
      description: `${l} - Full support`
    })),
    { letter: 'a-z', description: 'Lowercase (draw smaller)' }
  ];

  const tips = [
    "All 26 English letters (A-Z) are now supported!",
    "Draw smaller for lowercase letters (a-z)",
    "Draw letters 6-8 inches in size for uppercase",
    "Maintain consistent speed while drawing",
    "Pause 1-2 seconds between letters",
    "Use good lighting and plain background",
    "Keep your hand steady and avoid shaking",
    "Practice each letter for better recognition"
  ];

  const commonIssues = [
    "If not detected: Check camera permissions",
    "If shaky: Rest elbow on table",
    "If unclear: Draw larger letters",
    "If slow: Ensure good lighting"
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 shadow-xl transition-all duration-300 h-fit max-h-[calc(100vh-200px)] flex flex-col">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50 transition-colors rounded-t-lg flex-shrink-0 border-b border-gray-700"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
            <Lightbulb className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Guide</h3>
            <p className="text-xs text-gray-400">Click to {expanded ? 'collapse' : 'expand'}</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="text-gray-400" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
      </div>

      <div className={`overflow-hidden transition-all duration-300 flex-1 ${expanded ? 'opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 overflow-y-auto h-full space-y-4 scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
          {/* Getting Started */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-700/50">
            <div className="flex items-center mb-3">
              <Sparkles className="text-blue-400 mr-2" size={18} />
              <h4 className="font-semibold text-blue-200 text-sm">Getting Started</h4>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {steps.map((step, index) => (
                <div key={index} className="group p-3 bg-gray-900/50 rounded-lg border border-gray-600 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <step.icon size={18} className="text-white" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="font-semibold text-white text-sm mb-1 group-hover:text-blue-400 transition-colors duration-300">
                      {index + 1}. {step.title}
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed mb-1">{step.description}</p>
                    <p className="text-xs text-blue-400 italic flex items-center gap-1">
                      <span className="text-yellow-400">💡</span> {step.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supported Letters */}
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-4 border border-green-700/50">
            <div className="flex items-center mb-3">
              <Target className="text-green-400 mr-2" size={18} />
              <h4 className="font-semibold text-green-200 text-sm">Supported Letters & Shapes</h4>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-green-900/30">
              {supportedLetters.map((item, index) => (
                <div key={index} className="text-center p-2 bg-green-900/30 rounded-lg border border-green-600/50 hover:border-green-400 transition-colors">
                  <div className="text-base font-bold text-green-300 font-mono">{item.letter}</div>
                  <div className="text-xs text-green-400 mt-0.5 truncate" title={item.description}>{item.letter.length > 1 ? 'Lowercase' : item.letter}</div>
                </div>
              ))}
            </div>
            <p className="text-green-300 text-xs mt-3 text-center">All 26 letters + lowercase support!</p>
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-lg p-4 border border-amber-700/50">
            <div className="flex items-center mb-3">
              <Clock className="text-amber-400 mr-2" size={18} />
              <h4 className="font-semibold text-amber-200 text-sm">Pro Tips & Best Practices</h4>
            </div>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start text-xs text-amber-300">
                  <span className="text-amber-400 mr-2 mt-0.5 flex-shrink-0">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Troubleshooting */}
          <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-lg p-4 border border-red-700/50">
            <div className="flex items-center mb-3">
              <Zap className="text-red-400 mr-2" size={18} />
              <h4 className="font-semibold text-red-200 text-sm">Troubleshooting</h4>
            </div>
            <ul className="space-y-2">
              {commonIssues.map((issue, index) => (
                <li key={index} className="flex items-start text-xs text-red-300">
                  <span className="text-red-400 mr-2 mt-0.5 flex-shrink-0">⚡</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Performance Tips */}
          <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg p-3 border border-purple-700/50">
            <div className="text-center">
              <p className="text-xs text-purple-300">
                <strong>Tip:</strong> The AI improves with use! Keep practicing for better accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;