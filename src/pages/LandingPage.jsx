import React from 'react';
import {
  Wallet,
  TrendingUp,
  ShieldCheck,
  Smartphone,
  PieChart,
  BellRing,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const LandingPage = ({ onGetStarted, onGuestLogin, onLogin }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', position: 'relative', overflowX: 'hidden' }}>
      {/* Background ambient lighting */}
      <div className="ambient-glow ambient-glow-1" />
      <div className="ambient-glow ambient-glow-2" />

      {/* Navigation Bar */}
      <nav
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Wallet size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Moni<span style={{ color: 'var(--primary)' }}>.</span>
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onLogin} className="btn btn-ghost" style={{ fontWeight: 600 }}>
            Sign In
          </button>
          <button onClick={onGetStarted} className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '4rem 2rem 5rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'var(--primary-light)',
            border: '1px solid var(--income-border)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--primary)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.5rem'
          }}
        >
          <Sparkles size={16} />
          <span>Personal Budget & Expense Intelligence</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: '850px',
            margin: '0 auto 1.5rem',
            letterSpacing: '-0.03em'
          }}
        >
          Master your money with clarity,{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            precision
          </span>
          , and peace of mind.
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '650px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6
          }}
        >
          Track cash, e-wallets, and bank accounts effortlessly. Set category budgets with proactive alerts, and gain instant visual insights into where every peso goes.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <button
            onClick={onGetStarted}
            className="btn btn-primary btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          >
            <span>Create Your Account</span>
            <ArrowRight size={18} />
          </button>
          <button
            onClick={onGuestLogin}
            className="btn btn-secondary btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          >
            <span>Continue as Guest</span>
          </button>
        </div>

        {/* Feature Highlights Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="var(--primary)" />
            <span>Cash & E-Wallet separation</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="var(--primary)" />
            <span>Overspending warnings (80%+)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="var(--primary)" />
            <span>Automatic offline sync & backup</span>
          </div>
        </div>
      </section>

      {/* Core Feature Showcase Grid */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 2rem 6rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Engineered for Total Financial Control</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Everything you need to plan, track, and optimize your personal finances.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Card 1 */}
          <div className="glass-card glass-card-interactive">
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <Smartphone size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Cash & E-Wallet Tracking
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Monitor physical cash, GCash, Maya, and bank balances independently or consolidated in one crystal-clear dashboard.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card glass-card-interactive">
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <BellRing size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Smart Budget Alerts
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Set category limits with customizable warning thresholds (e.g. 80%) to stop overspending before it happens.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card glass-card-interactive">
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <PieChart size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Dynamic Charts & Analytics
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Interactive donuts, income vs. expense comparisons, and spending velocity timelines provide effortless clarity.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}
      >
        <p>© 2026 Moni: Personal Budget and Expense Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
