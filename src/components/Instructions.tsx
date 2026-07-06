import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Hand, 
  Scissors,
  BookOpen
} from 'lucide-react';

const GESTURE_ACTIONS = [
  { gesture: 'Up', action: 'Scroll Up', icon: ArrowUp, color: 'text-blue-500' },
  { gesture: 'Down', action: 'Scroll Down', icon: ArrowDown, color: 'text-blue-500' },
  { gesture: 'Left', action: 'Previous Page', icon: ArrowLeft, color: 'text-emerald-500' },
  { gesture: 'Right', action: 'Next Page', icon: ArrowRight, color: 'text-emerald-500' },
  { gesture: 'Peace', action: 'Voice Assistant', icon: Scissors, color: 'text-purple-500' },
  { gesture: 'Palm', action: 'Stop / Pause', icon: Hand, color: 'text-rose-500' },
];

export const Instructions: React.FC = () => {
  return (
    <Card className="h-full border-2">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Gesture Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GESTURE_ACTIONS.map((item) => (
            <div 
              key={item.gesture} 
              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors group"
            >
              <div className={`p-2 rounded-md bg-muted group-hover:scale-110 transition-transform ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold leading-none">{item.gesture}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.action}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Usage Tips</h4>
          <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
            <li>Ensure good lighting on your hand.</li>
            <li>Keep your hand within the camera frame.</li>
            <li>Hold the gesture for a brief moment for better detection.</li>
            <li>Actions have a 1-second cooldown to prevent double-triggers.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
