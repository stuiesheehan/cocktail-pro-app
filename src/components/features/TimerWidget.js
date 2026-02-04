import React, { useState, useEffect } from 'react';
import { Pause, Play, RotateCcw, X, Plus } from 'lucide-react';
import { Card, Button, SectionHeader } from '../ui';

const TimerWidget = ({ timers, setTimers }) => {
  const [newTimerName, setNewTimerName] = useState('');
  const [newTimerMinutes, setNewTimerMinutes] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => prev.map(t => ({
        ...t,
        remaining: t.isRunning ? Math.max(0, t.remaining - 1) : t.remaining
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, [setTimers]);

  const addTimer = () => {
    if (!newTimerName.trim()) return;
    setTimers(prev => [...prev, {
      id: Date.now(),
      name: newTimerName,
      total: newTimerMinutes * 60,
      remaining: newTimerMinutes * 60,
      isRunning: true
    }]);
    setNewTimerName('');
  };

  const toggleTimer = (id) => {
    setTimers(prev => prev.map(t => t.id === id ? { ...t, isRunning: !t.isRunning } : t));
  };

  const resetTimer = (id) => {
    setTimers(prev => prev.map(t => t.id === id ? { ...t, remaining: t.total, isRunning: false } : t));
  };

  const deleteTimer = (id) => {
    setTimers(prev => prev.filter(t => t.id !== id));
  };

  const formatTimerTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-4">
      <SectionHeader>Timers</SectionHeader>

      {timers.length > 0 && (
        <div className="space-y-2 mb-4">
          {timers.map(timer => (
            <div key={timer.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <p className="text-sm font-medium text-white">{timer.name}</p>
                <p className={`text-2xl font-light ${timer.remaining === 0 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                  {formatTimerTime(timer.remaining)}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleTimer(timer.id)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20">
                  {timer.isRunning ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                </button>
                <button onClick={() => resetTimer(timer.id)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20">
                  <RotateCcw className="w-4 h-4 text-white" />
                </button>
                <button onClick={() => deleteTimer(timer.id)} className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30">
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={newTimerName}
          onChange={e => setNewTimerName(e.target.value)}
          placeholder="Timer name..."
          className="flex-1 px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white outline-none"
        />
        <select
          value={newTimerMinutes}
          onChange={e => setNewTimerMinutes(Number(e.target.value))}
          className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white outline-none"
        >
          {[1, 2, 5, 10, 15, 30, 60].map(m => <option key={m} value={m}>{m} min</option>)}
        </select>
        <Button variant="gold" onClick={addTimer}><Plus className="w-4 h-4" /></Button>
      </div>
    </Card>
  );
};

export default TimerWidget;
