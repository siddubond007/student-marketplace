import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import API from '../services/api';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-indigo-400" />
          <h1 className="text-3xl font-black text-white">Notifications</h1>
        </div>

        <button
          onClick={markAllRead}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold"
        >
          Mark All Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="glass-panel p-6 rounded-2xl text-slate-400">
            No notifications yet.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`glass-panel p-5 rounded-2xl border ${
                n.isRead ? 'border-slate-800' : 'border-indigo-500/40'
              }`}
            >
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white">{n.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{n.message}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="flex items-center gap-2 text-green-400 hover:text-green-300"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
