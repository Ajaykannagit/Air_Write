import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Hand, Sparkles, Brain, CheckCircle2 } from 'lucide-react';

interface OnboardingProps {
    onComplete: () => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: "Welcome to AirScript AI",
            description: "Experience the magic of writing in thin air. Let's get you started with a quick guide.",
            icon: <Sparkles size={48} className="text-yellow-400" />,
            image: <div className="w-full h-40 bg-blue-900/40 rounded-xl flex items-center justify-center border border-blue-500/30">
                <Hand size={64} className="text-blue-400 animate-bounce" />
            </div>
        },
        {
            title: "The Gesture",
            description: "To draw, extend your index finger clearly. Keep your other fingers folded into your palm.",
            icon: <Hand size={48} className="text-green-400" />,
            image: <div className="w-full h-40 bg-green-900/40 rounded-xl flex items-center justify-center border border-green-500/30 relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <CheckCircle2 size={120} className="text-green-500" />
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-4xl">☝️</div>
                    <p className="mt-2 text-xs text-green-300 font-medium uppercase tracking-wider">Correct Form</p>
                </div>
            </div>
        },
        {
            title: "Drawing Technique",
            description: "Move your finger as if writing on an invisible chalkboard. A green dot will follow your fingertip.",
            icon: <Brain size={48} className="text-purple-400" />,
            image: <div className="w-full h-40 bg-purple-900/40 rounded-xl flex items-center justify-center border border-purple-500/30">
                <div className="relative w-24 h-24">
                    <div className="absolute top-0 left-0 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                    <svg viewBox="0 0 100 100" className="w-full h-full stroke-blue-400 fill-none stroke-2">
                        <path d="M20,80 L50,20 L80,80 M35,50 L65,50" className="path-animation" />
                    </svg>
                </div>
            </div>
        },
        {
            title: "Completion",
            description: "Stop moving briefly or fold your finger to finish a letter. The AI will instantly recognize it!",
            icon: <CheckCircle2 size={48} className="text-blue-400" />,
            image: <div className="w-full h-40 bg-gray-900/60 rounded-xl flex items-center justify-center border border-blue-500/30 p-4">
                <div className="text-center">
                    <div className="text-5xl font-bold text-white mb-2 animate-pulse">A</div>
                    <div className="px-3 py-1 bg-blue-600 rounded-full text-[10px] text-white font-bold">98% CONFIDENCE</div>
                </div>
            </div>
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-gray-900 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onComplete}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white bg-gray-800 rounded-full transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="p-8 sm:p-12">
                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-800 p-4 rounded-2xl shadow-inner">
                            {steps[step].icon}
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-3">
                            {steps[step].title}
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            {steps[step].description}
                        </p>
                    </div>

                    {steps[step].image}

                    {/* Progress Indicators */}
                    <div className="flex justify-center space-x-2 mt-8">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-500' : 'w-2 bg-gray-700'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between p-6 bg-gray-800/50 border-t border-gray-700">
                    <button
                        onClick={handleBack}
                        className={`flex items-center space-x-2 text-sm font-medium transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white'}`}
                    >
                        <ChevronLeft size={20} />
                        <span>Back</span>
                    </button>

                    <button
                        onClick={handleNext}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        <span>{step === steps.length - 1 ? "Start Drawing" : "Next"}</span>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <style>{`
        .path-animation {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: draw 3s ease-in-out infinite;
        }
        @keyframes draw {
          0% { stroke-dashoffset: 400; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
      `}</style>
        </div>
    );
};

export default Onboarding;
