'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { GlassCard } from '@/components/glass-card';

export default function PrivacyPolicyPage() {
    const { language } = useLanguage();

    const content = {
        en: {
            title: "Privacy Policy (Plain Language)",
            intro: "We value your privacy. In compliance with the Digital Personal Data Protection (DPDP) Act 2023, this policy explains how we handle your data.",
            dataTitle: "What We Collect & Why",
            dataItems: [
                { title: "GPS Location", desc: "We use this to find Mandis near you. We 'fuzz' (slightly shift) your coordinates before storage to protect your specific farm location." },
                { title: "Phone Number", desc: "Used only to verify your identity and keep your account secure." },
                { title: "Crop Data", desc: "Used to calculate your specific profit and spoilage risks." }
            ],
            rightsTitle: "Your Rights",
            rightsDesc: "Under DPDP 2023, you have the right to access, correct, or erase your data at any time. To erase your data, contact our support or use the 'Purge Data' feature in settings."
        },
        hi: {
            title: "गोपनीयता नीति (हिंदी)",
            intro: "हम आपकी गोपनीयता का सम्मान करते हैं। डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम 2023 के अनुपालन में, यह नीति बताती है कि हम आपके डेटा को कैसे संभालते हैं।",
            dataTitle: "हम क्या एकत्र करते हैं और क्यों",
            dataItems: [
                { title: "GPS स्थान", desc: "हम इसका उपयोग आपके पास की मंडियों को खोजने के लिए करते हैं। आपके विशिष्ट खेत के स्थान की सुरक्षा के लिए हम भंडारण से पहले आपके निर्देशांकों को थोड़ा बदल देते हैं।" },
                { title: "फ़ोन नंबर", desc: "इसका उपयोग केवल आपकी पहचान सत्यापित करने और आपके खाते को सुरक्षित रखने के लिए किया जाता है।" },
                { title: "फसल डेटा", desc: "इसका उपयोग आपके विशिष्ट लाभ और खराब होने के जोखिमों की गणना करने के लिए किया जाता है।" }
            ],
            rightsTitle: "आपके अधिकार",
            rightsDesc: "DPDP 2023 के तहत, आपको किसी भी समय अपने डेटा तक पहुँचने, उसे सुधारने या मिटाने का अधिकार है। अपना डेटा मिटाने के लिए, हमारे समर्थन से संपर्क करें या सेटिंग्स में 'डेटा साफ़ करें' सुविधा का उपयोग करें।"
        }
    };

    const t = content[language as 'en' | 'hi'] || content.en;

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-24">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
                <p className="text-gray-400">{t.intro}</p>
            </header>

            <GlassCard>
                <h2 className="text-xl font-bold text-mint mb-4">{t.dataTitle}</h2>
                <div className="space-y-6">
                    {t.dataItems.map((item, idx) => (
                        <div key={idx} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                            <h3 className="text-white font-bold mb-1">{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </GlassCard>

            <GlassCard>
                <h2 className="text-xl font-bold text-mint mb-4">{t.rightsTitle}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{t.rightsDesc}</p>
            </GlassCard>

            <div className="text-center text-[10px] text-gray-600 uppercase tracking-widest">
                Last Updated: Feb 2026 • MittiMitra Compliance Team
            </div>
        </div>
    );
}
