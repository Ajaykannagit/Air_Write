import { useEffect } from 'react';
import { Brain, Sparkles, Settings, Info, Zap } from 'lucide-react';
import AirDrawing from './components/AirDrawing';
import TextDisplay from './components/TextDisplay';
import ControlPanel from './components/ControlPanel';
import Onboarding from './components/Onboarding';
import { useStore } from './store/useStore';

function App() {
  const {
    showInstructions,
    showSettings,
    showAbout,
    showOnboarding,
    toggleUI
  } = useStore();

  // Check if it's the first visit
  useEffect(() => {
    console.log('🚀 AirScript AI Initialized');
    try {
      const hasVisited = localStorage.getItem('airscript_visited');
      if (!hasVisited) {
        toggleUI('showOnboarding', true);
        localStorage.setItem('airscript_visited', 'true');
      }
    } catch (error) {
      console.warn('LocalStorage not available:', error);
      // Fallback: show onboarding anyway if we can't check
      toggleUI('showOnboarding', true);
    }
  }, [toggleUI]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {showOnboarding && <Onboarding onComplete={() => toggleUI('showOnboarding', false)} />}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative bg-gray-900 bg-opacity-90 backdrop-blur-md border-b border-gray-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => toggleUI('showOnboarding', true)}
              >
                <Brain className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AirScript AI
                </h1>
                <p className="text-gray-300 flex items-center">
                  <Zap className="w-4 h-4 mr-1 text-yellow-400" />
                  Draw letters in the air, powered by AI
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => toggleUI('showAbout')}
                className={`bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 shadow-lg ${showAbout ? 'ring-2 ring-yellow-400' : ''}`}
              >
                <Sparkles size={18} />
                <span className="hidden sm:inline">About</span>
              </button>

              <button
                onClick={() => toggleUI('showSettings')}
                className={`bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 ${showSettings ? 'ring-2 ring-blue-500' : ''}`}
              >
                <Settings size={18} />
                <span className="hidden sm:inline">Settings</span>
              </button>

              <button
                onClick={() => {
                  toggleUI('showInstructions');
                  if (!showInstructions) toggleUI('showAbout', false);
                }}
                className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 shadow-lg ${showInstructions ? 'ring-2 ring-blue-400' : ''}`}
              >
                <Info size={18} />
                <span className="hidden sm:inline">{showInstructions ? 'Hide' : 'Show'} Guide</span>
                <span className="sm:hidden">Guide</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-250px)]">
          {/* Camera and Drawing Area */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-2xl h-full flex flex-col">
              <div className="relative flex-1 bg-black rounded-xl overflow-hidden shadow-inner">
                <AirDrawing />
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1 flex flex-col gap-6 overflow-hidden">
            <ControlPanel />

            <div className="flex-1 min-h-0">
              <TextDisplay />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;