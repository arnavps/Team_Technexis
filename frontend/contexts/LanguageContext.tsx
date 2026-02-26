"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { en } from "../translations/en";
import { hi } from "../translations/hi";
import { mr } from "../translations/mr";

type Language = "en" | "hi" | "mr";
type Translations = typeof en;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries = {
    en,
    hi,
    mr
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

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
