import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, Users, DollarSign, RefreshCw, CheckCircle2, Shield } from 'lucide-react';

const JOURNEY_STAGES = [
  {
    step: '01',
    student: 'Alice Johnson',
    college: 'GL Bajaj Institute',
    role: 'Original Owner (Bought New)',
    action: 'Purchased for Semester 1 (Algorithms & Data Structures)',
    price: '₹850.00',
    status: 'Used carefully for coursework and exams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    color: '#00F0FF',
    savings: '₹0 (Initial Purchase)',
  },
  {
    step: '02',
    student: 'Bob Smith',
    college: 'IIT Delhi Campus',
    role: 'Second Reader (Second-Hand)',
    action: 'Bought via BookCycle for ₹380 (Saved 55%)',
    price: '₹380.00',
    status: 'Prepared for technical coding interviews',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    color: '#FF0055',
    savings: 'Saved ₹470.00',
  },
  {
    step: '03',
    student: 'Charlie Davis',
    college: 'IIIT Allahabad',
    role: 'Third Reader (Peer Exchange)',
    action: 'Exchanged for Operating Systems textbook with zero cash',
    price: '₹0.00 (Trade)',
    status: 'Used highlighted sections and annotations',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    color: '#9D4EDD',
    savings: 'Saved ₹850.00',
  },
  {
    step: '04',
    student: 'Divya Patel',
    college: 'BITS Pilani',
    role: 'Fourth Reader (Free Donation)',
    action: 'Passed forward to junior as free campus donation',
    price: 'FREE (₹0.00)',
    status: 'Helping next-gen freshers succeed',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    color: '#38E5FF',
    savings: 'Total Community Saved: ₹2,170+',
  },
];

export default function BookJourney3D() {
  const [activeStep, setActiveStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % JOURNEY_STAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const current = JOURNEY_STAGES[activeStep];

  return (
    <section className="section" style={{ position: 'relative', background: 'rgba(4, 7, 17, 0.75)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem auto' }}>
          <div className="badge badge-sell" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={13} />
            <span>THE LIFECYCLE OF KNOWLEDGE REUSE</span>
          </div>
          <h2 className="heading-section">
            One Textbook. <span className="gradient-text">Many Readers.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
            See how a single textbook passes from student to student, saving thousands of rupees and keeping learning sustainable.
          </p>
        </div>

        {/* 4-Node Interactive Timeline */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '3rem',
        }}>
          {JOURNEY_STAGES.map((st, i) => {
            const isActive = i === activeStep;
            return (
              <button
                key={st.step}
                onClick={() => {
                  setActiveStep(i);
                  setAutoPlay(false);
                }}
                style={{
                  background: isActive ? 'rgba(12, 18, 36, 0.95)' : 'rgba(6, 10, 22, 0.6)',
                  border: isActive ? `2px solid ${st.color}` : '1px solid var(--border-subtle)',
                  boxShadow: isActive ? `0 0 25px ${st.color}50` : 'none',
                  padding: '1.25rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'Space Grotesk, sans-serif', color: st.color }}>
                    {st.step}
                  </span>
                  {isActive && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: st.color, boxShadow: `0 0 10px ${st.color}` }} />}
                </div>
                <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.95rem' }}>{st.student.split(' ')[0]}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{st.role.split(' ')[0]}</div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Deep Dive Card */}
        <div
          className="glass-panel"
          style={{
            padding: '2.5rem 3rem',
            borderRadius: 'var(--radius-xl)',
            border: `2px solid ${current.color}`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 35px ${current.color}35`,
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            gap: '2.5rem',
            alignItems: 'center',
          }}
        >
          {/* Avatar */}
          <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: `linear-gradient(135deg, ${current.color}, #040711)`, padding: '3px' }}>
            <img
              src={current.avatar}
              alt={current.student}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>

          {/* Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', fontWeight: 900 }}>{current.student}</h3>
              <span className="badge" style={{ background: `${current.color}25`, color: current.color, border: `1px solid ${current.color}` }}>
                {current.role}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>
              {current.college} • {current.action}
            </div>
            <div style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 600 }}>
              Status: <span style={{ color: current.color }}>{current.status}</span>
            </div>
          </div>

          {/* Savings Highlight */}
          <div style={{
            background: 'rgba(4, 7, 17, 0.85)',
            border: `1.5px solid ${current.color}`,
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.75rem',
            textAlign: 'center',
            boxShadow: `0 0 20px ${current.color}25`,
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Community Impact</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: current.color, fontFamily: 'Space Grotesk, sans-serif', marginTop: '2px' }}>
              {current.savings}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div:nth-child(2) {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .container > div:last-child {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
