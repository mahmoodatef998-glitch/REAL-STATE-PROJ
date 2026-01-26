"use client";
import { api } from './axios-client';

/**
 * Get or create a unique guest ID for the current browser session
 */
export const getGuestId = () => {
    if (typeof window === 'undefined') return null;

    let guestId = localStorage.getItem('alrabei_guest_id');
    if (!guestId) {
        if (typeof window.crypto !== 'undefined' && typeof window.crypto.randomUUID === 'function') {
            guestId = window.crypto.randomUUID();
        } else {
            guestId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        }
        localStorage.setItem('alrabei_guest_id', guestId);
    }
    return guestId;
};

/**
 * Track a user activity
 */
export const trackActivity = async (propertyId, actionType) => {
    try {
        const guestId = getGuestId();
        if (!guestId || !propertyId) return;

        await api.post('/activities/track', {
            guestId,
            propertyId,
            actionType
        });
    } catch (error) {
        console.error('Tracking failed:', error);
    }
};
