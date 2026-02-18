// src/lib/flutterwave/service.ts
import axios from 'axios';
import { encryptAES, generateNonce } from './encryption';

interface CardDetails {
    cardNumber: string;
    cvv: string;
    expiryMonth: string;
    expiryYear: string;
    amount: number;
    email: string;
    currency?: string;
    fullname?: string;
}

interface ChargeResponse {
    status: string;
    message: string;
    data: {
        id: string;
        tx_ref: string;
        flw_ref: string;
        amount: number;
        currency: string;
        charged_amount: number;
        auth_model: string; // 'PIN' | 'NOAUTH' | 'AVS_NOAUTH' | 'OTP'
        payment_type: string;
        redirect_url?: string;
        meta?: {
            authorization?: {
                mode: string;
                redirect?: string;
            };
        };
    };
}

export async function chargeCard(cardDetails: CardDetails) {
    try {
        // Step 1: Get access token
        const tokenResponse = await axios.post(
            'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token',
            new URLSearchParams({
                client_id: import.meta.env.VITE_FLW_CLIENT_ID,
                client_secret: import.meta.env.VITE_FLW_CLIENT_SECRET,
                grant_type: 'client_credentials'
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );
        const accessToken = tokenResponse.data.access_token;

        // Step 2: Create card token
        const cardTokenResponse = await axios.post(
            'https://developersandbox-api.flutterwave.com/tokens/card',
            {
                card_number: cardDetails.cardNumber,
                cvv: cardDetails.cvv,
                expiry_month: cardDetails.expiryMonth,
                expiry_year: cardDetails.expiryYear,
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Trace-Id': `TRACE-${Date.now()}`
                }
            }
        );
        const cardToken = cardTokenResponse.data.token;

        // Step 3: Get encryption key
        const encryptionKeyResponse = await axios.get(
            'https://developersandbox-api.flutterwave.com/encryption-keys',
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Trace-Id': `TRACE-${Date.now()}`
                }
            }
        );
        const encryptionKey = encryptionKeyResponse.data.key;

        // Step 4: Encrypt card data
        const nonce = generateNonce();
        const cardData = JSON.stringify({
            card_token: cardToken,
            cvv: cardDetails.cvv,
        });
        const encryptedCard = await encryptAES(cardData, encryptionKey, nonce);

        // Step 5: Charge the card
        const chargeResponse = await axios.post(
            'https://developersandbox-api.flutterwave.com/v3/charges?type=card',
            {
                tx_ref: `TXN-${Date.now()}`,
                amount: cardDetails.amount,
                currency: cardDetails.currency || 'USD',
                email: cardDetails.email,
                fullname: cardDetails.fullname || 'Customer Name',
                encrypted_card: encryptedCard,
                nonce: nonce,
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Trace-Id': `TRACE-${Date.now()}`,
                }
            }
        );

        const chargeData: ChargeResponse = chargeResponse.data;

        // Step 6: Handle authentication based on auth_model
        return {
            success: chargeData.status === 'success',
            requiresAuth: chargeData.data.auth_model !== 'NOAUTH',
            authModel: chargeData.data.auth_model,
            flwRef: chargeData.data.flw_ref,
            redirectUrl: chargeData.data.meta?.authorization?.redirect,
            chargeData: chargeData,
            accessToken: accessToken, // Save for validation later
        };

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('API Error:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Payment failed');
        }
        console.error('Payment error:', error);
        throw error;
    }
}

// Step 7: Submit PIN (if auth_model is 'PIN')
export async function submitPIN(flwRef: string, pin: string, accessToken: string) {
    try {
        const response = await axios.post(
            'https://developersandbox-api.flutterwave.com/v3/validate-charge',
            {
                otp: pin,
                flw_ref: flwRef,
                type: 'card'
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Trace-Id': `TRACE-${Date.now()}`
                }
            }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'PIN validation failed');
        }
        throw error;
    }
}

// Step 8: Submit OTP (if auth_model is 'OTP')
export async function submitOTP(flwRef: string, otp: string, accessToken: string) {
    try {
        const response = await axios.post(
            'https://developersandbox-api.flutterwave.com/v3/validate-charge',
            {
                otp: otp,
                flw_ref: flwRef,
                type: 'card'
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Trace-Id': `TRACE-${Date.now()}`
                }
            }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'OTP validation failed');
        }
        throw error;
    }
}

// Step 9: Verify transaction status
export async function verifyTransaction(transactionId: string, accessToken: string) {
    try {
        const response = await axios.get(
            `https://developersandbox-api.flutterwave.com/v3/transactions/${transactionId}/verify`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Trace-Id': `TRACE-${Date.now()}`
                }
            }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Verification failed');
        }
        throw error;
    }
}

// TO be used in the payment form component to handle the entire flow. this only
// charging the card

