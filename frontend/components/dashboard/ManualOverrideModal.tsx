'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ManualOverrideModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentValue: number;
    metricLabel: string;
    unit: string;
    onSave: (newValue: number) => void;
}

export function ManualOverrideModal({
    isOpen,
    onClose,
    currentValue,
    metricLabel,
    unit,
    onSave
}: ManualOverrideModalProps) {
    const { language } = useLanguage();
    const [newValue, setNewValue] = useState(currentValue);

    if (!isOpen) return null;

    const t = {
        en: {
            title: `Update ${metricLabel}`,
            desc: "The app uses sensors and satellite data, but you know your field best. Adjust the value based on what you see on the ground.",
            labels: {
                current: "Current System Reading",
                yourUpdate: "Your Ground Observation",
                save: "Calibrate AI",
                cancel: "Cancel"
            }
        },
        hi: {
            title: `${metricLabel} अपडेट करें`,
            desc: "ऐप सेंसर और सैटेलाइट डेटा का उपयोग करता है, लेकिन आप अपने खेत को सबसे बेहतर जानते हैं। जमीन पर जो आप देखते हैं उसके आधार पर मान को समायोजित करें।",
            labels: {
                current: "वर्तमान सिस्टम रीडिंग",
                yourUpdate: "आपका जमीनी अवलोकन",
                save: "AI को कैलिब्रेट करें",
                cancel: "रद्द करें"
            }
        },
        mr: {
            title: `${metricLabel} अपडेट करा`,
            desc: "अॅप सेन्सर्स आणि सॅटेलाइट डेटा वापरते, परंतु तुम्हाला तुमचे शेत सर्वात चांगले माहित आहे. जमिनीवर तुम्ही जे पाहता त्यानुसार मूल्य समायोजित करा.",
            labels: {
                current: "सध्याचे सिस्टम रीडिंग",
                yourUpdate: "तुमचे निरीक्षण",
                save: "AI कॅलिब्रेट करा",
                cancel: "रद्द करा"
            }
        }
    };

    const currentT = t[language as 'en' | 'hi' | 'mr'] || t.en;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-forest/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <header className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{currentT.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{currentT.desc}</p>
                </header>

                <div className="space-y-6 mb-8">
                    {/* Current Display */}
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">{currentT.labels.current}</span>
                        <span className="text-white font-mono">{currentValue}{unit}</span>
                    </div>

                    {/* Slider / Input */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-mint uppercase tracking-widest font-bold">{currentT.labels.yourUpdate}</span>
                            <span className="text-2xl font-black text-mint">{newValue}{unit}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={metricLabel.toLowerCase().includes('temp') ? "60" : "100"}
                            value={newValue}
                            onChange={(e) => setNewValue(parseInt(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-mint"
                        />
                        <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                            <span>MIN</span>
                            <span>MAX</span>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-gray-400 font-bold rounded-2xl hover:bg-white/10 transition-all"
                    >
                        {currentT.labels.cancel}
                    </button>
                    <button
                        onClick={() => onSave(newValue)}
                        className="flex-1 px-6 py-3 bg-mint text-forest font-bold rounded-2xl hover:bg-white transition-all shadow-[0_0_20px_rgba(32,255,189,0.2)]"
                    >
                        {currentT.labels.save}
                    </button>
                </div>
            </div>
        </div>
    );
}
