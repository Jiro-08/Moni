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
    <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)', color: 'var(--text-primary)', position: 'relative', overflowX: 'hidden' }}>
      {/* Background ambient lighting */}
      <div className="ambient-glow ambient-glow-1" />
      <div className="ambient-glow ambient-glow-2" />

      {/* Navigation Bar */}
      <nav
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1.25rem clamp(1rem, 4vw, 2rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10,
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)',
              flexShrink: 0
            }}
          >
            <Wallet size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Moni<span style={{ color: 'var(--primary)' }}>.</span>
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button onClick={onLogin} className="btn btn-ghost btn-sm" style={{ fontWeight: 600 }}>
            Sign In
          </button>
          <button onClick={onGetStarted} className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-full)' }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(2.5rem, 6vw, 4rem) 1.25rem clamp(3rem, 6vw, 5rem)',
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
            fontSize: '0.825rem',
            fontWeight: 700,
            marginBottom: '1.5rem'
          }}
        >
          <Sparkles size={16} />
          <span>Personal Budget & Expense Intelligence</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            maxWidth: '850px',
            margin: '0 auto 1.5rem'
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
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
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
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 'min(100%, 200px)' }}
          >
            <span>Create Account</span>
            <ArrowRight size={18} />
          </button>
          <button
            onClick={onGuestLogin}
            className="btn btn-secondary btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 'min(100%, 200px)' }}
          >
            <span>Continue as Guest</span>
          </button>
        </div>

        {/* Feature Highlights Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem 2rem', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={17} color="var(--primary)" />
            <span>Cash & E-Wallet separation</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={17} color="var(--primary)" />
            <span>Overspending warnings (80%+)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={17} color="var(--primary)" />
            <span>Automatic offline sync & backup</span>
          </div>
        </div>
      </section>

      {/* Core Feature Showcase Grid */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 1.25rem 5rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800 }}>Engineered for Total Financial Control</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Everything you need to plan, track, and optimize your personal finances.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
          {/* Card 1 */}
          <div className="glass-card glass-card-interactive">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <Smartphone size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Cash & E-Wallet Tracking
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Monitor physical cash, GCash, Maya, and bank balances independently or consolidated in one crystal-clear dashboard.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card glass-card-interactive">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <BellRing size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Smart Budget Alerts
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Set category limits with customizable warning thresholds (e.g. 80%) to stop overspending before it happens.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card glass-card-interactive">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <TrendingUp size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Visual Cashflow Reports
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Understand your net cashflow, monthly trends, and expense breakdown with interactive high-precision charts.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '2rem 1.25rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.825rem'
        }}
      >
        <p>© 2026 Moni: Personal Budget and Expense Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
