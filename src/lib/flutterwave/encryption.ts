// from flutterwave documentation: https://developer.flutterwave.com/docs/encryption#encryption-algorithm

export async function encryptAES(data: string, token: string, nonce: string): Promise<string> {
    if (nonce.length !== 12) {
        throw new Error("Nonce must be exactly 12 characters long");
    }

    // commented out the require import, throwing type errors
    const cryptoSubtle = globalThis.crypto?.subtle //|| require("crypto").webcrypto?.subtle;
    if (!cryptoSubtle) {
        throw new Error("Crypto API is not available in this environment.");
    }

    const decodedKeyBytes = Uint8Array.from(atob(token), c => c.charCodeAt(0));

    const key = await cryptoSubtle.importKey(
        "raw",
        decodedKeyBytes,
        { name: "AES-GCM" },
        false,
        ["encrypt"]
    );
    const iv = new TextEncoder().encode(nonce);

    const encryptedData = await cryptoSubtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        new TextEncoder().encode(data)
    );

    return btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
}

// Helper to generate 12-character nonce
export function generateNonce(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nonce = '';
    for (let i = 0; i < 12; i++) {
        nonce += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return nonce;
}