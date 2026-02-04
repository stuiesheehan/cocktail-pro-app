import React, { useState, useMemo } from 'react';
import { QrCode, Play, Check } from 'lucide-react';
import { GOLD } from '../../data/constants';
import { Card, Button } from '../ui';

const PartyMode = ({ cocktails, isPremium, onShowUpgrade }) => {
  const [isActive, setIsActive] = useState(false);
  const [sessionName, setSessionName] = useState('Saturday Night');
  const [orderQueue, setOrderQueue] = useState([]);
  const [showQR, setShowQR] = useState(false);

  const availableCocktails = cocktails.filter(c => c.canMake);
  const sessionId = useMemo(() => `party_${Date.now()}`, []);

  const simulateOrder = () => {
    if (orderQueue.length >= 20) return;
    const randomCocktail = availableCocktails[Math.floor(Math.random() * availableCocktails.length)];
    const guestNames = ['Table 1', 'Table 2', 'VIP Booth', 'Bar Seat 3', 'Patio 4', 'Guest'];
    const newOrder = {
      id: `order_${Date.now()}`,
      cocktailName: randomCocktail.name,
      guestName: guestNames[Math.floor(Math.random() * guestNames.length)],
      notes: Math.random() > 0.7 ? 'Extra lime please' : '',
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    setOrderQueue(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId, status) => {
    setOrderQueue(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const stats = useMemo(() => ({
    pending: orderQueue.filter(o => o.status === 'pending').length,
    making: orderQueue.filter(o => o.status === 'making').length,
    ready: orderQueue.filter(o => o.status === 'ready').length,
  }), [orderQueue]);

  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-6 text-center">
        <span className="text-6xl mb-4">🎉</span>
        <h3 className="text-xl font-light text-white mb-2">Party Mode</h3>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>Let guests browse your menu and place orders via QR code!</p>
        <Button variant="gold" onClick={onShowUpgrade}>👑 Unlock Premium</Button>
      </div>
    );
  }

  return (
    <div className="pb-28">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-light" style={{ color: GOLD, fontFamily: "'Playfair Display', Georgia, serif" }}>Party Mode</h2>
          <button onClick={() => setIsActive(!isActive)} className={`px-4 py-2 rounded-full text-sm font-medium ${isActive ? 'bg-green-500 text-white' : 'bg-white/10 text-white'}`}>{isActive ? '🟢 Live' : '⚪ Start'}</button>
        </div>
        {isActive && <input value={sessionName} onChange={(e) => setSessionName(e.target.value)} className="w-full p-3 rounded-xl bg-white/5 text-white text-center text-lg font-light border border-white/10" placeholder="Session name..." />}
      </div>

      {isActive ? (
        <>
          <div className="px-4 mb-4">
            <Card className="p-6 text-center">
              <button onClick={() => setShowQR(!showQR)} className="w-full">
                <QrCode className="w-12 h-12 mx-auto mb-3" style={{ color: GOLD }} />
                <h3 className="text-lg font-medium text-white mb-1">Guest Menu</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{availableCocktails.length} drinks available</p>
              </button>
              {showQR && (
                <div className="mt-4 p-4 bg-white rounded-2xl inline-block">
                  <div className="w-48 h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center"><QrCode className="w-16 h-16 text-gray-600 mx-auto mb-2" /><p className="text-xs text-gray-600">Scan to Order</p></div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-2 px-4 mb-4">
            <div className="text-center p-3 rounded-xl bg-yellow-500/20"><span className="text-2xl font-bold text-yellow-400">{stats.pending}</span><p className="text-xs text-yellow-400/70">Pending</p></div>
            <div className="text-center p-3 rounded-xl bg-blue-500/20"><span className="text-2xl font-bold text-blue-400">{stats.making}</span><p className="text-xs text-blue-400/70">Making</p></div>
            <div className="text-center p-3 rounded-xl bg-green-500/20"><span className="text-2xl font-bold text-green-400">{stats.ready}</span><p className="text-xs text-green-400/70">Ready</p></div>
          </div>

          <div className="px-4 mb-4">
            <button onClick={simulateOrder} className="w-full p-3 rounded-xl border-2 border-dashed text-sm" style={{ borderColor: `${GOLD}50`, color: GOLD }}>+ Simulate Order (Demo)</button>
          </div>

          <div className="px-4">
            <h3 className="text-lg font-light text-white mb-3">Order Queue</h3>
            {orderQueue.length === 0 ? (
              <Card className="p-8 text-center"><span className="text-4xl mb-3 block">🍸</span><p className="text-white/50">Waiting for orders...</p></Card>
            ) : (
              <div className="space-y-3">
                {orderQueue.map(order => (
                  <Card key={order.id} className="p-4" style={{ borderLeft: `4px solid ${order.status === 'pending' ? '#EAB308' : order.status === 'making' ? '#3B82F6' : '#22C55E'}` }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg font-medium text-white">{order.cocktailName}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: order.status === 'pending' ? 'rgba(234, 179, 8, 0.2)' : order.status === 'making' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)', color: order.status === 'pending' ? '#EAB308' : order.status === 'making' ? '#3B82F6' : '#22C55E' }}>{order.status}</span>
                        </div>
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{order.guestName}</p>
                        {order.notes && <p className="text-xs mt-1 italic" style={{ color: GOLD }}>Note: {order.notes}</p>}
                      </div>
                      <div className="flex gap-1">
                        {order.status === 'pending' && <button onClick={() => updateOrderStatus(order.id, 'making')} className="p-2 rounded-lg bg-blue-500/20"><Play className="w-4 h-4 text-blue-400" /></button>}
                        {order.status === 'making' && <button onClick={() => updateOrderStatus(order.id, 'ready')} className="p-2 rounded-lg bg-green-500/20"><Check className="w-4 h-4 text-green-400" /></button>}
                        {order.status === 'ready' && <button onClick={() => setOrderQueue(prev => prev.filter(o => o.id !== order.id))} className="p-2 rounded-lg bg-white/10"><Check className="w-4 h-4 text-white/60" /></button>}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="px-4">
          <Card className="p-6 text-center">
            <span className="text-6xl mb-4 block">🎊</span>
            <h3 className="text-xl font-light text-white mb-2">Ready to Party?</h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>Start Party Mode to let guests browse and order from your {availableCocktails.length} available cocktails.</p>
            <Button variant="gold" onClick={() => setIsActive(true)}>🎉 Start Party Mode</Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PartyMode;
