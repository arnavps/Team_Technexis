"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/services/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { GlassCard } from '@/components/glass-card';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    const router = useRouter();

    useEffect(() => {
        // Initialize reCAPTCHA verifier on component mount
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: () => {
                    // reCAPTCHA solved
                },
                'expired-callback': () => {
                    // Response expired. Ask user to solve reCAPTCHA again.
                    setError('reCAPTCHA expired. Please try again.');
                }
            });
        }
    }, []);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (phone.length < 10) {
            setError('Please enter a valid 10-digit phone number.');
            setLoading(false);
            return;
        }

        try {
            const formattedPhone = `+91${phone}`;
            const appVerifier = window.recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmationResult(confirmation);
            setStep('OTP');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to send OTP.');
            // Reset reCAPTCHA if it fails
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.render().then((widgetId: any) => {
                    grecaptcha.reset(widgetId);
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!confirmationResult) {
            setError('Session expired. Please request a new OTP.');
            setStep('PHONE');
            setLoading(false);
            return;
        }

        try {
            const result = await confirmationResult.confirm(otp);
            if (result.user) {
                // Redirect to onboarding or dashboard
                router.push('/onboarding');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Invalid OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <GlassCard className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-mint mb-2">KrishiAI</h1>
                    <p className="text-gray-300">Empowering Market Strategists</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* reCAPTCHA container */}
                <div id="recaptcha-container"></div>

                {step === 'PHONE' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-200">Phone Number</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-glass-border bg-glass-bg text-gray-300">
                                    +91
                                </span>
                                <input
                                    type="tel"
                                    placeholder="Enter 10-digit number"
                                    className="flex-1 block w-full rounded-none rounded-r-md border border-glass-border bg-glass-bg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-mint"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-mint text-forest font-bold py-3 px-4 rounded-md transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Get OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-200">Enter OTP</label>
                            <input
                                type="text"
                                placeholder="6-digit code"
                                className="block w-full rounded-md border border-glass-border bg-glass-bg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-mint text-center tracking-widest text-xl"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-mint text-forest font-bold py-3 px-4 rounded-md transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setStep('PHONE');
                                setOtp('');
                                setError('');
                            }}
                            className="w-full text-sm text-gray-300 hover:text-white mt-2"
                        >
                            Change phone number
                        </button>
                    </form>
                )}
            </GlassCard>
        </div>
    );
}
