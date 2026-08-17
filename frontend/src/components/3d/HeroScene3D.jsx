import React from 'react';
import ErrorBoundary from '../ErrorBoundary';

// Premium 3D Floating Book Showcase Visual
function BookCycleHeroVisual() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '440px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      perspective: '1200px'
    }}>
      {/* Deep Obsidian Background Ambient Light Glow */}
      <div style={{
        position: 'absolute',
        width: '360px',
        height: '360px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 240, 255, 0.25) 0%, rgba(157, 78, 221, 0.18) 40%, rgba(255, 0, 85, 0.12) 65%, transparent 80%)',
        filter: 'blur(50px)',
        zIndex: 0
      }} />

      {/* Outer Royal Purple Orbital Ring */}
      <div className="animate-spin-slow" style={{
        position: 'absolute',
        width: '390px',
        height: '390px',
        borderRadius: '50%',
        border: '1.5px dashed rgba(157, 78, 221, 0.45)',
        boxShadow: '0 0 30px rgba(157, 78, 221, 0.25)',
        zIndex: 1
      }} />

      {/* Inner Electric Cyan Orbital Ring */}
      <div className="animate-spin-slow" style={{
        animationDirection: 'reverse',
        animationDuration: '18s',
        position: 'absolute',
        width: '310px',
        height: '310px',
        borderRadius: '50%',
        border: '1.5px solid rgba(0, 240, 255, 0.45)',
        boxShadow: '0 0 25px rgba(0, 240, 255, 0.3)',
        zIndex: 1
      }} />

      {/* Main Center Floating 3D Textbook */}
      <div className="animate-float" style={{
        width: '260px',
        height: '340px',
        background: 'linear-gradient(145deg, rgba(12, 18, 36, 0.95), rgba(4, 7, 17, 0.98))',
        border: '2px solid rgba(0, 240, 255, 0.55)',
        borderRadius: '22px',
        boxShadow: '0 25px 65px rgba(0, 0, 0, 0.85), 0 0 40px rgba(0, 240, 255, 0.35), inset 0 0 20px rgba(157, 78, 221, 0.2)',
        transform: 'rotateY(-15deg) rotateX(10deg)',
        transformStyle: 'preserve-3d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backdropFilter: 'blur(20px)',
        zIndex: 2,
        position: 'relative'
      }}>
        {/* Floating Top Badge */}
        <div style={{
          position: 'absolute',
          top: '-16px',
          background: 'linear-gradient(135deg, #00F0FF, #0088FF)',
          border: '1.5px solid #FFFFFF',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.6)',
          color: '#040711',
          padding: '4px 14px',
          borderRadius: '9999px',
          fontSize: '11px',
          fontWeight: 900,
          letterSpacing: '0.08em',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#040711' }} />
          <span>VERIFIED CAMPUS MARKETPLACE</span>
        </div>

        {/* Floating Book Icon */}
        <div style={{
          fontSize: '54px',
          marginBottom: '14px',
          filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.8))'
        }}>📖</div>

        <div style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 800,
          fontSize: '24px',
          color: '#FFFFFF',
          textAlign: 'center',
          letterSpacing: '-0.02em',
          textShadow: '0 0 20px rgba(0, 240, 255, 0.5)'
        }}>BookCycle</div>

        <div style={{
          fontSize: '11px',
          color: '#00F0FF',
          fontWeight: 800,
          marginTop: '6px',
          letterSpacing: '0.1em'
        }}>READ. EXCHANGE. REPEAT.</div>

        {/* Floating Category Tags */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          gap: '8px',
          fontSize: '11px'
        }}>
          <span className="badge badge-sell">SELL</span>
          <span className="badge badge-exchange">TRADE</span>
          <span className="badge badge-donate">FREE</span>
        </div>
      </div>

      {/* Satellite Floating Tag 1 (Top Right: Royal Purple) */}
      <div className="animate-float" style={{
        animationDelay: '1.2s',
        position: 'absolute',
        top: '12%',
        right: '4%',
        background: 'rgba(8, 14, 28, 0.92)',
        border: '1.5px solid rgba(157, 78, 221, 0.65)',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.75), 0 0 25px rgba(157, 78, 221, 0.4)',
        borderRadius: '16px',
        padding: '10px 18px',
        zIndex: 3,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{ fontSize: '22px' }}>🔄</div>
        <div>
          <div style={{ fontSize: '11px', color: '#C084FC', fontWeight: 900, letterSpacing: '0.05em' }}>BOOK-FOR-BOOK</div>
          <div style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 800 }}>Peer Textbook Exchange</div>
        </div>
      </div>

      {/* Satellite Floating Tag 2 (Bottom Left: Crimson Red) */}
      <div className="animate-float" style={{
        animationDelay: '2.4s',
        position: 'absolute',
        bottom: '12%',
        left: '4%',
        background: 'rgba(8, 14, 28, 0.92)',
        border: '1.5px solid rgba(255, 0, 85, 0.65)',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.75), 0 0 25px rgba(255, 0, 85, 0.4)',
        borderRadius: '16px',
        padding: '10px 18px',
        zIndex: 3,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{ fontSize: '22px' }}>🛡️</div>
        <div>
          <div style={{ fontSize: '11px', color: '#FF2A6D', fontWeight: 900, letterSpacing: '0.05em' }}>STUDENT VERIFIED</div>
          <div style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 800 }}>Safe Campus Meetups</div>
        </div>
      </div>
    </div>
  );
}

export default function HeroScene3D() {
  return (
    <ErrorBoundary fallback={<BookCycleHeroVisual />}>
      <BookCycleHeroVisual />
    </ErrorBoundary>
  );
}
