// src/hooks/useFlutterwavePayment.ts
import { useState } from 'react';
import { chargeCard, submitPIN, submitOTP } from '../lib/flutterwave/services';

type PaymentStep = 'idle' | 'processing' | 'pin' | 'otp' | 'redirect' | 'success' | 'error';

interface CardDetails {
    cardNumber: string;
    cvv: string;
    expiryMonth: string;
    expiryYear: string;
    email: string;
    amount: number;
    fullname: string;
}

export function useFlutterwavePayment() {
    const [step, setStep] = useState<PaymentStep>('idle');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [flwRef, setFlwRef] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [transactionId, setTransactionId] = useState('');

    const resetPayment = () => {
        setStep('idle');
        setError('');
        setFlwRef('');
        setAccessToken('');
        setTransactionId('');
    };

    const handleCardSubmit = async (cardDetails: CardDetails) => {
        setLoading(true);
        setError('');
        setStep('processing');

        try {
            const result = await chargeCard({
                ...cardDetails,
                currency: 'USD',
            });

            setFlwRef(result.flwRef);
            setAccessToken(result.accessToken);
            setTransactionId(result.chargeData.data.id);

            // Handle different authentication models
            if (result.authModel === 'PIN') {
                setStep('pin');
            } else if (result.authModel === 'OTP') {
                setStep('otp');
            } else if (result.redirectUrl) {
                setStep('redirect');
                // 3D Secure redirect
                window.location.href = result.redirectUrl;
            } else if (result.success) {
                setStep('success');
            } else {
                setError('Payment failed. Please try again.');
                setStep('error');
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Payment failed. Please try again.';
            setError(errorMessage);
            setStep('error');
        } finally {
            setLoading(false);
        }
    };

    const handlePINSubmit = async (pin: string) => {
        setLoading(true);
        setError('');

        try {
            const result = await submitPIN(flwRef, pin, accessToken);
            
            if (result.status === 'success') {
                setStep('success');
            } else {
                setError(result.message || 'PIN validation failed');
                setStep('error');
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'PIN validation failed';
            setError(errorMessage);
            setStep('error');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSubmit = async (otp: string) => {
        setLoading(true);
        setError('');

        try {
            const result = await submitOTP(flwRef, otp, accessToken);
            
            if (result.status === 'success') {
                setStep('success');
            } else {
                setError(result.message || 'OTP validation failed');
                setStep('error');
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'OTP validation failed';
            setError(errorMessage);
            setStep('error');
        } finally {
            setLoading(false);
        }
    };

    return {
        step,
        loading,
        error,
        transactionId,
        flwRef,
        handleCardSubmit,
        handlePINSubmit,
        handleOTPSubmit,
        resetPayment,
    };
}