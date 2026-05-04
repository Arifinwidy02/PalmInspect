'use client';

import { useState, useCallback } from 'react';
import { useProjectStore, useAuthStore } from '@/store';
import { createTransaction, verifyPayment } from '@/services/midtrans';

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const markProjectAsPaid = useProjectStore((s) => s.markProjectAsPaid);
  const user = useAuthStore((s) => s.user);

  const initiatePayment = useCallback(
    async (projectId: string) => {
      setIsProcessing(true);
      setError(null);

      try {
        const result = await createTransaction(projectId);
        setPaymentUrl(result.redirectUrl);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Payment initiation failed');
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  const confirmPayment = useCallback(
    async (projectId: string, orderId: string) => {
      setIsProcessing(true);
      setError(null);

      try {
        const verified = await verifyPayment(orderId);
        if (verified) {
          markProjectAsPaid(projectId);
          setPaymentUrl(null);
        }
        return verified;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Payment verification failed');
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [markProjectAsPaid]
  );

  return {
    isProcessing,
    paymentUrl,
    error,
    user,
    initiatePayment,
    confirmPayment,
    setPaymentUrl,
    setError,
  };
}
