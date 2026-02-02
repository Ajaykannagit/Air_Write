import { create } from 'zustand';

export interface Prediction {
    letter: string;
    confidence: number;
}

export interface RecognitionItem {
    letter: string;
    confidence: number;
    topPredictions?: Prediction[];
}

export interface AppState {
    // Recognition State
    recognizedText: string;
    recognitionHistory: RecognitionItem[];
    lastUpdated: number;

    // Settings State
    sensitivity: number;
    timeoutVal: number;
    brushColor: string;
    strokeWidth: number;

    // UI State
    showInstructions: boolean;
    showSettings: boolean;
    showAbout: boolean;
    showOnboarding: boolean;

    // Actions
    setRecognizedText: (text: string) => void;
    addRecognitionHistory: (item: RecognitionItem) => void;
    clearHistory: () => void;
    setLastUpdated: (val: number) => void;
    setSensitivity: (val: number) => void;
    setTimeoutVal: (val: number) => void;
    setBrushColor: (color: string) => void;
    setStrokeWidth: (width: number) => void;
    toggleUI: (key: 'showInstructions' | 'showSettings' | 'showAbout' | 'showOnboarding', val?: boolean) => void;
    resetApp: () => void;
}

export const useStore = create<AppState>((set) => ({
    // Initial State
    recognizedText: '',
    recognitionHistory: [],
    lastUpdated: Date.now(),

    sensitivity: 0.7,
    timeoutVal: 1500,
    brushColor: '#4ecdc4',
    strokeWidth: 6,

    showInstructions: false,
    showSettings: false,
    showAbout: false,
    showOnboarding: false,

    // Actions
    setRecognizedText: (text) => set({ recognizedText: text, lastUpdated: Date.now() }),

    addRecognitionHistory: (item) => set((state) => ({
        recognitionHistory: [...state.recognitionHistory.slice(-4), item]
    })),

    clearHistory: () => set({ recognizedText: '', recognitionHistory: [], lastUpdated: Date.now() }),

    setLastUpdated: (val) => set({ lastUpdated: val }),

    clearRecognizedText: () => set({ recognizedText: '' }),

    setSensitivity: (val) => set({ sensitivity: val }),

    setTimeoutVal: (val) => set({ timeoutVal: val }),

    setBrushColor: (color) => set({ brushColor: color }),

    setStrokeWidth: (width) => set({ strokeWidth: width }),

    toggleUI: (key, val) => set((state) => ({
        [key]: val !== undefined ? val : !state[key]
    })),

    resetApp: () => set({
        recognizedText: '',
        recognitionHistory: [],
        lastUpdated: Date.now(),
        sensitivity: 0.7,
        timeoutVal: 1500,
        brushColor: '#4ecdc4',
        strokeWidth: 6
    })
}));
