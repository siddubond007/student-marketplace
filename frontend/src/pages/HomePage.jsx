import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import LightHomeHero from '../components/home/LightHomeHero';
import LightHomeDualRole from '../components/home/LightHomeDualRole';
import LightHomeCategories from '../components/home/LightHomeCategories';
import LightHomeFeaturedTalent from '../components/home/LightHomeFeaturedTalent';
import LightHomeTrustEscrow from '../components/home/LightHomeTrustEscrow';
import LightHomeFooter from '../components/home/LightHomeFooter';
import HomeHero from '../components/home/HomeHero';
import HomeDualPerspective from '../components/home/HomeDualPerspective';
import '../styles/home-light.css';

export default function HomePage({ currentUser, themeMode = 'light', onToggleTheme }) {
  const isDark = themeMode === 'dark';

  return (
    <div className="relative">
      
      {/* Floating Theme Switcher Badge (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
        <button
          onClick={onToggleTheme}
          type="button"
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-xl border shadow-2xl transition duration-300 transform hover:scale-105 cursor-pointer bg-slate-900/90 text-white border-slate-700 hover:border-indigo-500"
          title={`Switch to ${isDark ? 'Light Mode' : 'Dark Space Mode'}`}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span className="text-xs font-bold text-amber-200">Switch to Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-200">Switch to Dark Cosmic Mode</span>
            </>
          )}
        </button>
      </div>

      {isDark ? (
        /* ═══════════════════════════════════════════════════════════════
           DARK COSMIC THEME (Space Hero Graphics & Cursor Galaxy)
           ═══════════════════════════════════════════════════════════════ */
        <div className="space-y-20 pb-16">
          {/* 1. Cinematic Space Hero with interactive Star Atmosphere & Cursor Galaxy */}
          <HomeHero currentUser={currentUser} />

          {/* 2. Dual Perspective Interactive Comparison Rails */}
          <HomeDualPerspective />

          {/* 3. Skill & Category Discovery Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LightHomeCategories />
          </div>

          {/* 4. Verified Student Talent Showcase */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LightHomeFeaturedTalent currentUser={currentUser} />
          </div>

          {/* 5. 5-Day Escrow Protection & Campus Trust Proof */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LightHomeTrustEscrow />
          </div>

          {/* 6. Master Dark Footer */}
          <LightHomeFooter />
        </div>
      ) : (
        /* ═══════════════════════════════════════════════════════════════
           LIGHT DAYLIGHT THEME (Clean Canvas, Constellation Mesh, Modern Cards)
           ═══════════════════════════════════════════════════════════════ */
        <div className="home-light-wrapper">
          {/* Soft Ambient Background Mesh */}
          <div className="home-light-mesh-bg" />

          {/* 1. Light Mode Hero with Interactive Constellation Canvas & Smart Search */}
          <LightHomeHero currentUser={currentUser} />

          {/* 2. Interactive Role Switcher (For Clients vs For Students) */}
          <LightHomeDualRole currentUser={currentUser} />

          {/* 3. Skill & Category Discovery Grid */}
          <LightHomeCategories />

          {/* 4. Verified Student Talent & Featured Gigs Showcase */}
          <LightHomeFeaturedTalent currentUser={currentUser} />

          {/* 5. 5-Day Escrow Protection & Campus Trust Proof */}
          <LightHomeTrustEscrow />

          {/* 6. Comprehensive Light Mode Master Footer */}
          <LightHomeFooter />
        </div>
      )}
    </div>
  );
}
