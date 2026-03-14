import React, { useState } from 'react';
import {
  ShieldCheck, Flag, Navigation, ThumbsUp, ThumbsDown,
  MessageSquare, Share2, MapPin, Truck, Droplets,
  HeartPulse, School, Building2, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '../lib/supabase';
import { cn, isLowBandwidth } from '../lib/utils';

interface PostCardProps {
  post: Post;
  onSelect?: () => void;
  onVote?: (type: 'confirm' | 'dispute') => void;
  onFlag?: (type: string) => void;
  onComment?: (text: string) => void;
}

const CATEGORY_META: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  roads: { icon: <Truck size={12} />, label: 'Roads', color: 'text-amber-600 bg-amber-50' },
  water: { icon: <Droplets size={12} />, label: 'Water', color: 'text-blue-600 bg-blue-50' },
  health: { icon: <HeartPulse size={12} />, label: 'Health', color: 'text-red-500 bg-red-50' },
  schools: { icon: <School size={12} />, label: 'Schools', color: 'text-emerald-600 bg-emerald-50' },
  infrastructure: { icon: <Building2 size={12} />, label: 'Infrastructure', color: 'text-purple-600 bg-purple-50' },
};

const VERIFICATION_BADGES = (post: Post) => {
  const badges: { label: string; color: string; icon: React.ReactNode }[] = [];
  if (post.status === 'verified')
    badges.push({ label: 'Admin Verified', color: 'bg-kenya-green/10 text-kenya-green border-kenya-green/20', icon: <ShieldCheck size={10} /> });
  if ((post.verifier_count_local ?? 0) >= 1)
    badges.push({ label: 'Locally Verified', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <MapPin size={10} /> });
  if ((post.verifier_count_media ?? 0) >= 1)
    badges.push({ label: 'Media Corroborated', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Camera size={10} /> });
  if ((post.effective_dispute ?? 0) > 3)
    badges.push({ label: 'Disputed', color: 'bg-red-50 text-red-600 border-red-200', icon: <Flag size={10} /> });
  return badges;
};

