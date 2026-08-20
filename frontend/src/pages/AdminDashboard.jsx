import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Users, Briefcase, Trash2, Ban, CheckCircle2, 
  Search, AlertTriangle, ArrowUpRight, Award, Lock, RefreshCw, Eye, KeyRound, Mail, LogIn, LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';
import API from '../services/api';

export default function AdminDashboard({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, studentCount: 0, clientCount: 0, totalJobs: 0, totalOrders: 0, moderationLogs: 0 });
  const [moderationLogs, setModerationLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  // Clean empty input fields
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes, logsRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/stats'),
        API.get('/admin/moderation-logs')
      ]);

      setUsers(usersRes.data || []);
      setStats(statsRes.data || {});
      setModerationLogs(logsRes.data || []);
      setIsAdminLoggedIn(true);
    } catch (err) {
      console.error("Admin data fetch error:", err);
      // Show exact alert if failed
      if (err.response?.status === 401 || err.response?.status === 403) {
        setIsAdminLoggedIn(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/auth/me')
        .then(res => {
          if (res.data.user?.role === 'ADMIN') {
            setIsAdminLoggedIn(true);
            fetchAdminData();
          }
        })
        .catch(() => {});
    }
  }, []);

  // Admin Sign In
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await API.post('/auth/login', {
        email: adminEmail.trim(),
        password: adminPassword
      });

      if (res.data.user.role !== 'ADMIN') {
        setLoginError('Access Denied: This account does not have Administrator privileges.');
        setLoginLoading(false);
        return;
      }

      localStorage.setItem('token', res.data.token);
      confetti({ particleCount: 150, spread: 80 });
      setIsAdminLoggedIn(true);
      
      // Fetch data immediately with new token
      fetchAdminData();
    } catch (err) {
      setLoginError(err.response?.data?.error || 'Invalid administrator credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout Admin
  const handleAdminLogout = () => {
    localStorage.removeItem('token');
    setIsAdminLoggedIn(false);
    setUsers([]);
    setAdminEmail('');
    setAdminPassword('');
  };

  // Delete User Action
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"? This cannot be undone.`)) return;

    try {
      await API.delete(`/admin/users/${userId}`);
      confetti({ particleCount: 80 });
      alert(`User "${userName}" deleted from PostgreSQL database.`);
      setUsers(users.filter(u => u.id !== userId));
      setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.error || err.message));
    }
  };

  // Toggle Suspend
  const handleToggleSuspend = async (userId, currentStatus) => {
    try {
      const res = await API.put(`/admin/users/${userId}/suspend`);
      alert(res.data.message);
      setUsers(users.map(u => u.id === userId ? { ...u, isSuspended: !currentStatus } : u));
    } catch (err) {
      alert('Failed to update suspension status.');
    }
  };

  // Change Role
  const handleChangeRole = async (userId, newRole) => {
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      alert(`User role updated to ${newRole}`);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update role.');
    }
  };

  // ─── 1. DEDICATED ADMIN LOGIN SCREEN ───
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 w-full">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border-2 border-red-500/30 max-w-md w-full shadow-2xl relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400 mb-4">
            <Lock className="w-8 h-8" />
          </div>

          <div className="text-center space-y-1.5 mb-6">
            <span className="px-3 py-0.5 bg-red-500/20 text-red-400 rounded-full text-[11px] font-black uppercase tracking-wider">
              Confidential Admin Gate
            </span>
            <h2 className="text-2xl font-black text-white">Administrator Sign In</h2>
            <p className="text-xs text-slate-400">Enter your verified administrator credentials to access the console.</p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-500/15 border border-red-500/40 rounded-xl text-xs text-red-300 font-bold flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase mb-1">Admin Email</label>
              <div className="relative">
                <input 
                  required 
                  type="email" 
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  placeholder="siddusiddharth80193@gmail.com" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500 placeholder-slate-600" 
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase mb-1">Admin Password</label>
              <div className="relative">
                <input 
                  required 
                  type="password" 
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-mono placeholder-slate-600" 
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loginLoading}
              className="w-full py-3.5 neon-airflow-btn text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center space-x-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loginLoading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
            </button>
          </form>

          <Link to="/" className="text-xs text-slate-500 hover:text-white block font-bold text-center pt-4">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // ─── 2. ACTIVE ADMIN MANAGEMENT CONSOLE ───
  const filteredUsers = users.filter(u => {
    const matchesSearch = !searchQuery || 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-10 pb-24 w-full">
      
      {/* Admin Header */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-xs font-black text-red-400 mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Master Admin Control Center</span>
          </div>
          <h1 className="text-3xl font-black text-white">SkillLaunch Management Console</h1>
          <p className="text-xs text-slate-400 mt-1">Super Administrator Active • Full PostgreSQL Database Access</p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchAdminData}
            className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-indigo-500 text-white rounded-xl text-xs font-black transition flex items-center space-x-2 shadow-lg"
          >
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            <span>Refresh Database</span>
          </button>
          <button 
            onClick={handleAdminLogout}
            className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-xs font-black transition"
            title="Log Out from Admin Console"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-slate-400">Total Users</span>
          <div className="text-2xl font-black text-white">{stats.totalUsers || users.length}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-indigo-400">Students</span>
          <div className="text-2xl font-black text-indigo-400">{stats.studentCount}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-pink-400">Clients</span>
          <div className="text-2xl font-black text-pink-400">{stats.clientCount}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-emerald-400">Total Jobs</span>
          <div className="text-2xl font-black text-emerald-400">{stats.totalJobs}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-amber-400">Escrow Orders</span>
          <div className="text-2xl font-black text-amber-400">{stats.totalOrders}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-red-400">AI Flags</span>
          <div className="text-2xl font-black text-red-400">{moderationLogs.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-800 pb-3 text-xs font-black">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-xl transition ${activeTab === 'users' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          Registered Users Directory ({filteredUsers.length})
        </button>
        <button 
          onClick={() => setActiveTab('moderation')}
          className={`px-5 py-2.5 rounded-xl transition ${activeTab === 'moderation' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          AI Chat Moderation Queue ({moderationLogs.length})
        </button>
      </div>

      {/* USERS TABLE */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search user by name, email, username, ID..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500" 
              />
            </div>

            <div className="flex space-x-2 w-full sm:w-auto">
              {['ALL', 'STUDENT_FREELANCER', 'CLIENT', 'ADMIN'].map(role => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition ${
                    roleFilter === role ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {role === 'STUDENT_FREELANCER' ? 'Students' : role}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">College / Category</th>
                  <th className="py-3 px-4">Age</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-xs shrink-0">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span>{user.fullName}</span>
                          {user.isSuspended && <span className="px-1.5 py-0.2 bg-red-500/20 text-red-400 text-[9px] font-bold rounded">SUSPENDED</span>}
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">@{user.username || 'user'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">{user.email}</td>

                    <td className="py-3.5 px-4">
                      <select 
                        value={user.role}
                        onChange={e => handleChangeRole(user.id, e.target.value)}
                        className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-bold text-indigo-300"
                      >
                        <option value="STUDENT_FREELANCER">Student</option>
                        <option value="CLIENT">Client</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{user.profile?.category || 'General'}</div>
                      <span className="text-[10px] text-slate-500">{user.profile?.college || 'Not set'}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-300">{user.age} yrs</span>
                      {user.isMinor && <span className="block text-[9px] text-amber-400 font-bold">Minor (16-17)</span>}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link 
                          to={`/u/${user.username || user.id}`}
                          className="p-2 bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button 
                          onClick={() => handleToggleSuspend(user.id, user.isSuspended)}
                          className={`p-2 rounded-lg transition ${
                            user.isSuspended ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-white' : 'bg-slate-900 text-slate-400 hover:text-amber-400'
                          }`}
                          title={user.isSuspended ? 'Unsuspend User' : 'Suspend User'}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id, user.fullName)}
                          className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition"
                          title="Permanently Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI MODERATION */}
      {activeTab === 'moderation' && (
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
          <h3 className="text-base font-black text-white pb-3 border-b border-slate-800">AI Contact-Leak Interception Logs</h3>
          {moderationLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">No chat violations detected.</div>
          ) : (
            <div className="space-y-3">
              {moderationLogs.map(log => (
                <div key={log.id} className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-bold text-red-400">Blocked Text: "{log.flaggedText}"</span>
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded text-[9px] font-bold uppercase">{log.violationType}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Sender: {log.sender?.fullName || 'User'} ({log.sender?.email}) • Flagged at: {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
