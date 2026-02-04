import React, { useState } from 'react';
import { DollarSign, TrendingUp, Wine, Percent } from 'lucide-react';
import { GOLD } from '../../data/constants';
import { formatCurrency } from '../../utils/formatting';
import { Card, SectionHeader, TabButton, StatCard } from '../ui';

const Analytics = ({ sales, cocktails }) => {
  const [period, setPeriod] = useState('week');

  const now = new Date();
  const periodStart = new Date();
  if (period === 'day') periodStart.setHours(0, 0, 0, 0);
  else if (period === 'week') periodStart.setDate(now.getDate() - 7);
  else if (period === 'month') periodStart.setMonth(now.getMonth() - 1);

  const filteredSales = sales.filter(s => new Date(s.timestamp) >= periodStart);

  const totalRevenue = filteredSales.reduce((sum, s) => sum + (s.sellPrice || 12) * s.quantity, 0);
  const totalCost = filteredSales.reduce((sum, s) => sum + (s.costPerDrink || 2.5) * s.quantity, 0);
  const totalProfit = totalRevenue - totalCost;
  const totalDrinks = filteredSales.reduce((sum, s) => sum + s.quantity, 0);
  const avgMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(0) : 0;

  // Top sellers
  const salesByDrink = filteredSales.reduce((acc, s) => {
    acc[s.name] = (acc[s.name] || 0) + s.quantity;
    return acc;
  }, {});
  const topSellers = Object.entries(salesByDrink)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Sales by type
  const salesByType = filteredSales.reduce((acc, s) => {
    const cocktail = cocktails.find(c => c.name === s.name);
    const type = cocktail?.type || 'Other';
    acc[type] = (acc[type] || 0) + s.quantity;
    return acc;
  }, {});

  return (
    <div className="space-y-4 pb-28">
      <div className="px-4 pt-4">
        <h2 className="text-2xl font-light tracking-wide" style={{ color: GOLD, fontFamily: "'Playfair Display', Georgia, serif" }}>Analytics</h2>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 px-4">
        {['day', 'week', 'month'].map(p => (
          <TabButton key={p} active={period === p} onClick={() => setPeriod(p)}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </TabButton>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 px-4">
        <StatCard label="Revenue" value={formatCurrency(totalRevenue)} color="#10B981" icon={DollarSign} />
        <StatCard label="Profit" value={formatCurrency(totalProfit)} color={GOLD} icon={TrendingUp} />
        <StatCard label="Drinks Sold" value={totalDrinks} color="#8B5CF6" icon={Wine} />
        <StatCard label="Avg Margin" value={`${avgMargin}%`} color="#06B6D4" icon={Percent} />
      </div>

      {/* Top Sellers */}
      <div className="px-4">
        <SectionHeader>Top Sellers</SectionHeader>
        <Card className="divide-y divide-white/10">
          {topSellers.length > 0 ? topSellers.map(([name, count], idx) => (
            <div key={name} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-400 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-white'}`}>
                  {idx + 1}
                </span>
                <span className="text-white">{name}</span>
              </div>
              <span style={{ color: GOLD }}>{count} sold</span>
            </div>
          )) : (
            <div className="p-8 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>No sales data yet</div>
          )}
        </Card>
      </div>

      {/* Sales by Type */}
      <div className="px-4">
        <SectionHeader>By Category</SectionHeader>
        <Card className="p-4 space-y-3">
          {Object.entries(salesByType).map(([type, count]) => {
            const maxCount = Math.max(...Object.values(salesByType));
            const width = (count / maxCount) * 100;
            return (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>{type}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{count}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${width}%`, background: `linear-gradient(90deg, ${GOLD}, #B8960C)` }} />
                </div>
              </div>
            );
          })}
          {Object.keys(salesByType).length === 0 && (
            <div className="py-4 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>No data</div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
