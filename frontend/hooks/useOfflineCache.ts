import { useEffect, useState } from 'react';

export function useOfflineCache(key: string, initialData: any = null) {
    const [isOnline, setIsOnline] = useState(true);
    const [cachedData, setCachedData] = useState<any>(initialData);
    const [syncQueue, setSyncQueue] = useState<any[]>([]);

    useEffect(() => {
        // Initial check
        setIsOnline(navigator.onLine);

        // Load from local storage
        const localData = localStorage.getItem(key);
        if (localData) {
            try {
                setCachedData(JSON.parse(localData));
            } catch (e) {
                console.error("Failed to parse cached data", e);
            }
        }

        const localQueue = localStorage.getItem('krishi_sync_queue');
        if (localQueue) {
            try {
                setSyncQueue(JSON.parse(localQueue));
            } catch (e) { }
        }

        const handleOnline = () => {
            setIsOnline(true);
            processSyncQueue();
        };

        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [key]);

    const saveToCache = (data: any) => {
        setCachedData(data);
        localStorage.setItem(key, JSON.stringify(data));
    };

    const addToSyncQueue = (action: any) => {
        const newQueue = [...syncQueue, { ...action, timestamp: Date.now() }];
        setSyncQueue(newQueue);
        localStorage.setItem('krishi_sync_queue', JSON.stringify(newQueue));
    };

    const processSyncQueue = async () => {
        const queue = JSON.parse(localStorage.getItem('krishi_sync_queue') || '[]');
        if (queue.length === 0) return;

        console.log("Processing background sync queue:", queue);
        // In a real app, send these to the backend API here.
        // For demo: just clear the queue on success

        localStorage.removeItem('krishi_sync_queue');
        setSyncQueue([]);
    };

    return { isOnline, cachedData, saveToCache, addToSyncQueue, syncQueueLength: syncQueue.length };
}
