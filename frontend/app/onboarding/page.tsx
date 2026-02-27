"use client";

import { useState } from 'react';
import { GlassCard } from '@/components/glass-card';
import { useGPS } from '@/hooks/useGPS';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { auth } from '@/services/firebase';
import { fuzzLocation } from '@/utils/physics';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);

    // Step 1: Consent
    const [consentGranted, setConsentGranted] = useState(false);

    // Step 3: Bio Profile
    const [name, setName] = useState('');
    const [crop, setCrop] = useState('');
    const [landSize, setLandSize] = useState('');

    // Step 4: Calibration
    const [yieldQuintals, setYieldQuintals] = useState('');
    const [plantingDate, setPlantingDate] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const { location, error: gpsError, loading: gpsLoading, requestLocation } = useGPS();
    const router = useRouter();

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!consentGranted || !location || !name || !crop || !landSize || !yieldQuintals || !plantingDate) {
            alert('Please fill all required fields across all steps.');
            return;
        }

        setIsSaving(true);

        try {
            const phone = auth.currentUser?.phoneNumber || localStorage.getItem('demo_phone') || "9999999999";

            // DPDP Act 2023: Fuzz GPS before storing in permanent DB
            const fuzzed = fuzzLocation(location.latitude, location.longitude);

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    phone: phone,
                    name: name,
                    crop: crop,
                    land_size_acres: parseFloat(landSize),
                    latitude: fuzzed.latitude,
                    longitude: fuzzed.longitude,
                    yield_quintals: parseFloat(yieldQuintals),
                    planting_date: plantingDate
                });

            if (error) throw error;
            router.push('/dashboard');

        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const nextStep = () => setStep((s) => Math.min(s + 1, 4));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 relative bg-forest text-white selection:bg-mint selection:text-forest">

            {/* Background Layers */}
            <div className="absolute inset-0 z-0">
                <img src="/bg-img.jpg" alt="Background" className="w-full h-full object-cover opacity-30 pointer-events-none" />
                <div className="absolute inset-0 bg-forest/80 backdrop-blur-sm pointer-events-none"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Progress Indicators */}
                <div className="flex justify-between items-center mb-8 px-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= i ? 'bg-mint text-forest shadow-[0_0_15px_rgba(32,255,189,0.5)]' : 'bg-glass-bg border border-glass-border text-gray-400'}`}>
                                {i}
                            </div>
                            {i < 4 && (
                                <div className={`h-1 w-12 mx-2 rounded-full transition-all duration-300 ${step > i ? 'bg-mint/50' : 'bg-glass-border'}`}></div>
                            )}
                        </div>
                    ))}
                </div>

                <GlassCard className="p-8">
                    {/* STEP 1: LEGAL GROUNDING */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-mint mb-2">Legal Grounding</h2>
                                <p className="text-sm text-gray-300">Data Protection Framework</p>
                            </div>

                            <div className="bg-glass-bg border border-glass-border rounded-xl p-5 space-y-4">
                                <p className="text-sm text-gray-200 leading-relaxed">
                                    To provide hyper-accurate market recommendations, MittiMitra requires access to your <strong>GPS Location</strong> and <strong>Crop Data</strong>.
                                </p>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    In compliance with the <strong>DPDP Act 2023</strong>, your data undergoes <em>Coordinate Fuzzing</em> to protect your exact farm location while maintaining analytical accuracy.
                                </p>
                            </div>

                            <div className="flex space-x-4 justify-center py-2">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </div>
                                    <span className="text-xs text-gray-300">Privacy</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-mint/10 border border-mint/30 flex items-center justify-center text-mint mb-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <span className="text-xs text-gray-300">Profit</span>
                                </div>
                            </div>

                            <label className="flex items-start space-x-3 cursor-pointer group mt-4">
                                <div className="relative flex items-center justify-center mt-1">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={consentGranted}
                                        onChange={(e) => setConsentGranted(e.target.checked)}
                                    />
                                    <div className={`w-5 h-5 rounded border ${consentGranted ? 'bg-mint border-mint' : 'border-gray-500 group-hover:border-mint'} flex items-center justify-center transition-colors`}>
                                        {consentGranted && <svg className="w-3 h-3 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                </div>
                                <span className="text-sm text-gray-300 select-none">I provide explicit consent to process my agricultural constraints & location data.</span>
                            </label>

                            <button
                                onClick={nextStep}
                                disabled={!consentGranted}
                                className="w-full bg-mint text-forest font-bold py-3 px-4 rounded-md transition-all hover:shadow-[0_0_15px_rgba(32,255,189,0.3)] disabled:opacity-50 disabled:hover:shadow-none"
                            >
                                Accept & Continue
                            </button>
                        </div>
                    )}

                    {/* STEP 2: SPATIAL INTELLIGENCE */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-mint mb-2">Spatial Intelligence</h2>
                                <p className="text-sm text-gray-300">Establishing Ground Truth</p>
                            </div>

                            <div className="bg-glass-bg border border-glass-border rounded-xl p-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Locate the Farm</h3>
                                <p className="text-sm text-gray-400 mb-6">We need your coordinates to map to the nearest IMD Weather Grid for hyper-local decay forecasting.</p>

                                {location ? (
                                    <div className="bg-mint/10 border border-mint/30 rounded-lg p-4 text-mint flex flex-col items-center">
                                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span className="font-medium">Coordinates Locked</span>
                                        <span className="text-xs opacity-70 mt-1">Privacy Layer: Active</span>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={requestLocation}
                                        disabled={gpsLoading}
                                        className="w-full relative overflow-hidden group bg-transparent border border-mint/50 hover:border-mint text-mint font-medium py-3 px-4 rounded-md transition-all disabled:opacity-50"
                                    >
                                        <div className="absolute inset-0 bg-mint/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                                        <span className="relative flex justify-center items-center">
                                            {gpsLoading ? (
                                                <><span className="w-4 h-4 rounded-full border-2 border-mint border-t-transparent animate-spin mr-2"></span> Locating...</>
                                            ) : (
                                                <>Init GPS Handshake</>
                                            )}
                                        </span>
                                    </button>
                                )}
                                {gpsError && <p className="text-red-400 text-xs mt-3 bg-red-500/10 p-2 rounded">{gpsError}</p>}
                            </div>

                            <div className="flex space-x-3">
                                <button onClick={prevStep} className="w-1/3 bg-glass-bg border border-glass-border text-gray-300 font-medium py-3 px-4 rounded-md hover:bg-white/5 transition-colors">
                                    Back
                                </button>
                                <button
                                    onClick={nextStep}
                                    disabled={!location}
                                    className="w-2/3 bg-mint text-forest font-bold py-3 px-4 rounded-md transition-all hover:shadow-[0_0_15px_rgba(32,255,189,0.3)] disabled:opacity-50 disabled:hover:shadow-none"
                                >
                                    Next Phase
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: BIOLOGICAL PROFILING */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-mint mb-2">Biological Profiling</h2>
                                <p className="text-sm text-gray-300">Engine Setup & Decay Multipliers</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1">Farmer Identity</label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="block w-full rounded-md border border-glass-border bg-black/40 p-3 text-white placeholder-gray-500 focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint transition-all"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1">Target Crop</label>
                                    <select
                                        className="block w-full rounded-md border border-glass-border bg-black/40 p-3 text-white focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint transition-all appearance-none"
                                        value={crop}
                                        onChange={(e) => setCrop(e.target.value)}
                                    >
                                        <option value="" className="text-gray-900 bg-white">Select defining crop...</option>
                                        <option value="tomato" className="text-gray-900 bg-white">Tomato (High Q10 Decay)</option>
                                        <option value="onion" className="text-gray-900 bg-white">Onion (Med Perishability)</option>
                                        <option value="potato" className="text-gray-900 bg-white">Potato (Low Perishability)</option>
                                        <option value="soybean" className="text-gray-900 bg-white">Soybean (Stable Cash Crop)</option>
                                        <option value="wheat" className="text-gray-900 bg-white">Wheat (Hard Grain)</option>
                                        <option value="cotton" className="text-gray-900 bg-white">Cotton (Fiber)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1">Scale of Ops (Acres)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 5.0"
                                        step="0.1"
                                        className="block w-full rounded-md border border-glass-border bg-black/40 p-3 text-white placeholder-gray-500 focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint transition-all"
                                        value={landSize}
                                        onChange={(e) => setLandSize(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button onClick={prevStep} className="w-1/3 bg-glass-bg border border-glass-border text-gray-300 font-medium py-3 px-4 rounded-md hover:bg-white/5 transition-colors">
                                    Back
                                </button>
                                <button
                                    onClick={nextStep}
                                    disabled={!name || !crop || !landSize}
                                    className="w-2/3 bg-mint text-forest font-bold py-3 px-4 rounded-md transition-all hover:shadow-[0_0_15px_rgba(32,255,189,0.3)] disabled:opacity-50 disabled:hover:shadow-none"
                                >
                                    Proceed
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: FINAL CALIBRATION */}
                    {step === 4 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-mint mb-2">Final Calibration</h2>
                                <p className="text-sm text-gray-300">Readying the Arbitrage Scan</p>
                            </div>

                            <form onSubmit={handleSaveProfile} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1">Expected Yield (Quintals)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5" /></svg>
                                        </div>
                                        <input
                                            type="number"
                                            placeholder="e.g. 150"
                                            className="block w-full rounded-md border border-glass-border bg-black/40 pl-10 p-3 text-white placeholder-gray-500 focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint transition-all"
                                            value={yieldQuintals}
                                            onChange={(e) => setYieldQuintals(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Crucial for transport cost per unit calculations.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1">Planting Date</label>
                                    <input
                                        type="date"
                                        className="block w-full rounded-md border border-glass-border bg-black/40 p-3 text-white focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint transition-all"
                                        value={plantingDate}
                                        onChange={(e) => setPlantingDate(e.target.value)}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Estimates current maturity and perishability stage.</p>
                                </div>

                                <div className="bg-mint/5 border border-mint/20 rounded-lg p-4 mt-6">
                                    <p className="text-xs text-mint text-center tracking-wide uppercase font-semibold">
                                        System ready for Arbitrage Mapping
                                    </p>
                                </div>

                                <div className="flex space-x-3 pt-2">
                                    <button type="button" onClick={prevStep} disabled={isSaving} className="w-1/3 bg-glass-bg border border-glass-border text-gray-300 font-medium py-3 px-4 rounded-md hover:bg-white/5 transition-colors disabled:opacity-50">
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!yieldQuintals || !plantingDate || isSaving}
                                        className="w-2/3 relative overflow-hidden group bg-mint text-forest font-bold py-3 px-4 rounded-md transition-all hover:shadow-[0_0_20px_rgba(32,255,189,0.4)] disabled:opacity-50 disabled:hover:shadow-none"
                                    >
                                        <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                                        <span className="relative flex justify-center items-center">
                                            {isSaving ? (
                                                <><span className="w-5 h-5 rounded-full border-2 border-forest border-t-transparent animate-spin mr-2"></span> Initiating...</>
                                            ) : (
                                                <>Launch Analysis 🚀</>
                                            )}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </GlassCard>
            </div>

            <div className="absolute bottom-4 text-center w-full z-10">
                <p className="text-xs text-gray-500">Secured by MittiMitra Arbitrage Engine v2.0</p>
            </div>
        </div>
    );
}
