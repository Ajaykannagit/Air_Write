import { useRef, useEffect, useState, useCallback } from 'react';
import { Results, Options } from '@mediapipe/hands';



interface UseHandTrackingProps {
    videoElement: HTMLVideoElement | null;
    sensitivity: number;
}

export const useHandTracking = ({ videoElement, sensitivity }: UseHandTrackingProps) => {
    const [results, setResults] = useState<Results | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const handsRef = useRef<any | null>(null);
    const isProcessingRef = useRef(false);

    const onResults = useCallback((res: Results) => {
        setResults(res);
    }, []);

    const initializeHands = useCallback(async () => {
        try {
            setLoadingProgress(30);

            // Import Hands from @mediapipe/hands robustly
            const mpHands = await import('@mediapipe/hands');
            const HandsClass = mpHands.Hands || (mpHands as any).default?.Hands || (window as any).Hands;

            if (!HandsClass) {
                throw new Error('MediaPipe Hands library not found');
            }

            const hands = new HandsClass({
                locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`
            });

            const options: Options = {
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: sensitivity,
                minTrackingConfidence: sensitivity,
                selfieMode: true
            };

            hands.setOptions(options);

            hands.onResults(onResults);

            // Initialization is handled automatically by .send() in newer versions, 
            // but we try to call it manually to catch errors early.
            if (hands.initialize) {
                await hands.initialize();
            }

            handsRef.current = hands;

            setLoadingProgress(100);
            setIsLoading(false);
        } catch (err) {
            console.error('Error initializing MediaPipe Hands:', err);
            // Don't keep loading forever even on error
            setIsLoading(false);
        }
    }, [onResults, sensitivity]);

    useEffect(() => {
        initializeHands();
    }, [initializeHands]);

    useEffect(() => {
        if (handsRef.current) {
            handsRef.current.setOptions({
                minDetectionConfidence: sensitivity,
                minTrackingConfidence: sensitivity,
            });
        }
    }, [sensitivity]);

    useEffect(() => {
        let animationFrameId: number;
        let lastFrameTime = 0;
        const targetFPS = 30;
        const frameInterval = 1000 / targetFPS;

        const processFrame = async () => {
            const now = Date.now();
            const timeSinceLastFrame = now - lastFrameTime;

            if (videoElement && handsRef.current && !isProcessingRef.current && timeSinceLastFrame >= frameInterval) {
                try {
                    isProcessingRef.current = true;
                    lastFrameTime = now;
                    if (videoElement.readyState >= 2 && videoElement.videoWidth > 0) {
                        await handsRef.current.send({ image: videoElement });
                    }
                } catch {
                    // Ignore processing errors
                } finally {
                    isProcessingRef.current = false;
                }
            }
            animationFrameId = requestAnimationFrame(processFrame);
        };

        if (videoElement && !isLoading) {
            processFrame();
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [videoElement, isLoading]);

    return {
        results,
        isLoading,
        loadingProgress
    };
};