export const PostCard: React.FC<PostCardProps> = ({ post, onSelect, onVote, onFlag, onComment }) => {
  const [voted, setVoted] = React.useState<'confirm' | 'dispute' | null>(() => {
    const gv = JSON.parse(localStorage.getItem('guest_votes') || '{}');
    return gv[post.id] ? 'confirm' : null;
  });
  const [showComments, setShowComments] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [mediaLoaded, setMediaLoaded] = useState(!isLowBandwidth());

  const lowBandwidth = isLowBandwidth();
  const badges = VERIFICATION_BADGES(post);
  const catMeta = post.issue_category ? CATEGORY_META[post.issue_category] : null;

  const handleVoteClick = (type: 'confirm' | 'dispute') => {
    if (voted === type) setVoted(null);
    else { setVoted(type); onVote?.(type); }
  };

  return (
    <div className="bg-white card-radius border border-black/5 overflow-hidden group hover:border-black/10 transition-all duration-500">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 cursor-pointer min-w-0 flex-1" onClick={onSelect}>
          {/* Avatar — fluid scaled */}
          <div
            className="bg-black/5 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500 shrink-0"
            style={{ width: 'clamp(2.25rem, 8vw, 3rem)', height: 'clamp(2.25rem, 8vw, 3rem)' }}
          >
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.profiles?.username || 'anon'}`} alt="" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-display font-bold text-black truncate">
              {post.profiles?.username || (post.user_id ? `Citizen_${post.user_id.substring(0, 5)}` : 'Anonymous')}
            </h4>
            <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] text-black/30 font-black uppercase tracking-widest mt-0.5 flex-wrap">
              <span>{formatDistanceToNow(new Date(post.created_at))} ago</span>
              <span className="w-1 h-1 bg-black/10 rounded-full" />
              <span className="text-kenya-green">{post.profiles?.trust_score ?? 0} Trust</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {catMeta && (
            <span className={cn('hidden xs:flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider', catMeta.color)}>
              {catMeta.icon} {catMeta.label}
            </span>
          )}
          <button
            onClick={() => { setFlagged(!flagged); if (!flagged) onFlag?.('inappropriate'); }}
            className={cn('p-2 rounded-full transition-all duration-300 min-w-[2rem] min-h-[2rem] flex items-center justify-center',
              flagged ? 'bg-kenya-red/10 text-kenya-red' : 'text-black/10 hover:text-black/40 hover:bg-black/5')}
          >
            <Flag size={14} fill={flagged ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Category chip on mobile (below header, hidden on xs+) */}
      {catMeta && (
        <div className="xs:hidden px-4 pb-2">
          <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider', catMeta.color)}>
            {catMeta.icon} {catMeta.label}
          </span>
        </div>
      )}

      {/* Media — text-first on low bandwidth */}
      <div
        className="relative bg-stone-100 flex items-center justify-center overflow-hidden mx-3 sm:mx-4 card-radius-inner cursor-pointer group-hover:shadow-2xl transition-all duration-700"
        style={{ aspectRatio: '16/10' }}
        onClick={onSelect}
      >
        {!mediaLoaded ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-stone-50">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-300">
              {post.media_type === 'video' ? '▶' : '🖼'}
            </div>
            <button
              onClick={e => { e.stopPropagation(); setMediaLoaded(true); }}
              className="px-4 py-2 bg-kenya-black text-white text-[10px] font-black uppercase tracking-widest rounded-full"
            >
              Load Media
            </button>
            <span className="text-[9px] text-stone-400 font-medium">Low bandwidth mode</span>
          </div>
        ) : post.media_type === 'image' ? (
          <img src={post.media_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" referrerPolicy="no-referrer" />
        ) : (
          <video src={post.media_url} className="w-full h-full object-cover" />
        )}

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={cn(
            'px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-2xl border border-white/20',
            post.status === 'verified' ? 'bg-kenya-green/90 text-white' :
              post.status === 'under_review' ? 'bg-amber-500/90 text-white' :
                'bg-black/60 text-white'
          )}>
            {post.status.replace('_', ' ')}
          </span>
        </div>

        {/* Location overlay */}
        <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2 sm:p-3 flex items-center justify-between text-black shadow-2xl border border-white/30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-black rounded-lg sm:rounded-xl shrink-0 flex items-center justify-center text-white">
              <Navigation size={10} />
            </div>
            <div className="min-w-0">
              <p className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-kenya-red leading-none mb-0.5 truncate">{post.ward_id}</p>
              <p className="text-[9px] sm:text-[10px] font-display font-bold text-black leading-none truncate">{post.county_id}</p>
            </div>
          </div>
          <div className="text-right shrink-0 hidden xs:block">
            <p className="text-[7px] sm:text-[8px] font-mono font-bold text-black/30 leading-none mb-0.5">{post.gps_lat?.toFixed(4)}° N</p>
            <p className="text-[7px] sm:text-[8px] font-mono font-bold text-black/30 leading-none">{post.gps_long?.toFixed(4)}° E</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 sm:px-6 pt-4 pb-1">
        <p className="text-xs text-black/60 leading-relaxed font-medium">{post.description}</p>
      </div>

      {/* Linked Leaders */}
      {(post.governor || post.mp || post.mca_name) && (
        <div className="px-4 sm:px-6 pt-3 flex flex-wrap gap-1.5">
          {post.governor && (
            <div className="flex items-center gap-1 bg-blue-50/50 border border-blue-100 px-2 py-1 rounded-lg">
              <span className="text-[8px] font-black uppercase text-blue-400">Gov</span>
              <span className="text-[10px] font-bold text-blue-800 truncate max-w-[8rem]">{post.governor}</span>
            </div>
          )}
          {post.mp && (
            <div className="flex items-center gap-1 bg-purple-50/50 border border-purple-100 px-2 py-1 rounded-lg">
              <span className="text-[8px] font-black uppercase text-purple-400">MP</span>
              <span className="text-[10px] font-bold text-purple-800 truncate max-w-[8rem]">{post.mp}</span>
            </div>
          )}
          {post.mca_name && (
            <div className="flex items-center gap-1 bg-emerald-50/50 border border-emerald-100 px-2 py-1 rounded-lg">
              <span className="text-[8px] font-black uppercase text-emerald-400">MCA</span>
              <span className="text-[10px] font-bold text-emerald-800 truncate max-w-[8rem]">{post.mca_name}</span>
            </div>
          )}
        </div>
      )}

      {/* Verification Badges */}
      {badges.length > 0 && (
        <div className="px-4 sm:px-6 pt-3 flex flex-wrap gap-1.5">
          {badges.map(b => (
            <span key={b.label} className={cn('flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border', b.color)}>
              {b.icon} {b.label}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 sm:px-6 pt-3 pb-4 sm:pb-6 flex items-center justify-between border-t border-black/5 mt-3 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            onClick={() => handleVoteClick('confirm')}
            className={cn(
              'flex items-center gap-1 px-3 py-2 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all duration-300 min-h-[2.25rem]',
              voted === 'confirm' ? 'bg-kenya-green text-white' : 'bg-black/5 text-black/40 hover:bg-black/10'
            )}
          >
            <ThumbsUp size={10} />
            Confirm{post.confirm_count ? ` (${post.confirm_count})` : ''}
          </button>
          <button
            onClick={() => handleVoteClick('dispute')}
            className={cn(
              'flex items-center gap-1 px-3 py-2 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all duration-300 min-h-[2.25rem]',
              voted === 'dispute' ? 'bg-kenya-red text-white' : 'bg-black/5 text-black/40 hover:bg-black/10'
            )}
          >
            <ThumbsDown size={10} />
            Dispute{post.dispute_count ? ` (${post.dispute_count})` : ''}
          </button>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowComments(!showComments)}
            className={cn('w-9 h-9 flex items-center justify-center rounded-full transition-all',
              showComments ? 'bg-black text-white' : 'bg-black/5 text-black/30 hover:bg-black/10')}
          >
            <MessageSquare size={13} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-black/5 text-black/30 hover:bg-black/10 transition-all">
            <Share2 size={13} />
          </button>
        </div>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-4 sm:px-6 pb-4 sm:pb-6"
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add evidence or context..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && commentText) { onComment?.(commentText); setCommentText(''); } }}
                className="flex-1 bg-black/5 rounded-full px-4 py-2.5 text-[10px] font-medium focus:outline-none focus:bg-black/10 transition-all min-w-0"
              />
              <button
                onClick={() => { if (commentText) { onComment?.(commentText); setCommentText(''); } }}
                className="bg-kenya-black text-white p-2.5 rounded-full shrink-0"
              >
                <MessageSquare size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
