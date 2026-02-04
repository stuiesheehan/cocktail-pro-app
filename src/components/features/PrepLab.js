import React, { useState, useEffect } from 'react';
import { Plus, AlertTriangle, Clock, Trash2, X } from 'lucide-react';
import { GOLD } from '../../data/constants';
import { Card, Button } from '../ui';

const PrepLab = ({ isPremium, onShowUpgrade }) => {
  const [houseMade, setHouseMade] = useState(() => {
    try { const saved = localStorage.getItem('prepLab_houseMade'); return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', type: 'syrup', batchSize: 1000, shelfLife: 30, notes: '' });

  useEffect(() => { localStorage.setItem('prepLab_houseMade', JSON.stringify(houseMade)); }, [houseMade]);

  const templates = [
    { name: 'Simple Syrup (1:1)', type: 'syrup', shelfLife: 30, defaultBatch: 1000 },
    { name: 'Rich Syrup (2:1)', type: 'syrup', shelfLife: 60, defaultBatch: 1000 },
    { name: 'Honey Syrup', type: 'syrup', shelfLife: 30, defaultBatch: 500 },
    { name: 'Fresh Lime Juice', type: 'juice', shelfLife: 1, defaultBatch: 500 },
    { name: 'Fresh Lemon Juice', type: 'juice', shelfLife: 1, defaultBatch: 500 },
    { name: 'Super Juice (Lime)', type: 'juice', shelfLife: 14, defaultBatch: 1000 },
    { name: 'Grenadine', type: 'syrup', shelfLife: 30, defaultBatch: 500 },
    { name: 'Orgeat', type: 'syrup', shelfLife: 14, defaultBatch: 500 },
  ];

  const calculateDaysRemaining = (createdDate, shelfLife) => {
    const created = new Date(createdDate);
    const expiry = new Date(created.getTime() + shelfLife * 24 * 60 * 60 * 1000);
    return Math.ceil((expiry - new Date()) / (24 * 60 * 60 * 1000));
  };

  const getStatusColor = (days) => days <= 0 ? '#EF4444' : days <= 2 ? '#F59E0B' : days <= 7 ? '#EAB308' : '#22C55E';
  const getStatusLabel = (days) => days <= 0 ? 'Expired' : days === 1 ? '1 day left' : days <= 7 ? `${days} days left` : 'Fresh';

  const addHouseMade = () => {
    const item = { id: `hm_${Date.now()}`, ...newItem, createdDate: new Date().toISOString(), currentStock: newItem.batchSize, batchNumber: houseMade.filter(h => h.name === newItem.name).length + 1 };
    setHouseMade(prev => [item, ...prev]);
    setNewItem({ name: '', type: 'syrup', batchSize: 1000, shelfLife: 30, notes: '' });
    setShowAddModal(false);
  };

  const updateStock = (id, change) => setHouseMade(prev => prev.map(item => item.id === id ? { ...item, currentStock: Math.max(0, item.currentStock + change) } : item));

  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-6 text-center">
        <span className="text-6xl mb-4">🧪</span>
        <h3 className="text-xl font-light text-white mb-2">Prep Lab</h3>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>Track house-made syrups, juices, and infusions with expiry alerts!</p>
        <Button variant="gold" onClick={onShowUpgrade}>👑 Unlock Premium</Button>
      </div>
    );
  }

  const expiring = houseMade.filter(item => calculateDaysRemaining(item.createdDate, item.shelfLife) <= 3 && calculateDaysRemaining(item.createdDate, item.shelfLife) > 0);
  const expired = houseMade.filter(item => calculateDaysRemaining(item.createdDate, item.shelfLife) <= 0);

  return (
    <div className="pb-28">
      <div className="px-4 pt-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light" style={{ color: GOLD, fontFamily: "'Playfair Display', Georgia, serif" }}>Prep Lab</h2>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 rounded-full flex items-center gap-2" style={{ backgroundColor: GOLD, color: '#000' }}><Plus className="w-4 h-4" /><span className="text-sm font-medium">New Batch</span></button>
        </div>
      </div>

      {expired.length > 0 && (
        <div className="px-4 mb-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-5 h-5 text-red-500" /><span className="text-red-400 font-medium">Expired Items</span></div>
            <p className="text-sm text-red-300">{expired.map(i => i.name).join(', ')}</p>
          </div>
        </div>
      )}

      {expiring.length > 0 && (
        <div className="px-4 mb-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div className="flex items-center gap-2 mb-2"><Clock className="w-5 h-5 text-orange-500" /><span className="text-orange-400 font-medium">Expiring Soon</span></div>
            <p className="text-sm text-orange-300">{expiring.map(i => `${i.name} (${calculateDaysRemaining(i.createdDate, i.shelfLife)}d)`).join(', ')}</p>
          </div>
        </div>
      )}

      <div className="px-4">
        {houseMade.length === 0 ? (
          <Card className="p-8 text-center"><span className="text-4xl mb-3 block">🧴</span><h3 className="text-lg text-white mb-2">No House-Made Items</h3><p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Start tracking your syrups and juices.</p><Button variant="gold" onClick={() => setShowAddModal(true)}>+ Add First Item</Button></Card>
        ) : (
          <div className="space-y-3">
            {houseMade.map(item => {
              const daysRemaining = calculateDaysRemaining(item.createdDate, item.shelfLife);
              const statusColor = getStatusColor(daysRemaining);
              const stockPercent = (item.currentStock / item.batchSize) * 100;
              return (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium flex items-center gap-2">{item.name}<span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${statusColor}20`, color: statusColor }}>{getStatusLabel(daysRemaining)}</span></h4>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Batch #{item.batchNumber} • Made {new Date(item.createdDate).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => setHouseMade(prev => prev.filter(i => i.id !== item.id))} className="p-1"><Trash2 className="w-4 h-4 text-white/30 hover:text-red-400" /></button>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1"><span style={{ color: 'rgba(255,255,255,0.5)' }}>Stock Level</span><span className="text-white">{item.currentStock}ml / {item.batchSize}ml</span></div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}><div className="h-full rounded-full" style={{ width: `${stockPercent}%`, backgroundColor: stockPercent < 20 ? '#EF4444' : stockPercent < 50 ? '#F59E0B' : GOLD }} /></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateStock(item.id, -30)} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>-30ml</button>
                    <button onClick={() => updateStock(item.id, -60)} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>-60ml</button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-lg rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-white">New Batch</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-6 h-6 text-white/60" /></button>
            </div>
            <div className="mb-6">
              <label className="text-sm text-white/60 mb-2 block">Quick Select</label>
              <div className="flex flex-wrap gap-2">
                {templates.map(t => (
                  <button key={t.name} onClick={() => setNewItem({ name: t.name, type: t.type, batchSize: t.defaultBatch, shelfLife: t.shelfLife, notes: '' })} className="px-3 py-1.5 rounded-full text-xs" style={{ backgroundColor: newItem.name === t.name ? `${GOLD}30` : 'rgba(255,255,255,0.05)', border: `1px solid ${newItem.name === t.name ? GOLD : 'transparent'}`, color: newItem.name === t.name ? GOLD : 'rgba(255,255,255,0.6)' }}>{t.name}</button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm text-white/60 mb-2 block">Name</label><input value={newItem.name} onChange={(e) => setNewItem(n => ({ ...n, name: e.target.value }))} className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/10" placeholder="e.g., Simple Syrup" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-white/60 mb-2 block">Batch Size (ml)</label><input type="number" value={newItem.batchSize} onChange={(e) => setNewItem(n => ({ ...n, batchSize: parseInt(e.target.value) || 500 }))} className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/10" /></div>
                <div><label className="text-sm text-white/60 mb-2 block">Shelf Life (days)</label><input type="number" value={newItem.shelfLife} onChange={(e) => setNewItem(n => ({ ...n, shelfLife: parseInt(e.target.value) || 7 }))} className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/10" /></div>
              </div>
            </div>
            <Button variant="gold" onClick={addHouseMade} className="w-full mt-6" disabled={!newItem.name}>+ Add Batch</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrepLab;
