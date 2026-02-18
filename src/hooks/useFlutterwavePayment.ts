// src/hooks/useFlutterwavePayment.ts
import { useState } from 'react';
import { chargeCard, submitPIN, submitOTP } from '../lib/flutterwave/services';

export function useFlutterwavePayment() {
    const [step, setStep] = useState<'card' | 'pin' | 'otp' | 'redirect' | 'success'>('card');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [flwRef, setFlwRef] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [transactionId, setTransactionId] = useState('');

    const handleCardSubmit = async (cardDetails: {
        cardNumber: string;
        cvv: string;
        expiryMonth: string;
        expiryYear: string;
        email: string;
        amount: number;
    }) => {
        setLoading(true);
        setError('');

        try {
            const result = await chargeCard({
                ...cardDetails,
                currency: 'NGN',
                fullname: 'Test User'
            });

            setFlwRef(result.flwRef);
            setAccessToken(result.accessToken);
            setTransactionId(result.chargeData.data.id);

            if (result.authModel === 'PIN') {
                setStep('pin');
            } else if (result.authModel === 'OTP') {
                setStep('otp');
            } else if (result.redirectUrl) {
                setStep('redirect');
                window.location.href = result.redirectUrl;
            } else if (result.success) {
                setStep('success');
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
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
                setError(result.message);
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
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
                setError(result.message);
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        step,
        loading,
        error,
        transactionId,
        handleCardSubmit,
        handlePINSubmit,
        handleOTPSubmit,
    };
}