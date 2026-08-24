import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Users, Briefcase, Trash2, Ban, CheckCircle2, 
  Search, AlertTriangle, ArrowUpRight, Award, Lock, RefreshCw, Eye, KeyRound, Mail, LogIn, LogOut,
  GraduationCap, Upload, Clock, Check, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import API from '../services/api';

export default function AdminDashboard({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    studentCount: 0,
    clientCount: 0,
    totalJobs: 0,
    totalOrders: 0,
    moderationLogs: 0,
    averageRating: 0,
    totalReviews: 0,
    totalReputationPoints: 0,
    verifiedStudents: 0,
    flaggedReviews: 0,
    hiddenReviews: 0
  });
  const [moderationLogs, setModerationLogs] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  // Login Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes, logsRes, verifRes, payoutsRes, disputesRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/stats'),
        API.get('/admin/moderation-logs'),
        API.get('/admin/verifications'),
        API.get('/admin/payouts'),
        API.get('/disputes')
      ]);

      setUsers(usersRes.data || []);
      setStats(statsRes.data || {});
      setModerationLogs(logsRes.data || []);
      setVerifications(verifRes.data || []);
      setPayouts(payoutsRes.data || []);
      setDisputes(disputesRes.data || []);
      setIsAdminLoggedIn(true);
    } catch (err) {
      console.error('Fetch Admin Data Error:', err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        setIsAdminLoggedIn(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchAdminData();
    }
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await API.post('/auth/login', {
        email: adminEmail,
        password: adminPassword
      });

      if (res.data.user?.role !== 'ADMIN') {
        setLoginError('Access Denied: This account is not an Administrator.');
        return;
      }

      localStorage.setItem('token', res.data.token);
      confetti();
      setIsAdminLoggedIn(true);
      fetchAdminData();
    } catch (err) {
      setLoginError(err.response?.data?.error || 'Admin login failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleMasterUnlock = async () => {
    const masterKey = window.prompt('Enter Master Admin Key:');
    if (!masterKey) return;

    try {
      const res = await API.post('/auth/admin-login', { masterKey });
      localStorage.setItem('token', res.data.token);
      confetti();
      setIsAdminLoggedIn(true);
      fetchAdminData();
      alert('👑 Master Admin Access Granted!');
    } catch (err) {
      alert('Access Denied: ' + (err.response?.data?.error || 'Invalid Key'));
    }
  };

  // Document Verification Actions (Independent College ID & Govt ID)
  const handleApproveVerification = async (id, docType) => {
    try {
      await API.put(`/admin/verifications/${id}/status`, { type: docType, status: 'APPROVED' });
      confetti();
      alert(`✅ ${docType === 'COLLEGE' ? 'College Student ID' : 'Government Identity ID'} Approved!`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to approve: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleRejectVerification = async (id, docType) => {
    const reason = window.prompt(`Enter rejection reason for ${docType === 'COLLEGE' ? 'College ID' : 'Govt ID'} (optional):`, 'Document image was blurry or unreadable.');
    if (reason === null) return;
    try {
      await API.put(`/admin/verifications/${id}/status`, { type: docType, status: 'REJECTED', reason });
      alert(`❌ ${docType === 'COLLEGE' ? 'College ID' : 'Govt ID'} marked as Rejected.`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to reject: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"? This cannot be undone.`)) return;

    try {
      await API.delete(`/admin/users/${userId}`);
      alert(`User "${userName}" deleted from PostgreSQL database.`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete user: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleToggleSuspend = async (userId) => {
    try {
      const res = await API.put(`/admin/users/${userId}/suspend`);
      alert(res.data.message);
      fetchAdminData();
    } catch (err) {
      alert('Failed to update suspension: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      alert(`User role changed to ${newRole}`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to update role: ' + (err.response?.data?.error || err.message));
    }
  };


  const handleApprovePayout = async (payoutId) => {
    try {
      await API.put(`/admin/payouts/${payoutId}/approve`);
      alert('Payout approved successfully.');
      fetchAdminData();
    } catch (err) {
      alert('Failed to approve payout: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleRejectPayout = async (payoutId) => {
    try {
      await API.put(`/admin/payouts/${payoutId}/reject`);
      alert('Payout rejected and funds returned.');
      fetchAdminData();
    } catch (err) {
      alert('Failed to reject payout: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleResolveDispute = async (disputeId, decision) => {
    try {
      await API.put(`/disputes/${disputeId}/resolve`, {
        decision
      });

      alert('Dispute resolved successfully.');
      fetchAdminData();
    } catch (err) {
      alert('Failed to resolve dispute: ' + (err.response?.data?.error || err.message));
    }
  };

  const filteredUsers = users.filter(u => {

    const matchesSearch = 
      (u.fullName && u.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.id && u.id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const pendingVerifCount = verifications.filter(v => 
    (v.collegeIdStatus === 'PENDING' && v.idCardUrl) || 
    (v.govtIdStatus === 'PENDING' && v.nationalIdUrl) ||
    v.status === 'PENDING'
  ).length;

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 glass-panel rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/40 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Admin Console Access</h2>
          <p className="text-xs text-slate-400">Sign in with your Super Administrator credentials or use the Master Key.</p>
        </div>

        {loginError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 font-bold">
            {loginError}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Admin Email</label>
            <input 
              type="email" 
              required 
              value={adminEmail} 
              onChange={e => setAdminEmail(e.target.value)} 
              placeholder="siddusiddharth80193@gmail.com" 
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-indigo-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={adminPassword} 
              onChange={e => setAdminPassword(e.target.value)} 
              placeholder="••••••••••••" 
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-indigo-500" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loginLoading} 
            className="w-full py-3.5 neon-airflow-btn text-white text-xs font-black rounded-xl uppercase tracking-wider"
          >
            {loginLoading ? 'Authenticating...' : 'Sign In as Administrator'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <button 
            onClick={handleMasterUnlock} 
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center justify-center space-x-1.5 mx-auto"
          >
            <KeyRound className="w-4 h-4" />
            <span>Direct Master Key Unlock</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/60 p-6 rounded-3xl border border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-pink-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Master Admin Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">SkillLaunch Management Console</h1>
          <p className="text-xs text-slate-400 mt-1">Super Administrator Active • Full PostgreSQL Database Access</p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchAdminData} 
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white flex items-center space-x-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Database</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-slate-400">Total Users</span>
          <div className="text-2xl font-black text-white">{stats.totalUsers || users.length}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-indigo-400">Students</span>
          <div className="text-2xl font-black text-indigo-400">{stats.studentCount || users.filter(u => u.role === 'STUDENT_FREELANCER').length}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-pink-400">Clients</span>
          <div className="text-2xl font-black text-pink-400">{stats.clientCount || users.filter(u => u.role === 'CLIENT').length}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-emerald-400">Total Jobs</span>
          <div className="text-2xl font-black text-emerald-400">{stats.totalJobs || 0}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-amber-400">Escrow Orders</span>
          <div className="text-2xl font-black text-amber-400">{stats.totalOrders || 0}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-red-400">AI Flags</span>
          <div className="text-2xl font-black text-red-400">{moderationLogs.length}</div>
        </div>
      </div>


      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-cyan-400">Avg Rating</span>
          <div className="text-2xl font-black text-cyan-400">
            {Number(stats.averageRating || 0).toFixed(1)}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-violet-400">Reviews</span>
          <div className="text-2xl font-black text-violet-400">
            {stats.totalReviews || 0}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-pink-400">Reputation</span>
          <div className="text-2xl font-black text-pink-400">
            {stats.totalReputationPoints || 0}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-emerald-400">Verified</span>
          <div className="text-2xl font-black text-emerald-400">
            {stats.verifiedStudents || 0}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-amber-400">Flagged Reviews</span>
          <div className="text-2xl font-black text-amber-400">
            {stats.flaggedReviews || 0}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-red-400">Hidden Reviews</span>
          <div className="text-2xl font-black text-red-400">
            {stats.hiddenReviews || 0}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-slate-800 pb-3 text-xs font-black">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-xl transition ${activeTab === 'users' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`
        }>
          Registered Users Directory ({filteredUsers.length})
        </button>
        <button 
          onClick={() => setActiveTab('verifications')}
          className={`px-5 py-2.5 rounded-xl transition flex items-center space-x-2 ${activeTab === 'verifications' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`
        }>
          <span>Student ID Verifications</span>
          {pendingVerifCount > 0 && (
            <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full animate-pulse">
              {pendingVerifCount} Pending
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('moderation')}
            className={`px-5 py-2.5 rounded-xl transition ${activeTab === 'moderation' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
          AI Chat Moderation Queue ({moderationLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
            className={`px-5 py-2.5 rounded-xl transition ${activeTab === 'payouts' ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          Withdrawal Requests ({payouts.length})
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-5 py-2.5 rounded-xl transition ${activeTab === 'disputes' ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          Disputes ({disputes.length})
        </button>
      </div>

      {/* 1. USERS DIRECTORY */}
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

            <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'STUDENT_FREELANCER', 'CLIENT', 'ADMIN'].map(role => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    roleFilter === role ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {role === 'ALL' ? 'ALL' : role === 'STUDENT_FREELANCER' ? 'Students' : role}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-black uppercase text-slate-400">
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
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-600 flex items-center justify-center text-xs font-black">
                        {user.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div>{user.fullName}</div>
                        <span className="text-[10px] text-slate-400 font-normal">@{user.username || 'user'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{user.email}</td>
                    <td className="py-3.5 px-4">
                      <select 
                        value={user.role} 
                        onChange={e => handleChangeRole(user.id, e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold text-indigo-300 outline-none"
                      >
                        <option value="STUDENT_FREELANCER">Student</option>
                        <option value="CLIENT">Client</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="font-semibold text-white">{user.profile?.category || 'General'}</div>
                      <div className="text-[11px] text-slate-400">{user.profile?.college || 'Not set'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{user.age ? `${user.age} yrs` : '18 yrs'}</td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link 
                          to={`/u/${user.username || user.id}`} 
                          target="_blank" 
                          className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg transition"
                          title="View Public Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button 
                          onClick={() => handleToggleSuspend(user.id)}
                          className={`p-2 rounded-lg transition ${
                            user.isSuspended ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white'
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

      {/* 2. UNIFIED SINGLE VERIFICATION QUEUE */}
      {activeTab === 'verifications' && (
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-black text-white flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                <span>Student ID Verification Requests ({verifications.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Review College Student IDs and Government Photo IDs side-by-side to approve verified badges.</p>
            </div>
            <button 
              onClick={fetchAdminData} 
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl flex items-center space-x-2 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Queue</span>
            </button>
          </div>

          {verifications.length === 0 ? (
            <div className="p-16 text-center text-sm text-slate-500 bg-slate-950/40 border border-slate-900 rounded-2xl">
              No verification requests submitted yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {verifications.map((v) => (
                <div key={v.id} className="p-6 bg-slate-950 border border-slate-800/90 rounded-2xl space-y-6 shadow-xl">
                  {/* User Header with Clickable Username */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-900 pb-4">
                    <div>
                      <h4 className="text-lg font-black text-white">{v.user?.fullName || 'Student'}</h4>
                      <div className="flex items-center space-x-2 text-xs mt-1">
                        <Link 
                          to={`/u/${v.user?.username || v.user?.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline flex items-center space-x-1 transition cursor-pointer bg-indigo-950/60 hover:bg-indigo-900/80 px-2 py-0.5 rounded-lg border border-indigo-800/50"
                          title="Click to view student profile"
                        >
                          <span>@{v.user?.username || 'user'}</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </Link>
                        <span className="text-slate-600 font-bold">•</span>
                        <span className="text-slate-400 font-medium">{v.user?.email}</span>
                      </div>
                      <p className="text-xs text-indigo-400/90 font-semibold mt-1">🏫 {v.collegeName || v.user?.profile?.college || 'College Student'}</p>
                    </div>
                    <span className="text-xs text-slate-500">Submitted: {new Date(v.createdAt).toLocaleString()}</span>
                  </div>

                  {/* Dual Documents Side-by-Side Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* 1. College Student ID Card */}
                    <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black uppercase text-indigo-400 flex items-center space-x-1.5">
                            <GraduationCap className="w-4 h-4" />
                            <span>1. College Student ID</span>
                          </span>
                          <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-md border ${
                            v.collegeIdStatus === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            v.collegeIdStatus === 'PENDING' && v.idCardUrl ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse' :
                            v.idCardUrl ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}>
                            {v.idCardUrl ? (v.collegeIdStatus || 'PENDING') : 'Not Uploaded'}
                          </span>
                        </div>

                        {v.idCardUrl ? (
                          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group h-48 flex items-center justify-center">
                            <img src={v.idCardUrl} alt="College ID" className="w-full h-full object-contain cursor-pointer transition transform group-hover:scale-105" onClick={() => window.open(v.idCardUrl, '_blank')} />
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                              <span className="text-xs font-bold text-white flex items-center space-x-1"><Eye className="w-4 h-4" /><span>Click to view full image</span></span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-48 flex items-center justify-center text-xs text-slate-500 bg-slate-950/50 rounded-xl border border-slate-800/40">Student has not uploaded College ID</div>
                        )}
                        {v.collegeRejectionReason && <p className="text-xs text-red-400 font-bold">Reason: {v.collegeRejectionReason}</p>}
                      </div>

                      {v.idCardUrl && (
                        <div className="flex space-x-2 pt-2">
                          <button 
                            onClick={() => handleApproveVerification(v.id, 'COLLEGE')} 
                            disabled={v.collegeIdStatus === 'APPROVED'} 
                            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition ${
                              v.collegeIdStatus === 'APPROVED' ? 'bg-emerald-900/40 text-emerald-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                            }`}
                          >
                            {v.collegeIdStatus === 'APPROVED' ? '✓ College ID Approved' : 'Approve College ID'}
                          </button>
                          <button 
                            onClick={() => handleRejectVerification(v.id, 'COLLEGE')} 
                            className="px-4 py-2.5 bg-red-950/50 hover:bg-red-900/80 border border-red-800 text-red-300 text-xs font-bold rounded-xl transition"
                          >
                            Reject ID
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 2. Government Identity ID Document */}
                    <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black uppercase text-violet-400 flex items-center space-x-1.5">
                            <ShieldCheck className="w-4 h-4" />
                            <span>2. Government Identity ID</span>
                          </span>
                          <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-md border ${
                            v.govtIdStatus === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            v.govtIdStatus === 'PENDING' && v.nationalIdUrl ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse' :
                            v.nationalIdUrl ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}>
                            {v.nationalIdUrl ? (v.govtIdStatus || 'PENDING') : 'Not Uploaded'}
                          </span>
                        </div>

                        {v.nationalIdUrl ? (
                          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group h-48 flex items-center justify-center">
                            <img src={v.nationalIdUrl} alt="Government ID" className="w-full h-full object-contain cursor-pointer transition transform group-hover:scale-105" onClick={() => window.open(v.nationalIdUrl, '_blank')} />
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                              <span className="text-xs font-bold text-white flex items-center space-x-1"><Eye className="w-4 h-4" /><span>Click to view full image</span></span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-48 flex items-center justify-center text-xs text-slate-500 bg-slate-950/50 rounded-xl border border-slate-800/40">Student has not uploaded Govt ID</div>
                        )}
                        {v.govtRejectionReason && <p className="text-xs text-red-400 font-bold">Reason: {v.govtRejectionReason}</p>}
                      </div>

                      {v.nationalIdUrl && (
                        <div className="flex space-x-2 pt-2">
                          <button 
                            onClick={() => handleApproveVerification(v.id, 'GOVT')} 
                            disabled={v.govtIdStatus === 'APPROVED'} 
                            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition ${
                              v.govtIdStatus === 'APPROVED' ? 'bg-emerald-900/40 text-emerald-500 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-950/40'
                            }`}
                          >
                            {v.govtIdStatus === 'APPROVED' ? '✓ Govt ID Approved' : 'Approve Govt ID'}
                          </button>
                          <button 
                            onClick={() => handleRejectVerification(v.id, 'GOVT')} 
                            className="px-4 py-2.5 bg-red-950/50 hover:bg-red-900/80 border border-red-800 text-red-300 text-xs font-bold rounded-xl transition"
                          >
                            Reject ID
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* 3. PAYOUT REQUESTS */}
      {activeTab === 'payouts' && (
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
          <h3 className="text-base font-black text-white">Withdrawal Requests</h3>

          {payouts.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No withdrawal requests found.
            </div>
          ) : (
            <div className="space-y-3">
              {payouts.map((payout) => (
                <div key={payout.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">{payout.user?.fullName}</div>
                    <div className="text-xs text-slate-400">{payout.user?.email}</div>
                    <div className="text-sm text-emerald-400 font-bold mt-1">₹{payout.amount}</div>
                    <div className="text-xs text-slate-500">UPI: {payout.destination}</div>
                  </div>

                  <div className="flex gap-2">
                    {payout.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleApprovePayout(payout.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => handleRejectPayout(payout.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold text-white"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">
                        {payout.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      
      {/* 3. DISPUTES */}
      {activeTab === 'disputes' && (
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
          <h3 className="text-base font-black text-white">
            Dispute Resolution Center
          </h3>

          {disputes.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No disputes found.
            </div>
          ) : (
            <div className="space-y-3">
              {disputes.map((d) => (
                <div
                  key={d.id}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3"
                >
                  <div className="font-bold text-white">
                    Order #{d.orderId?.slice?.(0,8) || d.orderId}
                  </div>

                  <div className="text-xs text-slate-400">
                    Status: {d.status}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="p-3 rounded-xl bg-red-950/20 border border-red-900">
                      <div className="text-red-400 font-bold mb-1">
                        Client Complaint
                      </div>
                      <div className="text-slate-300">
                        {d.reason || 'No complaint provided'}
                      </div>

                      {d.evidence && (
                        <div className="text-xs text-slate-500 mt-1">
                          Evidence: {d.evidence}
                        </div>
                      )}
                    </div>

                    {d.sellerReason && (
                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900">
                        <div className="text-emerald-400 font-bold mb-1">
                          Seller Response
                        </div>

                        <div className="text-slate-300">
                          {d.sellerReason}
                        </div>

                        {d.sellerEvidence && (
                          <div className="text-xs text-slate-500 mt-1">
                            Evidence: {d.sellerEvidence}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResolveDispute(d.id, 'RELEASE_TO_SELLER')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white"
                    >
                      Release To Seller
                    </button>

                    <button
                      onClick={() => handleResolveDispute(d.id, 'REFUND_CLIENT')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold text-white"
                    >
                      Refund Client
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

{/* 3. AI CHAT MODERATION LOGS */}
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
