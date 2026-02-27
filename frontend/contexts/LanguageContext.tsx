"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { en } from "../translations/en";
import { hi } from "../translations/hi";
import { mr } from "../translations/mr";
import { te } from "../translations/te";
import { ta } from "../translations/ta";
import { gu } from "../translations/gu";
import { pa } from "../translations/pa";

type Language = "en" | "hi" | "mr" | "te" | "ta" | "gu" | "pa";
type Translations = typeof en;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof Translations) => string;
    n: (value: number | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries = {
    en,
    hi,
    mr,
    te,
    ta,
    gu,
    pa
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en");

    // Load language from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem("language") as Language;
        if (savedLang && dictionaries[savedLang]) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);
    };

    const t = (key: keyof Translations): string => {
        return dictionaries[language][key] || dictionaries.en[key] || key;
    };

    const n = (value: number | string): string => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) return String(value);

        const locales: Record<Language, string> = {
            en: 'en-IN',
            hi: 'hi-IN',
            mr: 'mr-IN',
            te: 'te-IN',
            ta: 'ta-IN',
            gu: 'gu-IN',
            pa: 'pa-IN'
        };

        const numberingSystems: Record<Language, string> = {
            en: 'latn',
            hi: 'deva',
            mr: 'deva',
            te: 'telu',
            ta: 'tamldec',
            gu: 'gujr',
            pa: 'guru'
        };

        try {
            return new Intl.NumberFormat(locales[language], {
                useGrouping: false, // Prevents commas, making it a pure digit replacement if needed
                maximumFractionDigits: 2,
                numberingSystem: numberingSystems[language]
            }).format(num);
        } catch (e) {
            return String(value); // Fallback
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, n }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
