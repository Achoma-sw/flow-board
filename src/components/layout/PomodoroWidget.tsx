import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";

const FOCUS = 25 * 60;

export function PomodoroWidget() {
  const [seconds, setSeconds] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => setSeconds((s) => (s <= 1 ? FOCUS : s - 1)), 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Pomodoro timer">
          <Timer className="h-[18px] w-[18px]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 space-y-4">
        <div>
          <p className="text-sm font-semibold">Focus session</p>
          <p className="text-xs text-muted-foreground">25 minutes of deep work</p>
        </div>
        <p className="font-display text-4xl font-bold tabular-nums" aria-live="polite">
          {mm}:{ss}
        </p>
        <Progress value={((FOCUS - seconds) / FOCUS) * 100} />
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" onClick={() => setRunning((r) => !r)}>
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pause" : "Start"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setRunning(false);
              setSeconds(FOCUS);
            }}
            aria-label="Reset timer"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
