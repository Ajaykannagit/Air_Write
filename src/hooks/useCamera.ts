import { useRef, useEffect, useState, useCallback } from 'react';

export interface UseCameraReturn {
    videoRef: React.RefObject<HTMLVideoElement>;
    stream: MediaStream | null;
    isLoading: boolean;
    error: string | null;
    initializeCamera: () => Promise<void>;
}

export const useCamera = (): UseCameraReturn => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const initializeCamera = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Your browser does not support camera access.');
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640, max: 1280 },
                    height: { ideal: 480, max: 720 },
                    facingMode: 'user',
                    frameRate: { ideal: 30, max: 30 }
                }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                await videoRef.current.play();
            }

            streamRef.current = mediaStream;
            setStream(mediaStream);
            setIsLoading(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to access camera.';
            setError(errorMessage);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        initializeCamera();
    }, [initializeCamera]);

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return {
        videoRef,
        stream,
        isLoading,
        error,
        initializeCamera
    };
};
