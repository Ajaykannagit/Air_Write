import { useRef, useState, useCallback, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { LETTER_PATTERNS } from '../components/LetterPatterns';
import { NormalizedLandmark } from '@mediapipe/hands';
import { useStore } from '../store/useStore';

interface Point {
    x: number;
    y: number;
    timestamp: number;
}

interface UseGestureRecognitionProps {
    landmarks: NormalizedLandmark[] | null;
    timeout: number;
    canvasWidth: number;
    canvasHeight: number;
    drawingCtx: CanvasRenderingContext2D | null;
}

export const useGestureRecognition = ({
    landmarks,
    timeout,
    canvasWidth,
    canvasHeight,
    drawingCtx
}: UseGestureRecognitionProps) => {
    const {
        recognizedText,
        setRecognizedText,
        addRecognitionHistory,
        recognitionHistory,
        brushColor,
        strokeWidth,
        setLastUpdated
    } = useStore();

    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState<Point[]>([]);
    const [fingerTip, setFingerTip] = useState<{ x: number; y: number } | null>(null);
    const [confidence, setConfidence] = useState(0);
    const [gestureStatus, setGestureStatus] = useState<'ready' | 'drawing' | 'processing'>('ready');
    const [model, setModel] = useState<tf.LayersModel | null>(null);

    const lastDrawPoint = useRef<Point | null>(null);
    const drawingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const stabilizationBuffer = useRef<Point[]>([]);

    const currentPathRef = useRef(currentPath);
    const isDrawingRef = useRef(isDrawing);
    const recognizedTextRef = useRef(recognizedText);

    useEffect(() => { currentPathRef.current = currentPath; }, [currentPath]);
    useEffect(() => { isDrawingRef.current = isDrawing; }, [isDrawing]);
    useEffect(() => { recognizedTextRef.current = recognizedText; }, [recognizedText]);

    // Phase 2: Load TensorFlow.js model from local path
    useEffect(() => {
        async function loadModel() {
            try {
                await tf.ready();
                console.log('TF.js is ready. Attempting to load recognition model...');
                const m = await tf.loadLayersModel('/model/model.json');
                setModel(m);
                console.log('✅ ML Model loaded successfully.');
            } catch {
                console.warn('ML Model not found at /model/model.json. Falling back to rule-based engine.');
            }
        }
        loadModel();
    }, []);

    // Phase 2: Pre-processing path into a 28x28 grayscale image (tensor)
    const preprocessPath = useCallback((path: Point[]): tf.Tensor4D | null => {
        if (path.length < 5) return null;

        const maxX = Math.max(...path.map(p => p.x));
        const minX = Math.min(...path.map(p => p.x));
        const maxY = Math.max(...path.map(p => p.y));
        const minY = Math.min(...path.map(p => p.y));
        const width = maxX - minX;
        const height = maxY - minY;

        const size = 28;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, size, size);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const maxDim = Math.max(width, height) || 1;
        const scale = (size - 6) / maxDim;
        const offsetX = (size - width * scale) / 2;
        const offsetY = (size - height * scale) / 2;

        ctx.beginPath();
        path.forEach((p, i) => {
            const x = (p.x - minX) * scale + offsetX;
            const y = (p.y - minY) * scale + offsetY;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        const imgData = ctx.getImageData(0, 0, size, size);
        return tf.tidy(() => {
            return tf.browser.fromPixels(imgData, 1)
                .resizeNearestNeighbor([size, size])
                .div(255.0)
                .expandDims(0) as tf.Tensor4D;
        });
    }, []);

    const recognizeLetterFromPath = useCallback((path: Point[]): {
        letter: string;
        confidence: number;
        topPredictions: Array<{ letter: string; confidence: number }>
    } => {
        let mlPrediction: { letter: string; confidence: number } | null = null;
        const topPredictions: Array<{ letter: string; confidence: number }> = [];

        if (model) {
            const tensor = preprocessPath(path);
            if (tensor) {
                try {
                    const prediction = model.predict(tensor) as tf.Tensor;
                    const data = prediction.dataSync();

                    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                    const results = Array.from(data).map((conf, idx) => ({
                        letter: characters[idx] || '?',
                        confidence: conf
                    })).sort((a, b) => b.confidence - a.confidence);

                    topPredictions.push(...results.slice(0, 5));
                    mlPrediction = results[0];

                    tensor.dispose();
                    prediction.dispose();
                } catch (err) {
                    console.error('Inference error:', err);
                }
            }
        }

        if (path.length < 5) return { letter: '', confidence: 0, topPredictions: [] };

        const minX = Math.min(...path.map(p => p.x));
        const maxX = Math.max(...path.map(p => p.x));
        const minY = Math.min(...path.map(p => p.y));
        const maxY = Math.max(...path.map(p => p.y));
        const width = maxX - minX;
        const height = maxY - minY;

        const normalizedPath = path.map(p => ({
            x: (p.x - minX) / (width || 1),
            y: (p.y - minY) / (height || 1),
            timestamp: p.timestamp
        }));

        let ruleBestMatch = { letter: '', confidence: 0 };
        LETTER_PATTERNS.forEach(pattern => {
            const patternConfidence = pattern.check(path, normalizedPath, width, height);
            if (patternConfidence > ruleBestMatch.confidence) {
                ruleBestMatch = { letter: pattern.name, confidence: patternConfidence };
            }
        });

        const finalMatch = (mlPrediction && mlPrediction.confidence > 0.8)
            ? mlPrediction
            : (ruleBestMatch.confidence > (mlPrediction?.confidence || 0))
                ? ruleBestMatch
                : (mlPrediction || ruleBestMatch);

        const isLowercase = width < 50 && height < 50 && path.length < 20;
        if (finalMatch.letter && finalMatch.letter !== '-') {
            finalMatch.letter = isLowercase ? finalMatch.letter.toLowerCase() : finalMatch.letter;
        }

        return {
            ...finalMatch,
            topPredictions: topPredictions.length > 0 ? topPredictions : [finalMatch]
        };
    }, [model, preprocessPath]);

    const smoothPath = useCallback((points: Point[]): Point[] => {
        if (points.length < 3) return points;
        const smoothed: Point[] = [];
        for (let i = 1; i < points.length - 1; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const next = points[i + 1];
            smoothed.push({
                x: (prev.x + curr.x + next.x) / 3,
                y: (prev.y + curr.y + next.y) / 3,
                timestamp: curr.timestamp
            });
        }
        return [points[0], ...smoothed, points[points.length - 1]];
    }, []);

    const processFinishedPath = useCallback((path: Point[]) => {
        if (path.length > 5) {
            setGestureStatus('processing');
            const smoothedPath = smoothPath(path);
            const recognition = recognizeLetterFromPath(smoothedPath);
            setConfidence(recognition.confidence);

            if (recognition.letter && recognition.confidence > 0.5) {
                const newText = recognizedTextRef.current + recognition.letter;
                setRecognizedText(newText);
                addRecognitionHistory(recognition);
                setLastUpdated(Date.now());
            }
        }
    }, [smoothPath, recognizeLetterFromPath, setRecognizedText, addRecognitionHistory, setLastUpdated]);

    const handleLandmarks = useCallback(() => {
        if (!landmarks || landmarks.length === 0) {
            setFingerTip(null);
            setIsDrawing(false);
            isDrawingRef.current = false;
            setGestureStatus('ready');
            return;
        }

        const fingerTipLandmark = landmarks[8];
        const fingerPIP = landmarks[6];
        const fingerMCP = landmarks[5];
        const thumbTip = landmarks[4];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];

        const fingerTipX = fingerTipLandmark.x * canvasWidth;
        const fingerTipY = fingerTipLandmark.y * canvasHeight;

        stabilizationBuffer.current.push({ x: fingerTipX, y: fingerTipY, timestamp: Date.now() });
        if (stabilizationBuffer.current.length > 5) stabilizationBuffer.current.shift();

        const stabilizedX = stabilizationBuffer.current.reduce((sum, p) => sum + p.x, 0) / stabilizationBuffer.current.length;
        const stabilizedY = stabilizationBuffer.current.reduce((sum, p) => sum + p.y, 0) / stabilizationBuffer.current.length;

        setFingerTip({ x: stabilizedX, y: stabilizedY });

        const isIndexExtended = fingerTipLandmark.y < fingerPIP.y && fingerPIP.y < fingerMCP.y;
        const isMiddleFolded = middleTip.y > landmarks[10].y;
        const isRingFolded = ringTip.y > landmarks[14].y;
        const isPinkyFolded = pinkyTip.y > landmarks[18].y;

        const thumbDistance = Math.sqrt(
            Math.pow((thumbTip.x - fingerTipLandmark.x) * canvasWidth, 2) +
            Math.pow((thumbTip.y - fingerTipLandmark.y) * canvasHeight, 2)
        );

        const isDrawingGesture = isIndexExtended && thumbDistance > 60 && isMiddleFolded && isRingFolded && isPinkyFolded;

        if (isDrawingGesture) {
            const currentTime = Date.now();
            const newPoint: Point = { x: stabilizedX, y: stabilizedY, timestamp: currentTime };

            if (!isDrawingRef.current) {
                setIsDrawing(true);
                isDrawingRef.current = true;
                setGestureStatus('drawing');
                setCurrentPath([newPoint]);
                lastDrawPoint.current = newPoint;
            } else {
                const lastPoint = lastDrawPoint.current;
                if (lastPoint) {
                    const distance = Math.sqrt(Math.pow(stabilizedX - lastPoint.x, 2) + Math.pow(stabilizedY - lastPoint.y, 2));
                    if (distance > 2) {
                        const updatedPath = [...currentPathRef.current, newPoint];
                        setCurrentPath(updatedPath);

                        if (drawingCtx) {
                            drawingCtx.strokeStyle = brushColor;
                            drawingCtx.lineWidth = strokeWidth;
                            drawingCtx.lineCap = 'round';
                            drawingCtx.lineJoin = 'round';
                            drawingCtx.shadowColor = brushColor;
                            drawingCtx.shadowBlur = 10;
                            drawingCtx.beginPath();
                            drawingCtx.moveTo(lastPoint.x, lastPoint.y);
                            drawingCtx.lineTo(stabilizedX, stabilizedY);
                            drawingCtx.stroke();
                        }
                        lastDrawPoint.current = newPoint;
                    }
                }
            }

            if (drawingTimeout.current) clearTimeout(drawingTimeout.current);
            drawingTimeout.current = setTimeout(() => {
                const path = currentPathRef.current;
                processFinishedPath(path);
                setCurrentPath([]);
                setIsDrawing(false);
                setGestureStatus('ready');
                lastDrawPoint.current = null;
            }, timeout);
        } else {
            const path = currentPathRef.current;
            if (isDrawingRef.current) {
                processFinishedPath(path);
                setCurrentPath([]);
                setIsDrawing(false);
                isDrawingRef.current = false;
                setGestureStatus('ready');
                lastDrawPoint.current = null;
            }
        }
    }, [landmarks, canvasWidth, canvasHeight, drawingCtx, timeout, brushColor, strokeWidth, processFinishedPath]);

    useEffect(() => {
        handleLandmarks();
    }, [handleLandmarks]);

    const clearDrawing = useCallback(() => {
        if (drawingCtx) {
            drawingCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        }
        setCurrentPath([]);
        setIsDrawing(false);
        setGestureStatus('ready');
        setConfidence(0);
        lastDrawPoint.current = null;
        stabilizationBuffer.current = [];
        if (drawingTimeout.current) clearTimeout(drawingTimeout.current);
    }, [drawingCtx, canvasWidth, canvasHeight]);

    const addSpace = useCallback(() => {
        const newText = recognizedText + ' ';
        setRecognizedText(newText);
        setLastUpdated(Date.now());
    }, [recognizedText, setRecognizedText, setLastUpdated]);

    const deleteLast = useCallback(() => {
        const newText = recognizedText.slice(0, -1);
        setRecognizedText(newText);
        setLastUpdated(Date.now());
    }, [recognizedText, setRecognizedText, setLastUpdated]);

    return {
        isDrawing,
        currentPath,
        fingerTip,
        confidence,
        gestureStatus,
        recognizedText,
        recognitionHistory,
        clearDrawing,
        addSpace,
        deleteLast
    };
};
