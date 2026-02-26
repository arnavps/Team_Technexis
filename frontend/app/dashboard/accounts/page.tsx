'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/glass-card';
import { supabase } from '@/utils/supabase/client';
import { auth } from '@/services/firebase';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AccountsPage() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        phone: '',
        crop: '',
        land_size_acres: '',
    });

    // Simulate user fetch for demo/prototype purposes
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // In production, get phone from auth.currentUser.phoneNumber
                const phone = auth.currentUser?.phoneNumber || "9999999999";
                setProfile(prev => ({ ...prev, phone }));

                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('phone', phone)
                    .single();

                if (data && !error) {
                    setProfile({
                        name: data.name || '',
                        phone: data.phone || '',
                        crop: data.crop || '',
                        land_size_acres: data.land_size_acres ? String(data.land_size_acres) : '',
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    phone: profile.phone,
                    name: profile.name,
                    crop: profile.crop,
                    land_size_acres: parseFloat(profile.land_size_acres) || 0
                });

            if (error) throw error;
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
            <header className="relative z-50 flex flex-col mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Account & Farm Profile</h1>
                <p className="text-sm text-gray-400">Manage your connected farm data</p>
            </header>

            <GlassCard className="max-w-2xl">
                <form onSubmit={handleSave} className="space-y-6 p-2">
                    <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-white/10">
                        <div className="w-16 h-16 rounded-full bg-mint/10 border border-mint/30 flex items-center justify-center overflow-hidden">
                            <span className="text-2xl text-mint font-bold">{profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{profile.name || 'User'}</h2>
                            <span className="text-sm font-mono text-gray-400">{profile.phone}</span>
                            <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                Verified
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 block uppercase tracking-wider text-[11px]">Full Name</label>
                            <input
                                type="text"
                                className="block w-full rounded-lg border border-white/10 bg-black/20 p-3 text-white focus:outline-none focus:ring-1 focus:ring-mint transition-colors"
                                value={profile.name}
                                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 block uppercase tracking-wider text-[11px]">Phone Number</label>
                            <input
                                type="text"
                                disabled
                                className="block w-full rounded-lg border border-white/5 bg-black/40 p-3 text-gray-500 cursor-not-allowed"
                                value={profile.phone}
                            />
                            <p className="text-[10px] text-gray-500 mt-1">Phone number cannot be changed.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 block uppercase tracking-wider text-[11px]">Primary Crop</label>
                            <select
                                className="block w-full rounded-lg border border-white/10 bg-black/20 p-3 text-white focus:outline-none focus:ring-1 focus:ring-mint transition-colors custom-select"
                                value={profile.crop}
                                onChange={(e) => setProfile(prev => ({ ...prev, crop: e.target.value }))}
                            >
                                <option value="" className="text-gray-900">Select...</option>
                                <option value="tomato" className="text-gray-900">Tomato</option>
                                <option value="onion" className="text-gray-900">Onion</option>
                                <option value="potato" className="text-gray-900">Potato</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 block uppercase tracking-wider text-[11px]">Land Size (Acres)</label>
                            <input
                                type="number"
                                step="0.1"
                                className="block w-full rounded-lg border border-white/10 bg-black/20 p-3 text-white focus:outline-none focus:ring-1 focus:ring-mint transition-colors"
                                value={profile.land_size_acres}
                                onChange={(e) => setProfile(prev => ({ ...prev, land_size_acres: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/10 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-mint text-forest font-bold py-2.5 px-6 rounded-lg transition-all hover:bg-white hover:shadow-[0_0_15px_rgba(32,255,189,0.3)] disabled:opacity-50"
                        >
                            {saving ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
}
