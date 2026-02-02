import React, { useRef, useEffect, useState } from 'react';
import { useCamera } from '../hooks/useCamera';
import { useHandTracking } from '../hooks/useHandTracking';
import { useGestureRecognition } from '../hooks/useGestureRecognition';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import { useStore } from '../store/useStore';

// Sub-components
import CameraFeed from './air-drawing/CameraFeed';
import StatusOverlay from './air-drawing/StatusOverlay';
import LoadingOverlay from './air-drawing/LoadingOverlay';
import GuideOverlay from './air-drawing/GuideOverlay';
import DrawingControls from './air-drawing/DrawingControls';

const AirDrawing: React.FC = () => {
  const { sensitivity, timeoutVal, brushColor } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingCtx, setDrawingCtx] = useState<CanvasRenderingContext2D | null>(null);

  const { videoRef, isLoading: isCameraLoading, error: cameraError, initializeCamera } = useCamera();
  const { results, isLoading: isTrackingLoading, loadingProgress } = useHandTracking({
    videoElement: videoRef.current,
    sensitivity
  });

  const landmarks = results?.multiHandLandmarks?.[0];

  const {
    isDrawing,
    fingerTip,
    confidence,
    gestureStatus,
    clearDrawing,
    addSpace,
    deleteLast
  } = useGestureRecognition({
    landmarks: landmarks || null,
    timeout: timeoutVal,
    canvasWidth: canvasRef.current?.width || 640,
    canvasHeight: canvasRef.current?.height || 480,
    drawingCtx
  });

  // Setup drawing context
  useEffect(() => {
    if (drawingCanvasRef.current) {
      setDrawingCtx(drawingCanvasRef.current.getContext('2d'));
    }
  }, []);

  // Main rendering loop for video and landmarks
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.save();
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Draw video frame
      if (results?.image) {
        ctx.drawImage(results.image, 0, 0, ctx.canvas.width, ctx.canvas.height);
      } else if (videoRef.current && videoRef.current.readyState >= 2) {
        ctx.drawImage(videoRef.current, 0, 0, ctx.canvas.width, ctx.canvas.height);
      } else {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }

      // Draw hand landmarks using imported utils
      if (landmarks) {
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
          color: '#00ff88',
          lineWidth: 2
        });
        drawLandmarks(ctx, landmarks, {
          color: '#ff6b6b',
          lineWidth: 2,
          radius: 3,
          fillColor: '#ffffff'
        });
      }

      ctx.restore();
    };

    render();
  }, [results, landmarks, videoRef]);

  // Handle canvas sizing
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          canvas.width = rect.width;
          canvas.height = rect.height;
          if (drawingCanvasRef.current) {
            drawingCanvasRef.current.width = rect.width;
            drawingCanvasRef.current.height = rect.height;
          }
        }
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const isLoading = isCameraLoading || isTrackingLoading;

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <CameraFeed
        videoRef={videoRef}
        isLoading={isLoading}
        error={cameraError}
        onRetry={initializeCamera}
      />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      <canvas ref={drawingCanvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />

      {fingerTip && (
        <div
          className={`absolute w-8 h-8 rounded-full pointer-events-none transition-all duration-150 ${isDrawing
            ? 'animate-pulse shadow-lg border-2 border-white'
            : 'bg-white/50 animate-bounce shadow-lg border-2 border-white'
            }`}
          style={{
            left: `${(fingerTip.x / (canvasRef.current?.width || 1)) * 100}%`,
            top: `${(fingerTip.y / (canvasRef.current?.height || 1)) * 100}%`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: isDrawing ? brushColor : undefined,
            boxShadow: `0 0 25px ${isDrawing ? brushColor : 'rgba(251, 191, 36, 0.8)'}`
          }}
        />
      )}

      {!isLoading && !cameraError && (
        <>
          <StatusOverlay
            gestureStatus={gestureStatus}
            confidence={confidence}
            isActive={true}
          />

          <DrawingControls
            onAddSpace={addSpace}
            onDeleteLast={deleteLast}
            onClearDrawing={clearDrawing}
          />

          <GuideOverlay />
        </>
      )}

      <LoadingOverlay isLoading={isLoading} loadingProgress={loadingProgress} />
    </div>
  );
};

export default AirDrawing;