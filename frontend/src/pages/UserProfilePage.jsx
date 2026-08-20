import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, ShieldCheck, CheckCircle2, MapPin, Clock, DollarSign, 
  Award, Mail, Phone, Check, ArrowRight, MessageSquare, Briefcase, 
  ChevronRight, ExternalLink, Calendar, BookOpen, GraduationCap,
  Sparkles, User, Edit3, ImagePlus, PlusCircle, Trash2, X, Plus,
  FileCheck, ScrollText, Bookmark, Search, CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import API from '../services/api';
import { INDIAN_COLLEGES } from '../data/collegesData';
import { ALL_SKILLS_DATABASE } from '../data/skillsData';
import { COMPREHENSIVE_CATEGORIES } from '../data/categoriesData';

export default function UserProfilePage({ currentUser }) {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Section Modal
  const [modalType, setModalType] = useState(null);
  const [sectionForm, setSectionForm] = useState({ title: '', institution: '', period: '', desc: '' });

  // Edit Form
  const [editForm, setEditForm] = useState({
    tagline: '',
    category: 'Graphic Design',
    college: '',
    hourlyRate: '499',
    bio: '',
    skills: []
  });

  const [collegeQuery, setCollegeQuery] = useState('');
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

  const [portfolioForm, setPortfolioForm] = useState({ title: '', category: 'Logo Design', img: '', link: '' });

  const loadProfile = () => {
    setLoading(true);
    API.get(`/users/${username}`)
      .then(res => {
        setProfileUser(res.data);
        if (res.data.profile) {
          setEditForm({
            tagline: res.data.profile.tagline || '',
            category: res.data.profile.category || 'Graphic Design',
            college: res.data.profile.college || '',
            hourlyRate: String(res.data.profile.hourlyRate || 499),
            bio: res.data.profile.bio || '',
            skills: res.data.profile.skills || ['Student Talent']
          });
          setCollegeQuery(res.data.profile.college || '');
        }
      })
      .catch(err => console.log('Error loading profile:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProfile();
  }, [username]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await API.put('/users/profile', {
        tagline: editForm.tagline,
        category: editForm.category,
        college: editForm.college || collegeQuery,
        hourlyRate: Number(editForm.hourlyRate),
        bio: editForm.bio,
        skills: editForm.skills
      });
      confetti({ particleCount: 100, spread: 70 });
      setShowEditModal(false);
      loadProfile();
      alert('Profile updated successfully in PostgreSQL database!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update profile.');
    }
  };

  const handleAddSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !editForm.skills.includes(trimmed)) {
      setEditForm(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
    }
    setSkillInput('');
    setShowSkillSuggestions(false);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  const handleSaveSectionItem = async (e) => {
    e.preventDefault();
    if (!profileUser?.profile) return;

    try {
      const keyMap = {
        'experience': 'experienceList',
        'education': 'educationList',
        'qualification': 'qualificationList',
        'certification': 'certificationList',
        'publication': 'publicationList'
      };

      const fieldKey = keyMap[modalType];
      const currentList = Array.isArray(profileUser.profile[fieldKey]) ? profileUser.profile[fieldKey] : [];
      const updatedList = [...currentList, { id: Date.now(), ...sectionForm }];

      await API.put('/users/profile', { [fieldKey]: updatedList });

      confetti();
      setModalType(null);
      setSectionForm({ title: '', institution: '', period: '', desc: '' });
      loadProfile();
    } catch (err) {
      alert('Failed to save section entry.');
    }
  };

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users/portfolio', portfolioForm);
      confetti();
      setShowPortfolioModal(false);
      setPortfolioForm({ title: '', category: 'Logo Design', img: '', link: '' });
      loadProfile();
      alert('Portfolio item added to your profile!');
    } catch (err) {
      alert('Failed to add portfolio item.');
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-sm text-slate-400 glass-panel rounded-3xl">Loading profile...</div>;
  }

  if (!profileUser) {
    return (
      <div className="p-16 text-center space-y-4 glass-panel rounded-3xl">
        <User className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-xl font-black text-white">Student Profile Not Found</h3>
        <Link to="/jobs" className="px-6 py-2.5 neon-airflow-btn text-white text-xs font-black rounded-xl inline-block">Return to Marketplace</Link>
      </div>
    );
  }

  const isOwner = currentUser && (currentUser.id === profileUser.id || currentUser.username === profileUser.username);
  const portfolioList = Array.isArray(profileUser.profile?.portfolioItems) ? profileUser.profile.portfolioItems : [];
  const experienceList = Array.isArray(profileUser.profile?.experienceList) ? profileUser.profile.experienceList : [];
  const educationList = Array.isArray(profileUser.profile?.educationList) ? profileUser.profile.educationList : [];
  const qualificationList = Array.isArray(profileUser.profile?.qualificationList) ? profileUser.profile.qualificationList : [];
  const certificationList = Array.isArray(profileUser.profile?.certificationList) ? profileUser.profile.certificationList : [];
  const publicationList = Array.isArray(profileUser.profile?.publicationList) ? profileUser.profile.publicationList : [];

  const filteredColleges = INDIAN_COLLEGES.filter(c => c.toLowerCase().includes(collegeQuery.toLowerCase()));
  const filteredCategories = COMPREHENSIVE_CATEGORIES.filter(cat => cat.toLowerCase().includes(categorySearchQuery.toLowerCase()));
  const filteredSkills = ALL_SKILLS_DATABASE.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !editForm.skills.includes(s));

  return (
    <div className="space-y-10 pb-24 w-full">
      
      {/* ─── 1. EXPANSIVE FULL-WIDTH COVER BANNER & HEADER ─── */}
      <div className="rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl w-full">
        {/* Cover Graphic */}
        <div className="h-60 sm:h-72 md:h-80 bg-gradient-to-r from-indigo-950 via-purple-950 to-pink-950 relative overflow-hidden flex items-end justify-end p-6">
          {profileUser.profile?.coverUrl && (
            <img src={profileUser.profile.coverUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-50" />
          )}
          {isOwner && (
            <button 
              onClick={() => alert('Cover photo upload enabled.')}
              className="px-5 py-2.5 bg-slate-950/85 hover:bg-slate-900 text-white text-xs font-black rounded-xl backdrop-blur-md border border-slate-700 shadow-xl relative z-10 transition"
            >
              Upload cover photo
            </button>
          )}
        </div>

        {/* Profile Info Header */}
        <div className="p-8 sm:p-12 relative">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-slate-900 -mt-20 sm:-mt-24 bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-5xl shadow-2xl shrink-0 relative">
                {profileUser.fullName.charAt(0)}
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-slate-950" title="Online" />
              </div>

              <div className="space-y-1.5">
                <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center space-x-3">
                  <span>{profileUser.fullName}</span>
                  <span className="text-slate-400 text-base font-normal">@{profileUser.username}</span>
                  <CheckCircle2 className="w-6 h-6 text-sky-400 shrink-0" />
                </h1>

                <div className="flex items-center space-x-3 text-sm font-bold text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>5.0 ({profileUser.reviewsReceived?.length || 0} reviews)</span>
                  <span className="text-slate-500 font-normal">• Age: {profileUser.age} yrs • India</span>
                </div>

                <div className="text-sm font-black uppercase text-indigo-400 tracking-wide pt-1">
                  {profileUser.profile?.tagline || 'Student Creator • Ready to Work'}
                </div>

                <div className="text-sm text-slate-300 pt-1">
                  <span className="text-emerald-400 font-black text-lg">₹{profileUser.profile?.hourlyRate || 499}</span> per hour • Joined {new Date(profileUser.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 w-full lg:w-auto">
              {isOwner ? (
                <>
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="px-6 py-3.5 bg-slate-900 border border-slate-700 hover:border-indigo-500 text-white text-xs font-black rounded-2xl transition flex items-center space-x-2 shadow-lg"
                  >
                    <Edit3 className="w-4 h-4 text-indigo-400" />
                    <span>Edit Profile</span>
                  </button>
                  <button 
                    onClick={() => setShowPortfolioModal(true)}
                    className="px-6 py-3.5 neon-airflow-btn text-white text-xs font-black rounded-2xl shadow-xl flex items-center space-x-1.5"
                  >
                    <ImagePlus className="w-4 h-4" />
                    <span>Manage Portfolio</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setShowInviteModal(true)}
                    className="px-6 py-3.5 bg-slate-900 border border-slate-700 hover:border-white text-white text-xs font-black rounded-2xl transition shadow-lg"
                  >
                    Invite to Bid
                  </button>
                  <button 
                    onClick={() => setShowInviteModal(true)}
                    className="px-8 py-3.5 bg-gradient-to-r from-pink-600 to-rose-500 text-white text-xs font-black rounded-2xl shadow-xl shadow-pink-600/30 uppercase tracking-wider"
                  >
                    Hire Directly
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 border-b border-slate-800 pt-10 text-sm font-black overflow-x-auto">
            {[
              { id: 'about', label: 'About Me' },
              { id: 'portfolio', label: `Portfolio Items (${portfolioList.length})` },
              { id: 'experience', label: 'Experience & Education' },
              { id: 'reviews', label: 'Client Reviews' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 transition whitespace-nowrap ${activeTab === tab.id ? 'text-pink-400 border-b-2 border-pink-500' : 'text-slate-400 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 2. CONTENT BODY & SIDEBAR ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* Left Column: Tab Content (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TAB 1: ABOUT ME */}
          {activeTab === 'about' && (
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-8">
              <div className="space-y-3">
                <h3 className="text-xl font-black text-white">About Me</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {profileUser.profile?.bio || 'Verified student freelancer ready to deliver quality work and build a strong portfolio.'}
                </p>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-800">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Primary Specialization</h4>
                <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-xl text-sm font-bold inline-block">
                  {profileUser.profile?.category || 'Graphic Design'}
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">College / Institute</h4>
                <span className="text-base font-bold text-white block">{profileUser.profile?.college || 'College Student'}</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Verified Skills & Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {(profileUser.profile?.skills || ['Student Talent']).map((s, i) => (
                    <span key={i} className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-white">Portfolio Items</h3>
                {isOwner && (
                  <button onClick={() => setShowPortfolioModal(true)} className="px-5 py-2.5 neon-airflow-btn text-white text-xs font-bold rounded-xl flex items-center space-x-1.5">
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                )}
              </div>

              {portfolioList.length === 0 ? (
                <div className="p-16 text-center bg-slate-950/40 border border-slate-800 rounded-3xl space-y-3">
                  <p className="text-sm text-slate-400">No portfolio items have been added yet.</p>
                  {isOwner && (
                    <button onClick={() => setShowPortfolioModal(true)} className="text-indigo-400 font-bold text-sm hover:underline block mx-auto">
                      + Click here to add projects and upload work proofs
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {portfolioList.map(item => (
                    <div key={item.id} className="relative h-64 rounded-3xl overflow-hidden border border-slate-800 group shadow-xl">
                      <img src={item.img || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-sm font-black text-white block">{item.title}</span>
                        <span className="text-xs text-pink-400 font-bold">{item.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FREELANCER SECTIONS */}
          {activeTab === 'experience' && (
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-10">
              
              {/* Experience */}
              <div className="space-y-4 pb-8 border-b border-slate-800">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-white">Experience</h3>
                  {isOwner && (
                    <button onClick={() => setModalType('experience')} className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center space-x-1">
                      <Plus className="w-4 h-4" /><span>Add experience</span>
                    </button>
                  )}
                </div>
                {experienceList.length === 0 ? (
                  <p className="text-sm text-slate-500">No experiences have been added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {experienceList.map(item => (
                      <div key={item.id} className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl">
                        <div className="text-base font-bold text-white">{item.title}</div>
                        <div className="text-xs text-indigo-400 font-semibold mt-0.5">{item.institution} • {item.period}</div>
                        {item.desc && <p className="text-xs text-slate-300 mt-2">{item.desc}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Education */}
              <div className="space-y-4 pb-8 border-b border-slate-800">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-white">Education</h3>
                  {isOwner && (
                    <button onClick={() => setModalType('education')} className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center space-x-1">
                      <Plus className="w-4 h-4" /><span>Add education</span>
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl">
                    <div className="text-base font-bold text-white">{profileUser.profile?.college || 'College Student'}</div>
                    <span className="text-xs text-emerald-400 font-bold block mt-1">✓ Student Status Verified</span>
                  </div>
                  {educationList.map(item => (
                    <div key={item.id} className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl">
                      <div className="text-base font-bold text-white">{item.title}</div>
                      <div className="text-xs text-indigo-400">{item.institution} ({item.period})</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualifications */}
              <div className="space-y-4 pb-8 border-b border-slate-800">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-white">Qualifications</h3>
                  {isOwner && (
                    <button onClick={() => setModalType('qualification')} className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center space-x-1">
                      <Plus className="w-4 h-4" /><span>Add qualification</span>
                    </button>
                  )}
                </div>
                {qualificationList.length === 0 ? (
                  <p className="text-sm text-slate-500">No qualifications have been added.</p>
                ) : (
                  <div className="space-y-4">
                    {qualificationList.map(item => (
                      <div key={item.id} className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl">
                        <div className="text-base font-bold text-white">{item.title}</div>
                        <div className="text-xs text-indigo-400">{item.institution} • {item.period}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Certifications */}
              <div className="space-y-4 pb-8 border-b border-slate-800">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-white">Certifications</h3>
                  {isOwner && (
                    <button onClick={() => setModalType('certification')} className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center space-x-1">
                      <Plus className="w-4 h-4" /><span>Add certification</span>
                    </button>
                  )}
                </div>
                {certificationList.length === 0 ? (
                  <p className="text-sm text-slate-500">No certifications have been added.</p>
                ) : (
                  <div className="space-y-4">
                    {certificationList.map(item => (
                      <div key={item.id} className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl">
                        <div className="text-base font-bold text-white">{item.title}</div>
                        <div className="text-xs text-indigo-400">{item.institution} ({item.period})</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Publications */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-white">Publications & Articles</h3>
                  {isOwner && (
                    <button onClick={() => setModalType('publication')} className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center space-x-1">
                      <Plus className="w-4 h-4" /><span>Add publication</span>
                    </button>
                  )}
                </div>
                {publicationList.length === 0 ? (
                  <p className="text-sm text-slate-500">No publications have been added.</p>
                ) : (
                  <div className="space-y-4">
                    {publicationList.map(item => (
                      <div key={item.id} className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl">
                        <div className="text-base font-bold text-white">{item.title}</div>
                        <div className="text-xs text-indigo-400">{item.institution} ({item.period})</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-xl font-black text-white">Client Reviews ({profileUser.reviewsReceived?.length || 0})</h3>
              {profileUser.reviewsReceived?.length === 0 ? (
                <p className="text-sm text-slate-500 py-6">No reviews yet. Completed orders will appear here automatically.</p>
              ) : (
                profileUser.reviewsReceived.map((r, i) => (
                  <div key={i} className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-1.5">
                    <div className="text-sm font-bold text-white">{r.author?.fullName}</div>
                    <p className="text-xs text-slate-300">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar: Real Verifications & Scorecard (4 Cols) */}
        <div className="lg:col-span-4 glass-panel p-8 rounded-3xl border border-slate-800 space-y-8 sticky top-28">
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Verifications</h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center space-x-2.5 text-emerald-400 font-bold"><Check className="w-5 h-5" /><span>Identity Verified</span></div>
              <div className="flex items-center space-x-2.5 text-emerald-400 font-bold"><Check className="w-5 h-5" /><span>College Student ID Verified</span></div>
              <div className="flex items-center space-x-2.5 text-emerald-400 font-bold"><Check className="w-5 h-5" /><span>Email Verified</span></div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-800">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Performance Metrics</h4>
            <div className="space-y-3 text-sm font-bold text-slate-300">
              <div className="flex justify-between"><span>On time delivery</span><span className="text-emerald-400">100%</span></div>
              <div className="flex justify-between"><span>On budget</span><span className="text-emerald-400">100%</span></div>
              <div className="flex justify-between"><span>Reputation Points</span><span className="text-pink-400">{profileUser.points || 50} pts</span></div>
            </div>
          </div>

          {isOwner ? (
            <button onClick={() => setShowEditModal(true)} className="w-full py-4 neon-airflow-btn text-white text-xs font-black rounded-2xl shadow-xl uppercase tracking-wider">
              Edit My Profile Details
            </button>
          ) : (
            <button onClick={() => setShowInviteModal(true)} className="w-full py-4 neon-airflow-btn text-white text-xs font-black rounded-2xl shadow-xl uppercase tracking-wider">
              Hire {profileUser.fullName}
            </button>
          )}
        </div>
      </div>

      {/* ─── MODAL: EDIT PROFILE WITH EXPANSIVE FIELDS ─── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="neon-border-box max-w-xl w-full p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button onClick={() => setShowEditModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="text-2xl font-black text-white mb-2">Edit Your Profile</h3>
            <p className="text-xs text-slate-400 mb-6">Select from all Indian universities, 50+ categories, and thousands of smart skill tags.</p>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-1.5">Tagline / Professional Headline</label>
                <input required type="text" value={editForm.tagline} onChange={e => setEditForm({...editForm, tagline: e.target.value})} placeholder="e.g. Minimalist Logo Designer • IIT Madras" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white" />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-1.5">Primary Category / Field</label>
                <input 
                  type="text" 
                  value={categorySearchQuery} 
                  onChange={e => setCategorySearchQuery(e.target.value)} 
                  placeholder="Filter category list (e.g. Web, Python, Logo, Video, AI)..." 
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white mb-2 outline-none" 
                />
                <select 
                  value={editForm.category} 
                  onChange={e => setEditForm({...editForm, category: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-bold"
                >
                  {filteredCategories.map(cat => (
                    <option key={cat} value={cat.split(' (')[0]}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-1.5">Hourly Rate (₹ INR)</label>
                <input required type="number" value={editForm.hourlyRate} onChange={e => setEditForm({...editForm, hourlyRate: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-bold" />
              </div>

              {/* College / University */}
              <div className="relative">
                <label className="block text-xs font-black text-slate-400 uppercase mb-1.5">College / University Name</label>
                <input 
                  required 
                  type="text" 
                  value={collegeQuery} 
                  onChange={e => {
                    setCollegeQuery(e.target.value);
                    setEditForm({...editForm, college: e.target.value});
                    setShowCollegeDropdown(true);
                  }} 
                  onFocus={() => setShowCollegeDropdown(true)}
                  placeholder="Search your college (e.g. Mohan Babu University, IIT, JNTU, DU...)" 
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-indigo-500" 
                />

                {showCollegeDropdown && (
                  <div className="absolute top-20 left-0 right-0 z-50 max-h-52 overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 space-y-1">
                    {collegeQuery.trim() && (
                      <div 
                        onClick={() => {
                          setEditForm({...editForm, college: collegeQuery});
                          setShowCollegeDropdown(false);
                        }}
                        className="p-2.5 bg-indigo-600/30 hover:bg-indigo-600/50 rounded-lg text-xs text-indigo-200 cursor-pointer font-bold transition flex items-center space-x-2 border border-indigo-500/40"
                      >
                        <CheckCircle className="w-4 h-4 text-indigo-400" />
                        <span>Use Custom: "{collegeQuery}"</span>
                      </div>
                    )}

                    {filteredColleges.slice(0, 15).map((col, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          setCollegeQuery(col);
                          setEditForm({...editForm, college: col});
                          setShowCollegeDropdown(false);
                        }}
                        className="p-2.5 hover:bg-indigo-600/20 rounded-lg text-xs text-slate-200 cursor-pointer transition flex items-center space-x-2"
                      >
                        <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>{col}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Smart Skill Tags */}
              <div className="relative">
                <label className="block text-xs font-black text-slate-400 uppercase mb-1.5">Skills & Tools</label>
                
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {editForm.skills.map((s, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-bold rounded-xl flex items-center space-x-1.5">
                      <span>{s}</span>
                      <button type="button" onClick={() => handleRemoveSkill(s)} className="text-slate-400 hover:text-white">✕</button>
                    </span>
                  ))}
                </div>

                <input 
                  type="text" 
                  value={skillInput} 
                  onChange={e => {
                    setSkillInput(e.target.value);
                    setShowSkillSuggestions(true);
                  }}
                  onKeyDown={e => {
                    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
                      e.preventDefault();
                      handleAddSkill(skillInput);
                    }
                  }}
                  placeholder="Type a skill (e.g. React, Python, Figma, Excel, Video Editing)..." 
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-indigo-500" 
                />

                {showSkillSuggestions && skillInput.trim() && (
                  <div className="absolute top-28 left-0 right-0 z-50 max-h-40 overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 flex flex-wrap gap-1.5">
                    <span 
                      onClick={() => handleAddSkill(skillInput)}
                      className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg cursor-pointer transition shadow-md"
                    >
                      + Add "{skillInput}"
                    </span>

                    {filteredSkills.slice(0, 12).map((skill, idx) => (
                      <span 
                        key={idx}
                        onClick={() => handleAddSkill(skill)}
                        className="px-3 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold rounded-lg cursor-pointer transition"
                      >
                        + {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-1.5">About Me / Bio</label>
                <textarea rows="4" value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} placeholder="Describe your student skills and background..." className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white" />
              </div>

              <button type="submit" className="w-full py-4 neon-airflow-btn text-white text-xs font-black rounded-2xl uppercase tracking-wider">Save Changes to PostgreSQL</button>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: ADD SECTION ITEM ─── */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="neon-border-box max-w-md w-full p-8 shadow-2xl relative">
            <button onClick={() => setModalType(null)} className="absolute top-5 right-5 text-slate-400 hover:text-white">✕</button>
            <h3 className="text-xl font-black text-white mb-4 uppercase">
              Add {modalType}
            </h3>

            <form onSubmit={handleSaveSectionItem} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-1.5">
                  {modalType === 'education' ? 'Degree / Field of Study' : 'Title / Role / Certification Name'}
                </label>
                <input required type="text" value={sectionForm.title} onChange={e => setSectionForm({...sectionForm, title: e.target.value})} placeholder="e.g. B.Tech Computer Science" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white" />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-1.5">
                  {modalType === 'education' ? 'College / University Name' : 'Company / Organization / Platform'}
                </label>
                <input required type="text" value={sectionForm.institution} onChange={e => setSectionForm({...sectionForm, institution: e.target.value})} placeholder="e.g. IIT Madras / Coursera" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white" />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-1.5">Time Period / Year</label>
                <input required type="text" value={sectionForm.period} onChange={e => setSectionForm({...sectionForm, period: e.target.value})} placeholder="e.g. 2024 - 2028 or Oct 2024 - Present" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white" />
              </div>

              {modalType === 'experience' && (
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-1.5">Description / Key Tasks</label>
                  <textarea rows="3" value={sectionForm.desc} onChange={e => setSectionForm({...sectionForm, desc: e.target.value})} placeholder="Describe your responsibilities..." className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white" />
                </div>
              )}

              <button type="submit" className="w-full py-4 neon-airflow-btn text-white text-xs font-black rounded-2xl uppercase tracking-wider">
                Save {modalType}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Portfolio Modal */}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="neon-border-box max-w-md w-full p-8 shadow-2xl relative">
            <button onClick={() => setShowPortfolioModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">✕</button>
            <h3 className="text-xl font-black text-white mb-4">Add Portfolio Project</h3>
            <form onSubmit={handleAddPortfolio} className="space-y-4">
              <input required type="text" value={portfolioForm.title} onChange={e => setPortfolioForm({...portfolioForm, title: e.target.value})} placeholder="Project Title" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white" />
              <input type="text" value={portfolioForm.category} onChange={e => setPortfolioForm({...portfolioForm, category: e.target.value})} placeholder="Category (e.g. Logo Design)" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white" />
              <input required type="url" value={portfolioForm.img} onChange={e => setPortfolioForm({...portfolioForm, img: e.target.value})} placeholder="Image Preview URL" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white" />
              <button type="submit" className="w-full py-4 neon-airflow-btn text-white text-xs font-black rounded-2xl uppercase tracking-wider">Add to Portfolio</button>
            </form>
          </div>
        </div>
      )}

      {/* Direct Hire Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="neon-border-box max-w-md w-full p-8 shadow-2xl relative">
            <button onClick={() => setShowInviteModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">✕</button>
            <h3 className="text-xl font-black text-white">Hire {profileUser.fullName}</h3>
            <form onSubmit={(e) => { e.preventDefault(); confetti(); setShowInviteModal(false); alert('Direct Hire Offer sent!'); }} className="space-y-4">
              <input required type="text" placeholder="Project Title" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white" />
              <input required type="number" placeholder="Budget in ₹ INR" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white font-bold" />
              <textarea required rows="3" placeholder="Project deliverables..." className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white" />
              <button type="submit" className="w-full py-4 neon-airflow-btn text-white text-xs font-black rounded-2xl uppercase tracking-wider">Send Project Offer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
