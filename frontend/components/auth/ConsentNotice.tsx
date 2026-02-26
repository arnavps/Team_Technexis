'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export function ConsentNotice() {
    const { t, language } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasConsented = localStorage.getItem('user_consent_dpdp');
        if (!hasConsented) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('user_consent_dpdp', 'accepted');
        localStorage.setItem('consent_timestamp', new Date().toISOString());
        setIsVisible(false);
    };

    const handleDecline = () => {
        // According to user request: "If declined, the user cannot proceed to the dashboard."
        alert(language === 'en'
            ? "Consent is required to use KrishiAI services. The app will now close/redirect."
            : language === 'hi'
                ? "KrishiAI सेवाओं का उपयोग करने के लिए सहमति आवश्यक है।"
                : "KrishiAI सेवा वापरण्यासाठी संमती आवश्यक आहे.");
        window.location.href = '/'; // Redirect to landing
    };

    if (!isVisible) return null;

    const consentItems = {
        en: [
            { label: "GPS Location", desc: "To find the nearest Mandis and provide local weather alerts." },
            { label: "Phone Number", desc: "For secure authentication and account recovery." },
            { label: "Crop Selection", desc: "To provide personalized harvest and profit strategy." }
        ],
        hi: [
            { label: "GPS स्थान", desc: "नजदीकी मंडियों को खोजने और स्थानीय मौसम अलर्ट प्रदान करने के लिए।" },
            { label: "फ़ोन नंबर", desc: "सुरक्षित प्रमाणीकरण और खाता रिकवरी के लिए।" },
            { label: "फसल चयन", desc: "व्यक्तिगत फसल और लाभ रणनीति प्रदान करने के लिए।" }
        ],
        mr: [
            { label: "GPS स्थान", desc: "जवळपासच्या मंड्या शोधण्यासाठी आणि स्थानिक हवामान अलर्ट देण्यासाठी." },
            { label: "फोन नंबर", desc: "सुरक्षित प्रमाणीकरण आणि खाते रिकव्हरीसाठी." },
            { label: "पीक निवड", desc: "वैयक्तिक कापणी आणि नफा धोरण देण्यासाठी." }
        ]
    };

    const currentItems = consentItems[language as keyof typeof consentItems] || consentItems.en;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="w-full max-w-lg bg-forest/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <header className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {language === 'mr' ? "डेटा संमती आणि गोपनीयता" :
                            language === 'hi' ? "डेटा सहमति और गोपनीयता" :
                                "Data Consent & Privacy"}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {language === 'mr' ? "DPDP कायदा २०२३ नुसार, आम्हाला तुमची संमती आवश्यक आहे." :
                            language === 'hi' ? "DPDP अधिनियम 2023 के अनुसार, हमें आपकी सहमति की आवश्यकता है।" :
                                "In compliance with DPDP Act 2023, we require your informed consent to process your data."}
                    </p>
                </header>

                <div className="space-y-4 mb-8">
                    {currentItems.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="w-6 h-6 rounded-full bg-mint/20 flex items-center justify-center text-mint mt-0.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm tracking-wide">{item.label}</p>
                                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleAccept}
                        className="flex-1 px-6 py-3 bg-mint text-forest font-bold rounded-2xl hover:bg-white transition-all shadow-[0_0_20px_rgba(32,255,189,0.2)]"
                    >
                        {language === 'mr' ? "संमत आहे" : language === 'hi' ? "स्वीकार करें" : "I Accept"}
                    </button>
                    <button
                        onClick={handleDecline}
                        className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-gray-400 font-bold rounded-2xl hover:bg-red-500/20 hover:text-red-400 transition-all"
                    >
                        {language === 'mr' ? "नाकारले" : language === 'hi' ? "अस्वीकार" : "Decline"}
                    </button>
                </div>

                <p className="mt-6 text-[10px] text-gray-500 text-center uppercase tracking-widest leading-loose">
                    {language === 'mr' ? "तुम्ही आमचे गोपनीयता धोरण कधीही वाचू शकता" :
                        language === 'hi' ? "आप हमारी गोपनीयता नीति कभी भी पढ़ सकते हैं" :
                            "You can read our privacy policy at any time"}
                </p>
            </div>
        </div>
    );
}
