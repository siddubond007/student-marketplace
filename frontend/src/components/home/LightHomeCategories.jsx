import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, Palette, Video, Cpu, PenTool, Smartphone, 
  ArrowRight, Sparkles, Layers, ChevronRight 
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'web-dev',
    title: 'Web & Full-Stack',
    description: 'React, Next.js, Node, MERN stack & modern landing pages.',
    icon: Code,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    iconColor: 'text-blue-600',
    skills: ['React', 'Next.js', 'Node.js', 'Tailwind', 'MongoDB'],
    count: '3,400+ Gigs',
    startingPrice: '₹999',
    slug: 'Web Development'
  },
  {
    id: 'ui-ux',
    title: 'UI/UX & Branding',
    description: 'Figma prototypes, app design systems, logos & illustrations.',
    icon: Palette,
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-100',
    iconColor: 'text-pink-600',
    skills: ['Figma', 'Mobile UI', 'Design Systems', 'Logos'],
    count: '2,800+ Gigs',
    startingPrice: '₹799',
    slug: 'UI/UX Design'
  },
  {
    id: 'video-editing',
    title: 'Video & Motion',
    description: 'Viral Instagram Reels, YouTube cuts, color grading & 3D.',
    icon: Video,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100',
    iconColor: 'text-purple-600',
    skills: ['Reels', 'Premiere Pro', 'After Effects', 'Shorts'],
    count: '4,100+ Gigs',
    startingPrice: '₹499',
    slug: 'Video Editing'
  },
  {
    id: 'ai-data',
    title: 'AI, ML & Data Science',
    description: 'Custom AI bots, LangChain, PyTorch, scrapers & analytics.',
    icon: Cpu,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
    iconColor: 'text-amber-600',
    skills: ['Python', 'LangChain', 'OpenAI', 'Data Scraping'],
    count: '1,900+ Gigs',
    startingPrice: '₹1,499',
    slug: 'AI & Data'
  },
  {
    id: 'content-writing',
    title: 'Content & Copywriting',
    description: 'SEO blogs, technical documentation, scripts & cold emails.',
    icon: PenTool,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    iconColor: 'text-emerald-600',
    skills: ['SEO Blogs', 'Technical Docs', 'Scripts', 'Copywriting'],
    count: '2,300+ Gigs',
    startingPrice: '₹399',
    slug: 'Content Writing'
  },
  {
    id: 'mobile-apps',
    title: 'Mobile App Development',
    description: 'Native & cross-platform Flutter, React Native, iOS & Android.',
    icon: Smartphone,
    color: 'from-sky-500 to-cyan-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-100',
    iconColor: 'text-sky-600',
    skills: ['Flutter', 'React Native', 'Swift', 'Kotlin'],
    count: '1,500+ Gigs',
    startingPrice: '₹1,999',
    slug: 'Mobile Apps'
  }
];

export default function LightHomeCategories() {
  return (
    <section className="py-16 sm:py-20 relative z-10 bg-slate-50/50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title and View All Link */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Explore Skills
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Popular Services by Student Freelancers
            </h2>
            <p className="text-sm text-slate-600">
              Browse top categories with hundreds of active student creators ready to start today.
            </p>
          </div>

          <Link
            to="/gigs"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            <span>Explore All 4,000+ Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/gigs?category=${encodeURIComponent(cat.slug)}`}
                className="light-solid-card p-6 block group hover:-translate-y-1 transition duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${cat.bgColor} ${cat.borderColor} border ${cat.iconColor} flex items-center justify-center group-hover:scale-110 transition duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-400 block">{cat.count}</span>
                    <span className="text-xs font-black text-slate-900">From {cat.startingPrice}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition mb-1.5 flex items-center justify-between">
                  <span>{cat.title}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-indigo-600 transform group-hover:translate-x-1 transition duration-200" />
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
