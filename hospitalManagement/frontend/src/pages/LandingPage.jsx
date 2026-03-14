import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const LandingPage = () => {
  const features = [
    {
      title: 'Multi-Clinic Management',
      desc: 'Manage multiple clinics from a single dashboard with role-based access control.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1" />
          <path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #2563eb, #06b6d4)',
    },
    {
      title: 'Smart Appointments',
      desc: 'Patients can book online or walk-in. Doctors manage schedules with real-time slots.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          <path d="M9 16l2 2 4-4" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #0f766e, #14b8a6)',
    },
    {
      title: 'Digital Prescriptions',
      desc: 'Doctors create and issue prescriptions digitally — linked to each appointment.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    },

    {
      title: 'Role-Based Dashboards',
      desc: 'Dedicated dashboards for Super Admin, Clinic Admin, Doctor, and Patient roles.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #059669, #10b981)',
    },
    {
      title: 'Secure & Reliable',
      desc: 'JWT authentication, role-based authorization, and encrypted data at every level.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #dc2626, #f59e0b)',
    },
  ];

  const stats = [
    { value: '4+', label: 'User Roles' },
    { value: '10+', label: 'Features' },
    { value: '100%', label: 'Responsive' },
    { value: '24/7', label: 'Available' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', overflowX: 'hidden' }}>
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section style={{
        position: 'relative', padding: '80px 24px 100px',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 100%)',
        overflow: 'hidden', textAlign: 'center'
      }}>
        {/* Background glow orbs */}
        <div style={{
          position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%)',
          top: '-100px', left: '-100px', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          bottom: '-100px', right: '-50px', pointerEvents: 'none'
        }} />

        <div className="animate-fade-in-up" style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>


          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900,
            lineHeight: 1.15, letterSpacing: '-0.03em', margin: '0 0 20px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #14b8a6, #06b6d4, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Smart Multi-Clinic Healthcare Management System
            </span>
          </h1>

          <p style={{
            fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)',
            maxWidth: '580px', margin: '0 auto 36px', lineHeight: 1.7
          }}>
            A complete clinic management solution — from appointment booking to prescriptions,
            to multi-clinic admin. Built for modern healthcare.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              padding: '14px 32px', borderRadius: '12px', textDecoration: 'none',
              background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
              color: 'white', fontWeight: 700, fontSize: '1rem',
              boxShadow: '0 4px 20px rgba(20,184,166,0.4)',
              transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '8px'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(20,184,166,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(20,184,166,0.4)'; }}
            >
              Get Started Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
            <Link to="/login" style={{
              padding: '14px 32px', borderRadius: '12px', textDecoration: 'none',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', fontWeight: 600, fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Sign In →
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="animate-fade-in-up stagger-2" style={{
          display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap',
          marginTop: '64px', position: 'relative', zIndex: 1
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#5eead4', margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', margin: '4px 0 0', fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section style={{
        padding: '80px 24px', background: '#0f172a',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ color: '#14b8a6', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Features</p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Everything You Need
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '12px', maxWidth: '500px', margin: '12px auto 0', lineHeight: 1.6 }}>
              A unified platform that connects clinics, doctors, and patients seamlessly.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {features.map((f, idx) => (
              <div key={idx} className={`animate-fade-in-up stagger-${idx + 1}`} style={{
                padding: '28px', borderRadius: '16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.3s ease', cursor: 'default'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(20,184,166,0.2)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: f.gradient, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'white',
                  marginBottom: '18px', boxShadow: `0 4px 15px rgba(0,0,0,0.3)`
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px', color: 'white' }}>{f.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ROLES SECTION ===== */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, #0f172a, #1e293b)',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#818cf8', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Who Is It For</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 40px', letterSpacing: '-0.02em' }}>
            Built for Every Role
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { role: 'Super Admin', emoji: '🛡️', desc: 'Oversee all clinics, manage system-wide stats.', color: '#8b5cf6' },
              { role: 'Clinic Admin', emoji: '🏥', desc: 'Register doctors, manage bookings, handle walk-ins.', color: '#3b82f6' },
              { role: 'Doctor', emoji: '👨‍⚕️', desc: 'Manage schedule, view appointments, issue prescriptions.', color: '#0f766e' },
              { role: 'Patient', emoji: '🙋', desc: 'Book appointments, view history.', color: '#f59e0b' },
            ].map((r, i) => (
              <div key={i} className={`animate-fade-in-up stagger-${i + 1}`} style={{
                padding: '24px 20px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.3s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${r.color}40`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{r.emoji}</div>
                <h4 style={{ fontWeight: 700, margin: '0 0 6px', color: r.color }}>{r.role}</h4>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, margin: 0 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section style={{
        padding: '80px 24px', textAlign: 'center',
        background: '#0f172a',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div className="animate-fade-in-up" style={{
          maxWidth: '600px', margin: '0 auto', padding: '48px 40px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(20,184,166,0.1), rgba(99,102,241,0.1))',
          border: '1px solid rgba(20,184,166,0.15)'
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Ready to Get Started?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 28px', lineHeight: 1.6 }}>
            Create your free account and start managing your healthcare system today.
          </p>
          <Link to="/register" style={{
            padding: '14px 36px', borderRadius: '12px', textDecoration: 'none',
            background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
            color: 'white', fontWeight: 700, fontSize: '1rem',
            boxShadow: '0 4px 20px rgba(20,184,166,0.4)',
            transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '8px'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Create Free Account
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        padding: '24px', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem'
      }}>
        © 2026 MediCare SaaS. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
