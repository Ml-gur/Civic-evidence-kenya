import React, { useState, useRef } from 'react';
import {
    X, ThumbsUp, ThumbsDown, MapPin, Camera,
    CheckCircle2, AlertTriangle, ShieldAlert, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Issue } from '../lib/supabase';
import { haversineKm } from '../lib/utils';
import { cn } from '../lib/utils';

interface VerificationModalProps {
    post: Issue;
    type: 'confirm' | 'dispute';
    userLocation: { lat: number; lng: number } | null;
    onSubmit: (payload: VerificationPayload) => Promise<void>;
    onClose: () => void;
}

export interface VerificationPayload {
    voteType: 'confirm' | 'dispute';
    verifierMethod: 'proximity' | 'media_corroborating' | 'dispute';
    disputeReason?: string;
    counterMediaBlob?: Blob;
}

const DISPUTE_REASONS = [
    'Incorrect location',
    'Outdated – issue already resolved',
    'Fabricated or edited media',
    'Out of scope for this platform',
    'Duplicate report',
    'Personal privacy violation',
];

const MAX_CONFIRM_KM = 2.0;

export const VerificationModal: React.FC<VerificationModalProps> = ({
    post, type, userLocation, onSubmit, onClose
}) => {
    const [disputeReason, setDisputeReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [localLocation, setLocalLocation] = useState<{ lat: number; lng: number } | null>(userLocation);

    const activeLocation = localLocation || userLocation;

    const distanceKm = activeLocation
        ? haversineKm(activeLocation.lat, activeLocation.lng, post.gps_lat, post.gps_lng)
        : null;

    const isNearby = distanceKm !== null && distanceKm <= MAX_CONFIRM_KM;

    const requestLocation = () => {
        setError(null);
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocalLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            (err) => {
                setError(`Could not get location: ${err.message}. Please enable location permissions.`);
            },
            { enableHighAccuracy: true }
        );
    };

    const canSubmitConfirm = isNearby;
    const canSubmitDispute = disputeReason.trim().length > 0;

    const handleSubmit = async () => {
        setError(null);
        if (type === 'confirm' && !canSubmitConfirm) {
            setError(distanceKm === null 
              ? "Location access is required to verify this report." 
              : `You must be within ${MAX_CONFIRM_KM}km to verify (currently ${distanceKm.toFixed(1)}km away).`);
            return;
        }
        if (type === 'dispute' && !canSubmitDispute) {
            setError('Please select a reason for your dispute.');
            return;
        }
        setSubmitting(true);
        try {
            await onSubmit({
                voteType: type,
                verifierMethod: type === 'dispute' ? 'dispute' : 'proximity',
                disputeReason: type === 'dispute' ? disputeReason : undefined,
                user_lat: activeLocation?.lat,
                user_lng: activeLocation?.lng,
                distance_m: distanceKm ? distanceKm * 1000 : undefined
            } as any);
            onClose();
        } catch (err: any) {
            setError(err?.message || 'Submission failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className={cn(
                    'px-8 pt-8 pb-6 flex items-center justify-between',
                    type === 'confirm' ? 'bg-emerald-50' : 'bg-red-50'
                )}>
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            'w-12 h-12 rounded-2xl flex items-center justify-center',
                            type === 'confirm' ? 'bg-emerald-100' : 'bg-red-100'
                        )}>
                            {type === 'confirm'
                                ? <ThumbsUp size={22} className="text-emerald-600" />
                                : <ThumbsDown size={22} className="text-red-500" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-black tracking-tight">
                                {type === 'confirm' ? 'Confirm Report' : 'Dispute Report'}
                            </h2>
                            <p className="text-xs text-black/40 font-medium">
                                {type === 'confirm' ? 'Verify this issue exists' : 'Challenge this report'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-black/30 hover:text-black/60 transition-colors">
                        <X size={22} />
                    </button>
                </div>

                <div className="px-8 py-6 space-y-5">
                    {/* GPS Proximity status for CONFIRM */}
                    {type === 'confirm' && (
                        <div className={cn(
                            'rounded-2xl p-4 flex items-start gap-3 border',
                            isNearby
                                ? 'bg-emerald-50 border-emerald-100'
                                : distanceKm !== null
                                    ? 'bg-amber-50 border-amber-100'
                                    : 'bg-stone-50 border-stone-100'
                        )}>
                            <MapPin size={18} className={cn(
                                'mt-0.5 shrink-0',
                                isNearby ? 'text-emerald-500' : 'text-amber-500'
                            )} />
                            <div className="flex-1">
                                <p className="text-xs font-bold text-stone-800">
                                    {distanceKm === null
                                        ? 'Location not active'
                                        : isNearby
                                            ? `You are ${distanceKm.toFixed(1)} km from this location ✓`
                                            : `You are ${distanceKm.toFixed(1)} km away — too far to verify`}
                                </p>
                                {distanceKm === null ? (
                                    <button 
                                        onClick={requestLocation}
                                        className="mt-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 active:scale-95"
                                    >
                                        Enable GPS & Verify
                                    </button>
                                ) : !isNearby && (
                                    <p className="text-[10px] text-stone-500 mt-1 font-medium italic">
                                        Verification is only permitted within 2km of the incident.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* DISPUTE: reason selector */}
                    {type === 'dispute' && (
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Reason for dispute *</p>
                            <div className="space-y-2">
                                {DISPUTE_REASONS.map(reason => (
                                    <button
                                        key={reason}
                                        onClick={() => setDisputeReason(reason)}
                                        className={cn(
                                            'w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all border',
                                            disputeReason === reason
                                                ? 'bg-red-500 text-white border-red-500'
                                                : 'bg-stone-50 text-stone-600 border-stone-100 hover:border-red-200 hover:bg-red-50'
                                        )}
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2">
                            <AlertTriangle size={14} className="text-red-500 shrink-0" />
                            <p className="text-xs font-semibold text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || (type === 'confirm' ? !canSubmitConfirm : !canSubmitDispute)}
                        className={cn(
                            'w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.15em] transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-3',
                            type === 'confirm'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                : 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                        )}
                    >
                        {submitting ? (
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                <span>Submitting...</span>
                            </div>
                        ) : type === 'confirm' ? 'Confirm This Report' : 'Submit Dispute'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};
