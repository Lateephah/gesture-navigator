import { useState, useEffect } from 'react';
import { useWebcam } from './hooks/useWebcam';
import { useGestureDetection } from './hooks/useGestureDetection';
import { WebcamCard } from './components/WebcamCard';
import { GestureStats } from './components/GestureStats';
import { Instructions } from './components/Instructions';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Toaster } from 'sonner';
import { Hand, Play, Square, Settings as SettingsIcon, Globe, Info, Terminal, ExternalLink } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

function App() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [threshold, setThreshold] = useState(0.9);
  const [cooldown, setCooldown] = useState(1000);
  const [modelUrl, setModelUrl] = useState('/model/model.json');
  
  const { videoRef, isLoading: isWebcamLoading, error: webcamError } = useWebcam();
  const { prediction, isModelLoading } = useGestureDetection(
    videoRef, 
    isEnabled, 
    modelUrl,
    threshold,
    cooldown
  );

  // Stop if palm is detected
  useEffect(() => {
    if (prediction.gesture === 'palm' && prediction.confidence >= threshold) {
      setIsEnabled(false);
    }
  }, [prediction.gesture, prediction.confidence, threshold]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Toaster position="top-right" closeButton richColors />
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Hand className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Gesture Navigator</h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-none">Vision Controlled Navigation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <SettingsIcon className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Detection Settings</DialogTitle>
                  <DialogDescription>
                    Fine-tune how the hand gesture recognition behaves.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold">Model Integration</Label>
                    <div className="space-y-2">
                      <Label htmlFor="modelUrl" className="text-xs text-muted-foreground">Model URL (TF.js format)</Label>
                      <Input 
                        id="modelUrl"
                        value={modelUrl} 
                        onChange={(e) => setModelUrl(e.target.value)}
                        placeholder="/model/model.json"
                        className="font-mono text-xs"
                      />
                    </div>
                    <div className="p-3 bg-muted rounded-lg space-y-2 border border-dashed border-primary/20">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-wider">
                        <Terminal className="w-3 h-3" />
                        .keras to TF.js Guide
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        1. Install: <code className="bg-background px-1 rounded">pip install tensorflowjs</code><br/>
                        2. Convert: <code className="bg-background px-1 rounded">tensorflowjs_converter --input_format=keras model.keras ./tfjs_model</code><br/>
                        3. Upload output files to your <code className="bg-background px-1 rounded">public/model/</code> folder.
                      </p>
                      <a 
                        href="https://www.tensorflow.org/js/guide/conversion" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] text-primary hover:underline flex items-center gap-1"
                      >
                        Official conversion docs <ExternalLink className="w-2 h-2" />
                      </a>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Confidence Threshold</Label>
                        <span className="text-sm font-mono">{Math.round(threshold * 100)}%</span>
                      </div>
                      <Slider 
                        value={[threshold]} 
                        min={0.5} 
                        max={0.99} 
                        step={0.01} 
                        onValueChange={([val]) => setThreshold(val)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Action Cooldown</Label>
                        <span className="text-sm font-mono">{cooldown}ms</span>
                      </div>
                      <Slider 
                        value={[cooldown]} 
                        min={200} 
                        max={3000} 
                        step={100} 
                        onValueChange={([val]) => setCooldown(val)}
                      />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Control your browser with <span className="text-primary italic">Hand Gestures</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience the future of browsing. Use six distinct hand gestures to scroll, navigate history, and more\u2014all powered by real-time neural networks in your browser.
            </p>
          </div>
          
          <Button 
            size="lg" 
            className={`h-16 px-8 text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-primary/20 group ${
              isEnabled ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
            }`}
            onClick={() => setIsEnabled(!isEnabled)}
            disabled={isWebcamLoading || isModelLoading}
          >
            {isEnabled ? (
              <>
                <Square className="w-6 h-6 mr-2 fill-current" />
                Stop Control
              </>
            ) : (
              <>
                <Play className="w-6 h-6 mr-2 fill-current transition-transform group-hover:scale-110" />
                Start Navigator
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <WebcamCard 
              videoRef={videoRef} 
              isLoading={isWebcamLoading} 
              error={webcamError}
              isEnabled={isEnabled}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GestureStats 
                gesture={prediction.gesture} 
                confidence={prediction.confidence}
                isEnabled={isEnabled}
              />
              
              <div className="bg-primary/5 rounded-2xl border-2 border-primary/10 p-6 flex flex-col justify-center relative overflow-hidden group">
                <Info className="absolute -right-4 -bottom-4 w-32 h-32 text-primary/5 -rotate-12 transition-transform group-hover:scale-110" />
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  System Status
                </h3>
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">AI Model</span>
                    <span className="font-semibold text-emerald-500">EfficientNetB0 (Ready)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Inference engine</span>
                    <span className="font-semibold">TensorFlow.js 4.22</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">FPS</span>
                    <span className="font-semibold">~30 (Optimized)</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-primary/10">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/50 p-2 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-muted'}`} />
                      {isEnabled ? 'Processing frames for gestures...' : 'Idle. Awaiting start command.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 h-full">
            <Instructions />
          </div>
        </div>

        <div className="mt-16 space-y-8 pb-32">
          <Separator />
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">Scroll Down to Test Navigation</h3>
            <p className="text-muted-foreground">Try the 'Up' and 'Down' gestures to navigate this section.</p>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-64 bg-muted/30 rounded-3xl border border-dashed flex items-center justify-center">
              <span className="text-6xl font-bold text-muted/20">Section {i}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>\u00a9 2024 Gesture Navigator. Powered by TensorFlow.js and Computer Vision.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;