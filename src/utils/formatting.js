export const formatCurrency = (amount) => `€${amount.toFixed(2)}`;
export const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
export const formatDate = (date) => date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
