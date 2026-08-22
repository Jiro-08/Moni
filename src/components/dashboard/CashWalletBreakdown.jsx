import React from 'react';
import { Banknote, Smartphone, Building, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatters';

export const CashWalletBreakdown = ({ onSelectSourceFilter }) => {
  const { summary } = useFinance();
  const { currency } = useTheme();

  const wallets = [
    {
      id: 'cash',
      name: 'Cash In Hand',
      subtitle: 'Physical bills & coins',
      icon: Banknote,
      color: '#06b6d4',
      bgGlow: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.25)',
      data: summary.cash
    },
    {
      id: 'ewallet',
      name: 'E-Wallet',
      subtitle: 'GCash / Maya / PayPal',
      icon: Smartphone,
      color: '#8b5cf6',
      bgGlow: 'rgba(139, 92, 246, 0.12)',
      border: 'rgba(139, 92, 246, 0.25)',
      data: summary.ewallet
    },
    {
      id: 'bank',
      name: 'Bank Accounts',
      subtitle: 'Debit / Savings / Payroll',
      icon: Building,
      color: '#3b82f6',
      bgGlow: 'rgba(59, 130, 246, 0.12)',
      border: 'rgba(59, 130, 246, 0.25)',
      data: summary.bank
    }
  ];

  return (
    <div className="glass-card" style={{ marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Payment Sources & Wallet Balances</h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Separate monitoring for Cash, E-Wallet, and Bank transactions
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {wallets.map((w) => {
          const Icon = w.icon;
          return (
            <div
              key={w.id}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-input)',
                border: `1px solid ${w.border}`,
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: w.bgGlow,
                      color: w.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{w.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{w.subtitle}</span>
                  </div>
                </div>

                {onSelectSourceFilter && (
                  <button
                    onClick={() => onSelectSourceFilter(w.id)}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', color: w.color }}
                  >
                    View ledger
                  </button>
                )}
              </div>

              {/* Net Balance */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Current Balance
                </span>
                <h4 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)' }}>
                  {formatCurrency(w.data.balance, currency)}
                </h4>
              </div>

              {/* Inflow vs Outflow */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '0.8rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--income)' }}>
                  <ArrowUpRight size={14} />
                  <span>+{formatCurrency(w.data.income, currency)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--expense)' }}>
                  <ArrowDownRight size={14} />
                  <span>-{formatCurrency(w.data.expenses, currency)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CashWalletBreakdown;
