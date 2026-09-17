import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, ShieldCheck, Zap, Heart, CheckCircle2, 
  ArrowRight, Award, GraduationCap, ChevronRight 
} from 'lucide-react';

const FEATURED_GIGS = [
  {
    id: 'gig-1',
    title: 'Modern responsive SaaS landing page in React & Tailwind CSS',
    seller: {
      name: 'Aditya Sen',
      college: 'IIT Kharagpur',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      level: 'TOP TIER',
      rating: 5.0,
      reviewsCount: 48
    },
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
    price: '₹1,999',
    deliveryDays: '2 Days',
    category: 'Web Development'
  },
  {
    id: 'gig-2',
    title: 'High-converting mobile app UI/UX design & Figma prototype',
    seller: {
      name: 'Pooja Iyer',
      college: 'NID Ahmedabad',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      level: 'PRO',
      rating: 4.9,
      reviewsCount: 36
    },
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    price: '₹1,499',
    deliveryDays: '1 Day',
    category: 'UI/UX Design'
  },
  {
    id: 'gig-3',
    title: 'Viral Instagram Reels, TikTok & YouTube Shorts fast editing',
    seller: {
      name: 'Kabir Mehta',
      college: 'Delhi University',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      level: 'PRO',
      rating: 5.0,
      reviewsCount: 72
    },
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
    price: '₹799',
    deliveryDays: '24 Hours',
    category: 'Video Editing'
  },
  {
    id: 'gig-4',
    title: 'Custom AI Chatbot integration & Python LangChain workflow',
    seller: {
      name: 'Tanvi Deshmukh',
      college: 'NIT Trichy',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      level: 'TOP TIER',
      rating: 5.0,
      reviewsCount: 29
    },
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80',
    price: '₹2,499',
    deliveryDays: '3 Days',
    category: 'AI & Data'
  }
];

export default function LightHomeFeaturedTalent() {
  return (
    <section className="py-16 sm:py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Verified Student Gigs
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Top Rated Student Freelancers
            </h2>
            <p className="text-sm text-slate-600">
              Hand-picked creators with verified student status and 100% 5-star review history.
            </p>
          </div>

          <Link
            to="/gigs"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            <span>View All Featured Gigs</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured Gigs Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_GIGS.map((gig) => (
            <div
              key={gig.id}
              className="light-solid-card overflow-hidden flex flex-col justify-between group hover:-translate-y-1.5 transition duration-300"
            >
              <div>
                {/* Gig Thumbnail */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={gig.image}
                    alt={gig.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-800 shadow-sm border border-slate-200/60">
                    {gig.category}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-medium text-white flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{gig.deliveryDays}</span>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={gig.seller.avatar}
                      alt={gig.seller.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {gig.seller.name}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-indigo-50 text-indigo-700 shrink-0">
                          {gig.seller.level}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 truncate block font-medium">
                        {gig.seller.college}
                      </span>
                    </div>
                  </div>

                  {/* Gig Title */}
                  <Link
                    to="/gigs"
                    className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition line-clamp-2 leading-snug block"
                  >
                    {gig.title}
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span className="font-bold text-slate-900">{gig.seller.rating}</span>
                    <span className="text-slate-400 text-[11px]">({gig.seller.reviewsCount})</span>
                  </div>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Starting at</span>
                  <span className="text-sm font-black text-slate-900">{gig.price}</span>
                </div>
                <Link
                  to="/gigs"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1"
                >
                  <span>Hire</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
