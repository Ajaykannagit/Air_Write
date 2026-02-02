import React from 'react';
import { MessageSquare, Copy, Download, Share2, Volume2 } from 'lucide-react';
import { useStore } from '../store/useStore';

const TextDisplay: React.FC = React.memo(() => {
  const { recognizedText, clearHistory, lastUpdated } = useStore();
  const [copySuccess, setCopySuccess] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(recognizedText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([recognizedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `airscript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const shareText = async () => {
    if (navigator.share && recognizedText) {
      try {
        await navigator.share({
          title: 'AirScript AI Text',
          text: recognizedText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        copyToClipboard(); // Fallback to copy
      }
    } else {
      copyToClipboard(); // Fallback to copy
    }
  };

  const speakText = () => {
    if ('speechSynthesis' in window && recognizedText) {
      const utterance = new SpeechSynthesisUtterance(recognizedText);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500 p-2 rounded-lg">
            <MessageSquare className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Recognized Text</h3>
            <p className="text-xs text-gray-400">AI-powered handwriting recognition</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {recognizedText && (
            <>
              <button
                onClick={speakText}
                className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                title="Read aloud"
              >
                <Volume2 size={16} />
              </button>

              <button
                onClick={copyToClipboard}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105 ${copySuccess
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                title="Copy to clipboard"
              >
                <Copy size={16} />
                <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={shareText}
                className="flex items-center space-x-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                title="Share text"
              >
                <Share2 size={16} />
              </button>

              <button
                onClick={downloadText}
                className="flex items-center space-x-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                title="Download as file"
              >
                <Download size={16} />
              </button>
            </>
          )}

          <button
            onClick={clearHistory}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
            title="Clear all text"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="bg-black bg-opacity-50 rounded-lg p-6 min-h-[120px] border border-gray-600 backdrop-blur-sm">
        {recognizedText ? (
          <p className="text-xl text-gray-100 font-mono leading-relaxed break-words">
            {recognizedText}
          </p>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3">✋</div>
            <p className="text-gray-400 italic text-lg">
              Start drawing letters in the air...
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Extend your index finger and draw slowly for best results
            </p>
          </div>
        )}
      </div>

      {recognizedText && (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
          <div className="flex space-x-4">
            <span>Chars: <span className="text-blue-400 font-semibold">{recognizedText.length}</span></span>
            <span>Words: <span className="text-green-400 font-semibold">{recognizedText.trim().split(/\s+/).filter(word => word.length > 0).length}</span></span>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Just now'}
          </div>
        </div>
      )}
    </div>
  );
});

export default TextDisplay;