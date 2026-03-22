import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from '@mui/material';
import { subscriptionApi } from '../../services/payments.services';
import type { Subscription } from '../../types/types';

const BILLING_LABELS: Record<string, string> = {
  monthly: 'month',
  quarterly: '3 months',
  biannual: '6 months',
  yearly: 'year',
};

const Pricing: React.FC = () => {
  const { data: plansData, isLoading } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: () => subscriptionApi.getAll().then(r => r.data),
  });

  const plans: Subscription[] = Array.isArray(plansData)
    ? plansData
    : (plansData as { results?: Subscription[] })?.results ?? [];

  const plan = plans.find(p => p.status === 'active') || plans[0];

  const price = plan ? parseFloat(plan.price) : 99;
  const priceWhole = Math.floor(price);
  const priceCents = Math.round((price - priceWhole) * 100);
  const billingLabel = plan ? (BILLING_LABELS[plan.billing_cycle] || plan.billing_cycle) : '6 months';
  const currency = plan?.currency === 'USD' ? '$' : (plan?.currency || '$');

  const monthsMap: Record<string, number> = { monthly: 1, quarterly: 3, biannual: 6, yearly: 12 };
  const months = plan ? (monthsMap[plan.billing_cycle] || 6) : 6;
  const monthlyPrice = (price / months).toFixed(2);

  const features = plan?.features && typeof plan.features === 'object' && Array.isArray((plan.features as { list?: string[] }).list)
    ? (plan.features as { list: string[] }).list
    : [
        'Unlimited access to all courses',
        'Earn professional certificates',
        'Join live interactive sessions',
        'Download resources for offline learning',
        'Priority email support',
        'Access to community forums',
      ];

  if (isLoading) {
    return (
      <section id="pricing" style={{ paddingTop: '96px', paddingBottom: '96px', backgroundColor: 'white', textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#ffa424' }} />
      </section>
    );
  }

  return (
    <section
      id="pricing"
      style={{
        paddingTop: '96px',
        paddingBottom: '96px',
        backgroundColor: 'white',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            className="chip-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#fff3e0',
              color: '#ffa424',
              padding: '6px 12px',
              borderRadius: '20px',
              fontWeight: 600,
              marginBottom: '16px',
              fontSize: '0.875rem',
            }}
          >
            <i className="fas fa-tags" />
            Simple Pricing
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px', margin: '0 0 16px 0' }}>
            One Plan, Unlimited Access
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              color: '#52525b',
              marginBottom: '32px',
              margin: '0 0 32px 0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {plan?.description || 'Get full access to all courses, certifications, and live sessions with our simple subscription.'}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            className="pricing-card"
            style={{
              padding: '48px',
              position: 'relative',
              border: '2px solid #ffa424',
              borderRadius: '24px',
              backgroundColor: 'white',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
            }}
          >
            <div
              className="pricing-badge"
              style={{
                position: 'absolute',
                top: '-16px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #ffa424, #f97316)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: 600,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px rgba(249, 115, 22, 0.3)',
              }}
            >
              <i className="fas fa-star" />
              All-Access Pass
            </div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center', margin: '0 0 8px 0' }}>
              {plan?.name || 'Subscription Plan'}
            </h3>
            <p
              style={{
                fontSize: '1rem',
                color: '#71717a',
                marginBottom: '32px',
                textAlign: 'center',
                margin: '0 0 32px 0',
              }}
            >
              Everything you need to master new skills.
            </p>

            {/* Price */}
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div
                className="pricing-price"
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'center',
                  gap: '4px',
                  fontSize: 0,
                }}
              >
                <span className="pricing-price-currency" style={{ fontSize: '2rem', fontWeight: 600, color: '#27272a' }}>
                  {currency}
                </span>
                <span className="pricing-price-amount" style={{ fontSize: '4rem', fontWeight: 800, color: '#27272a' }}>
                  {priceCents > 0 ? `${priceWhole}.${String(priceCents).padStart(2, '0')}` : priceWhole}
                </span>
                <span className="pricing-price-period" style={{ fontSize: '1.25rem', color: '#71717a', marginLeft: '8px', fontWeight: 500 }}>
                  / {billingLabel}
                </span>
              </div>
            </div>
            
            <p style={{ textAlign: 'center', color: '#10b981', fontWeight: 600, fontSize: '0.875rem', marginBottom: '32px' }}>
              Just {currency}{monthlyPrice}/month
            </p>

            <hr style={{ border: 'none', borderTop: '1px solid #e4e4e7', marginBottom: '32px' }} />

            {/* Features */}
            <div style={{ marginBottom: '40px' }}>
              {features.map((feature) => (
                <div
                  key={feature}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '10px 0',
                    fontSize: '1rem',
                    color: '#27272a',
                  }}
                >
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    backgroundColor: '#ecfdf5', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-check" style={{ color: '#10b981', fontSize: '14px' }} />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <button
              onClick={() => window.location.href = '/register'}
              className="pricing-button"
              style={{
                width: '100%',
                padding: '16px 24px',
                backgroundColor: '#ffa424',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '1.125rem',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(255, 164, 36, 0.25)',
              }}
            >
              Get Full Access Now
            </button>
            
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#71717a', marginTop: '16px' }}>
              30-day money-back guarantee. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
