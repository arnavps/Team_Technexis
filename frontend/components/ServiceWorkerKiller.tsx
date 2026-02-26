"use client";

import { useEffect } from "react";

export function ServiceWorkerKiller() {
    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                for (const registration of registrations) {
                    registration.unregister().then(boolean => {
                        console.log("Unregistered stale service worker:", boolean);
                    });
                }
            });
        }
    }, []);

    return null;
}
