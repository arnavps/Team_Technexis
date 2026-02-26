"use client";

import { useState } from 'react';
import { GlassCard } from '@/components/glass-card';
import { useGPS } from '@/hooks/useGPS';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { auth } from '@/services/firebase';

export default function OnboardingPage() {
    const [name, setName] = useState('');
    const [crop, setCrop] = useState('');
    const [landSize, setLandSize] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const { location, error: gpsError, loading: gpsLoading, requestLocation } = useGPS();
    const router = useRouter();

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !crop || !landSize || !location) {
            alert('Please fill all fields and grant GPS access.');
            return;
        }

        setIsSaving(true);

        try {
            // Get user phone from Firebase, fallback to demo string
            const phone = auth.currentUser?.phoneNumber || "9999999999";

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    phone: phone,
                    name: name,
                    crop: crop,
                    land_size_acres: parseFloat(landSize),
                    latitude: location.latitude,
                    longitude: location.longitude
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

    return (
        <div className="flex min-h-screen flex-col p-4 space-y-4 max-w-md mx-auto">
            <div className="pt-8 pb-4">
                <h1 className="text-3xl font-bold text-mint mb-2">Welcome!</h1>
                <p className="text-gray-300">Let's set up your profile.</p>
            </div>

            <GlassCard>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-200">Full Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Ramesh Patel"
                            className="block w-full rounded-md border border-glass-border bg-glass-bg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-mint"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-200">Main Crop</label>
                        <select
                            className="block w-full rounded-md border border-glass-border bg-glass-bg p-3 text-white focus:outline-none focus:ring-1 focus:ring-mint"
                            value={crop}
                            onChange={(e) => setCrop(e.target.value)}
                        >
                            <option value="" className="text-gray-900">Select a crop...</option>
                            <option value="tomato" className="text-gray-900">Tomato (High Perishability)</option>
                            <option value="onion" className="text-gray-900">Onion (Medium Perishability)</option>
                            <option value="potato" className="text-gray-900">Potato (Low Perishability)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-200">Land Size (Acres)</label>
                        <input
                            type="number"
                            placeholder="e.g. 2.5"
                            step="0.1"
                            className="block w-full rounded-md border border-glass-border bg-glass-bg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-mint"
                            value={landSize}
                            onChange={(e) => setLandSize(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-200">Farm Location</label>
                        {location ? (
                            <div className="bg-mint/10 border border-mint/20 rounded-md p-3 text-mint text-sm flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Location captured
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={requestLocation}
                                disabled={gpsLoading}
                                className="w-full flex justify-center items-center rounded-md border border-glass-border bg-glass-bg p-3 text-mint hover:bg-glass-border transition-colors disabled:opacity-50"
                            >
                                {gpsLoading ? 'Locating...' : 'Grant GPS Access'}
                            </button>
                        )}
                        {gpsError && <p className="text-red-400 text-xs mt-1">{gpsError}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full bg-mint text-forest font-bold py-3 px-4 rounded-md transition-opacity hover:opacity-90 mt-8 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Complete Setup'}
                    </button>
                </form>
            </GlassCard>
        </div>
    );
}
