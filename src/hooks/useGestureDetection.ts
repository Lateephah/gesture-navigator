import * as tf from '@tensorflow/tfjs';
import { useEffect, useRef, useState, useCallback } from 'react';
import * as Sonner from 'sonner';

export type Gesture = 'up' | 'down' | 'left' | 'right' | 'peace' | 'palm' | 'none';

interface Prediction {
  gesture: Gesture;
  confidence: number;
}

const GESTURES: Gesture[] = ['up', 'down', 'left', 'right', 'peace', 'palm'];

export const useGestureDetection = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  isEnabled: boolean,
  modelUrl: string = '/model/model.json',
  threshold: number = 0.9,
  cooldownMs: number = 1000
) => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [prediction, setPrediction] = useState<Prediction>({ gesture: 'none', confidence: 0 });
  const [isModelLoading, setIsModelLoading] = useState(true);
  const lastActionTime = useRef<number>(0);
  const requestRef = useRef<number>(0);

  // Load model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        const loadedModel = await tf.loadLayersModel(modelUrl).catch((err) => {
          console.warn('Failed to load model from:', modelUrl, err);
          return null;
        });
        
        if (loadedModel) {
          setModel(loadedModel);
          Sonner.toast.success('Gesture model loaded successfully');
        } else {
          console.warn('Model files not found. Using mock inference for demonstration.');
          Sonner.toast.info('Using simulated inference (model files not found)');
          setModel(null);
        }
      } catch (err) {
        console.error('Error loading model:', err);
        Sonner.toast.error('Failed to load gesture model');
      } finally {
        setIsModelLoading(false);
      }
    };

    loadModel();
  }, [modelUrl]);

  const performAction = useCallback((gesture: Gesture) => {
    const now = Date.now();
    if (now - lastActionTime.current < cooldownMs) return;

    switch (gesture) {
      case 'up':
        window.scrollBy({ top: -300, behavior: 'smooth' });
        Sonner.toast('Scrolling Up', { icon: '⬆️' });
        break;
      case 'down':
        window.scrollBy({ top: 300, behavior: 'smooth' });
        Sonner.toast('Scrolling Down', { icon: '⬇️' });
        break;
      case 'left':
        window.history.back();
        Sonner.toast('Going Back', { icon: '⬅️' });
        break;
      case 'right':
        window.history.forward();
        Sonner.toast('Going Forward', { icon: '➡️' });
        break;
      case 'peace':
        Sonner.toast.info('Voice Assistant Triggered (Mock Action)', { icon: '✌️' });
        break;
      case 'palm':
        Sonner.toast('System Paused', { icon: '✋' });
        break;
    }

    lastActionTime.current = now;
  }, [cooldownMs]);

  const detect = useCallback(async () => {
    if (!isEnabled || !videoRef.current || videoRef.current.readyState !== 4) {
      requestRef.current = requestAnimationFrame(detect);
      return;
    }

    try {
      let result: Prediction;

      if (model) {
        // Real inference
        const tensor = tf.tidy(() => {
          const img = tf.browser.fromPixels(videoRef.current!);
          const resized = tf.image.resizeBilinear(img, [224, 224]);
          const normalized = resized.div(255.0).expandDims(0);
          return normalized;
        });

        const predictions = model.predict(tensor) as tf.Tensor;
        const data = await predictions.data();
        tensor.dispose();
        predictions.dispose();

        const maxConfidence = Math.max(...Array.from(data));
        const index = Array.from(data).indexOf(maxConfidence);
        
        result = {
          gesture: maxConfidence > threshold ? GESTURES[index] : 'none',
          confidence: maxConfidence
        };
      } else {
        // Mock inference for demonstration if model is missing
        if (Math.random() > 0.98) {
          const randomGesture = GESTURES[Math.floor(Math.random() * GESTURES.length)];
          result = { gesture: randomGesture, confidence: 0.95 + Math.random() * 0.04 };
        } else {
          result = { gesture: 'none', confidence: 0 };
        }
      }

      setPrediction(result);

      if (result.gesture !== 'none' && result.confidence >= threshold) {
        if (result.gesture === 'palm') {
          // Handled by component state usually
        } else {
          performAction(result.gesture);
        }
      }
    } catch (err) {
      console.error('Detection error:', err);
    }

    requestRef.current = requestAnimationFrame(detect);
  }, [isEnabled, model, threshold, performAction, videoRef]);

  useEffect(() => {
    if (isEnabled) {
      requestRef.current = requestAnimationFrame(detect);
    } else {
      cancelAnimationFrame(requestRef.current);
      setPrediction({ gesture: 'none', confidence: 0 });
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isEnabled, detect]);

  return { prediction, isModelLoading, modelExists: !!model };
};
