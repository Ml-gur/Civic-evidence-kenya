import React, { useState, useRef } from 'react';
import { 
  MessageSquare, Camera, Check, ShieldCheck, 
  ChevronRight, Reply, X, ImageIcon, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { Comment, Profile } from '../lib/supabase';
import { cn, uploadToCloudinary } from '../lib/utils';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUser: any;
  onAddComment: (text: string, mediaBlob?: Blob, parentId?: string) => Promise<void>;
  onExpandMedia?: (url: string, type: 'image' | 'video') => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ 
  postId, comments, currentUser, onAddComment, onExpandMedia
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setShowCamera(true);
    } catch (err) {
      alert('Camera access denied');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        setCapturedMedia(blob);
        stopCamera();
      }
    }, 'image/jpeg', 0.85);
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setShowCamera(false);
  };

  const handleSubmit = async () => {
    if (!newComment.trim() && !capturedMedia) return;
    setIsSubmitting(true);
    try {
      await onAddComment(newComment, capturedMedia ?? undefined, replyTo?.comment_id);
      setNewComment('');
      setReplyTo(null);
      setCapturedMedia(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const rootComments = comments.filter(c => !c.parent_comment_id);
  const getReplies = (parentId: string) => comments.filter(c => c.parent_comment_id === parentId);

  const CommentItem: React.FC<{ comment: Comment; isReply?: boolean }> = ({ comment, isReply = false }) => (
    <div className={cn("flex gap-3", isReply ? "ml-8 mt-3" : "mt-6")}>
      <div className="shrink-0">
        <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center border border-stone-200 overflow-hidden">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.profiles?.username || 'anon'}`} alt="" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black text-stone-900 uppercase tracking-tight">
              {comment.profiles?.username || 'Citizen'}
            </span>
            <span className="text-[8px] font-bold text-stone-400">
              {formatDistanceToNow(new Date(comment.created_at))} ago
            </span>
          </div>
          <p className="text-xs text-stone-600 font-medium leading-relaxed">{comment.text}</p>
          
          {comment.media_url && (
            <div 
              className="mt-2 rounded-xl overflow-hidden border border-stone-200 bg-black/5 cursor-zoom-in group relative"
              onClick={() => onExpandMedia?.(comment.media_url!, comment.media_type as any || 'image')}
            >
              {comment.media_type === 'video' ? (
                <video src={comment.media_url} controls className="w-full max-h-48 object-contain" />
              ) : (
                <img src={comment.media_url} alt="Comment media" className="w-full max-h-48 object-contain group-hover:scale-105 transition-transform duration-500" />
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 mt-1.5 ml-1">
          <button 
            onClick={() => setReplyTo(comment)}
            className="text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-emerald-600 flex items-center gap-1"
          >
            <Reply size={10} /> Reply
          </button>
        </div>

        {getReplies(comment.comment_id).map(reply => (
          <CommentItem key={reply.comment_id} comment={reply} isReply />
        ))}
      </div>
    </div>
  );

  return (
    <div className="pt-6 border-t border-stone-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 px-2 flex items-center gap-2">
          <MessageSquare size={14} className="text-emerald-500" />
          Verification Feed ({comments.length})
        </h3>
      </div>

      <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
        {rootComments.length > 0 ? (
          rootComments.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(c => (
            <CommentItem key={c.comment_id} comment={c} />
          ))
        ) : (
          <div className="text-center py-8 opacity-30">
            <MessageSquare size={32} className="mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest">No evidence threads yet</p>
          </div>
        )}
      </div>

      {/* Comment Input Area */}
      <div className="sticky bottom-0 bg-white pt-2">
        <AnimatePresence>
          {replyTo && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-t-2xl flex items-center justify-between mb-[-1px]"
            >
              <div className="flex items-center gap-2">
                <Reply size={12} className="text-emerald-600" />
                <span className="text-[10px] font-bold text-emerald-800">Replying to @{replyTo.profiles?.username}</span>
              </div>
              <button onClick={() => setReplyTo(null)} className="text-emerald-600 p-1">
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={cn(
          "bg-stone-50 border border-stone-200/60 p-2 shadow-inner",
          replyTo ? "rounded-b-2xl" : "rounded-2xl"
        )}>
          {capturedMedia && (
            <div className="relative w-20 h-20 mb-2 rounded-xl overflow-hidden border border-emerald-500 shadow-lg">
              <img src={URL.createObjectURL(capturedMedia)} className="w-full h-full object-cover" alt="Captured" />
              <button 
                onClick={() => setCapturedMedia(null)}
                className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full"
              >
                <X size={10} />
              </button>
            </div>
          )}

          {showCamera && (
            <div className="mb-2 rounded-xl overflow-hidden bg-black aspect-video relative">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-4">
                <button onClick={stopCamera} className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
                  <X size={20} />
                </button>
                <button onClick={capturePhoto} className="bg-white p-3 rounded-full text-emerald-600 shadow-xl scale-125">
                  <Camera size={24} />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-end gap-2 px-2 pb-1">
            <button 
              onClick={() => (showCamera ? stopCamera() : startCamera())}
              className={cn(
                "p-2 rounded-xl transition-colors",
                capturedMedia ? "text-emerald-600 bg-emerald-100" : "text-stone-400 hover:bg-stone-200"
              )}
            >
              <Camera size={20} />
            </button>
            
            <textarea
              placeholder={replyTo ? "Write a reply..." : "Add evidence or comment..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-transparent py-2.5 px-2 text-xs font-medium focus:outline-none resize-none min-h-[40px] max-h-32"
              rows={1}
            />

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (!newComment.trim() && !capturedMedia)}
              className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-600/20 disabled:opacity-30 active:scale-90 transition-all shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
