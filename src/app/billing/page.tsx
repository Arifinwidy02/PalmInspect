'use client';

import { useState } from 'react';
import { useProjectStore, useAuthStore } from '@/store';
import { usePayment } from '@/hooks';
import { Button, Modal, Input } from '@/components/shared';
import { formatCurrency } from '@/utils';

const PRICING_OPTIONS = [
  { id: 'single', label: 'Single Result', price: 5000, credits: 1, description: 'Unlock one detection result' },
  { id: 'pack5', label: '5-Pack', price: 20000, credits: 5, description: 'Save 20% per result', popular: true },
  { id: 'pack20', label: '20-Pack', price: 60000, credits: 20, description: 'Save 40% per result', popular: false },
];

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showQRIS, setShowQRIS] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleBuy = (planId: string) => {
    if (!isAuthenticated) {
      useAuthStore.getState().openAuthModal('login', 'purchase credits');
      return;
    }
    setSelectedPlan(planId);
    setShowQRIS(true);
  };

  const handleConfirmPayment = async () => {
    await new Promise((r) => setTimeout(r, 1500));
    setPaymentConfirmed(true);
    setShowQRIS(false);
  };

  const selectedOption = PRICING_OPTIONS.find((p) => p.id === selectedPlan);

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full overflow-y-auto">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-foreground">Purchase Credits</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Pay-per-result pricing. Unlock precise coordinates and export options.
        </p>
        {user && (
          <p className="text-sm text-emerald-400 mt-2">
            Current balance: <span className="font-bold">{user.credits} credits</span>
          </p>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRICING_OPTIONS.map((plan) => (
          <div
            key={plan.id}
            className={`
              relative bg-card border rounded-xl p-6 flex flex-col
              transition-all duration-200
              ${plan.popular
                ? 'border-emerald-500/50 ring-1 ring-emerald-500/20'
                : 'border-border hover:border-muted-foreground/40'
              }
            `}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-emerald-950 text-xs font-semibold px-3 py-1 rounded-full">
                Best Value
              </span>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">{plan.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
            </div>

            <div className="mb-4">
              <span className="text-3xl font-bold text-foreground">
                {formatCurrency(plan.price)}
              </span>
              <span className="text-sm text-muted-foreground ml-1">
                / {plan.credits} credit{plan.credits > 1 ? 's' : ''}
              </span>
            </div>

            <div className="mt-auto">
              <Button
                variant={plan.popular ? 'primary' : 'secondary'}
                size="md"
                className="w-full"
                onClick={() => handleBuy(plan.id)}
              >
                Buy {plan.label}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* How it Works */}
      <div className="mt-12 bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Upload', desc: 'Drop your drone image and draw your Area of Interest' },
            { step: '2', title: 'Detect', desc: 'AI counts palm trees and shows results on the map' },
            { step: '3', title: 'Unlock', desc: 'Pay per result to get precise coordinates and export data' },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 font-semibold text-sm">{item.step}</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QRIS Payment Modal */}
      <Modal isOpen={showQRIS} onClose={() => setShowQRIS(false)} title="Complete Payment" size="sm">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Scan the QR code below using your preferred e-wallet
          </p>
          <div className="bg-white p-6 rounded-xl mb-4 inline-block">
            <div className="w-48 h-48 bg-zinc-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-zinc-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2m0 0H8m4 0h2m-2 0v-1m0-10h.01M12 12h.01M16 12h.01M8 12h.01M4 12h.01M20 12h.01M4 16h.01M20 16h.01M4 8h.01M20 8h.01" />
                </svg>
                <p className="text-xs text-zinc-500 mt-2">QRIS Mockup</p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3 mb-4">
            <p className="text-xs text-muted-foreground">Amount</p>
            <p className="text-xl font-bold text-foreground">
              {selectedOption ? formatCurrency(selectedOption.price) : '—'}
            </p>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            This is a simulated payment. In production, Midtrans Snap would handle the real payment flow.
          </p>

          <div className="flex gap-3">
            <Button variant="ghost" size="md" className="flex-1" onClick={() => setShowQRIS(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" className="flex-1" onClick={handleConfirmPayment}>
              Simulate Payment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={paymentConfirmed} onClose={() => setPaymentConfirmed(false)} title="Payment Successful">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-foreground font-medium">
            {selectedOption?.credits} credit{selectedOption && selectedOption.credits > 1 ? 's' : ''} added!
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Your results are now unlocked for export.
          </p>
          <Button
            variant="primary"
            size="md"
            className="mt-4 w-full"
            onClick={() => setPaymentConfirmed(false)}
          >
            Continue
          </Button>
        </div>
      </Modal>
    </div>
  );
}
