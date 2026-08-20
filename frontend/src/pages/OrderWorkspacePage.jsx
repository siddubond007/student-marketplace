import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, FileText, Send, AlertTriangle, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import API from '../services/api';

export default function OrderWorkspacePage({ currentUser }) {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [deliverLink, setDeliverLink] = useState('');
  const [deliverNote, setDeliverNote] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'System', text: 'Welcome to Order Workspace. Realtime AI chat filter active.' }
  ]);
  const [chatWarning, setChatWarning] = useState('');

  useEffect(() => {
    API.get('/orders').then(res => {
      const found = res.data?.find(o => o.id === orderId);
      if (found) setOrder(found);
    }).catch(() => {});
  }, [orderId]);

  const handleDeliver = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/orders/${orderId}/deliver`, { driveLinks: [deliverLink], message: deliverNote });
      alert('Work submitted! 5-day client review timer started.');
      confetti();
      window.location.reload();
    } catch (err) {
      alert('Error submitting work.');
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Approve work and release escrow payout?')) return;
    try {
      const res = await API.post(`/orders/${orderId}/approve`);
      confetti({ particleCount: 200, spread: 100 });
      alert(res.data.message);
      window.location.reload();
    } catch (err) {
      alert('Error approving order.');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const leakPattern = /(phone|call|whatsapp|gpay|paytm|upi|telegram|@|\b\d{10}\b)/i;
    if (leakPattern.test(chatInput)) {
      setChatWarning('🚨 AI Safety Alert: Message blocked. Sharing contact numbers or external payments violates safety rules.');
      setTimeout(() => setChatWarning(''), 6000);
      setChatInput('');
      return;
    }

    setChatMessages([...chatMessages, { sender: 'You', text: chatInput }]);
    setChatInput('');
  };

  return (
    <div className="space-y-8 pb-16">
      <Link to="/" className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-400 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Portal</span>
      </Link>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-black uppercase text-indigo-400">Dedicated Order Workspace</span>
            <h2 className="text-2xl font-black text-white mt-1">Order #{orderId?.slice(0, 8)}</h2>
          </div>
          <div className="text-3xl font-black text-emerald-400">₹{order?.totalAmount ?? 999} Held in Escrow</div>
        </div>

        {/* Deliver Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-white">Submit Project Deliverables</h3>
              <form onSubmit={handleDeliver} className="space-y-3">
                <input required type="url" value={deliverLink} onChange={e => setDeliverLink(e.target.value)} placeholder="Google Drive / GitHub Deliverable Link" className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                <textarea rows="3" value={deliverNote} onChange={e => setDeliverNote(e.target.value)} placeholder="Delivery notes..." className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                <button type="submit" className="w-full py-3 neon-airflow-btn text-white text-xs font-black rounded-xl">Submit Deliverables</button>
              </form>
            </div>

            <button onClick={handleApprove} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black rounded-2xl shadow-xl flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Approve Deliverables & Release Payout</span>
            </button>
          </div>

          {/* AI Monitored Chat */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 flex flex-col h-[400px]">
            <div className="p-3 bg-slate-900 border-b border-slate-800 text-xs font-bold text-white flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>AI Monitored Escrow Chat</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-2 text-xs">
              {chatMessages.map((m, i) => (
                <div key={i} className={`p-2.5 rounded-xl max-w-xs ${m.sender === 'You' ? 'ml-auto bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300'}`}>
                  {m.text}
                </div>
              ))}
              {chatWarning && <div className="p-2 bg-red-500/20 text-red-300 rounded-xl text-xs">{chatWarning}</div>}
            </div>
            <form onSubmit={handleSendMessage} className="p-2 border-t border-slate-800 flex">
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Message..." className="flex-1 px-3 py-2 bg-slate-900 rounded-xl text-xs text-white outline-none" />
              <button type="submit" className="px-4 py-2 neon-airflow-btn text-white rounded-xl text-xs font-bold ml-2">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
