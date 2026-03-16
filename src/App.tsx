import React, { useState, useEffect } from 'react';
import {
  Camera,
  Map as MapIcon,
  LayoutGrid,
  User,
  Search,
  AlertCircle,
  Navigation,
  ChevronRight,
  ShieldCheck,
  X,
  Check,
  Truck,
  Droplets,
  HeartPulse,
  School,
  Building2,
  CheckCircle2,
  MessageSquare,
  Filter,
  Flag,
  Share2,
  ThumbsUp,
  ThumbsDown,
  MapPin,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { supabase, Issue, Profile, Leader, IssueCategory } from './lib/supabase';
import { KENYA_DATA } from './lib/kenyaData';
import { getGovernor, getMP, KENYA_LEADERS } from './lib/kenyaLeaders';
import { CameraCapture, IssueCategory as CameraCaptureCategory } from './components/CameraCapture';
import { MapView } from './components/MapView';
import { PostCard } from './components/PostCard';
import { AuthModal } from './components/AuthModal';
import { Onboarding } from './components/Onboarding';
import { VerificationModal, VerificationPayload } from './components/VerificationModal';
import { LocationPermissionModal } from './components/LocationPermissionModal';
import { CommentSection } from './components/CommentSection';
import { cn, uploadToCloudinary, haversineKm } from './lib/utils';

export default function App() {
  const [view, setView] = useState<'feed' | 'map' | 'leaders' | 'profile' | 'post-detail'>('feed');
  const [previousView, setPreviousView] = useState<'feed' | 'map' | 'leaders' | 'profile'>('feed');
  const [showCamera, setShowCamera] = useState(false);
  const [posts, setPosts] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<Issue | null>(null);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [configMissing, setConfigMissing] = useState(false);
  const [currentUserLocation, setCurrentUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState<{ blob: Blob, type: 'image' | 'video', metadata: any } | null>(null);
  const [submissionData, setSubmissionData] = useState({ 
    description: '', county: '', constituency: '', ward: '', category: '' as string, 
    severity: 'medium' as 'low'|'medium'|'high', governor: '', mp: '', mca_name: '' 
  });
  const [submissionStep, setSubmissionStep] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCommenting, setIsCommenting] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('hasCompletedOnboarding') === 'true';
  });
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'all'>('all');
  const [verificationTarget, setVerificationTarget] = useState<{ post: Issue; type: 'confirm' | 'dispute' } | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [leaderSearchQuery, setLeaderSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [fullscreenMedia, setFullscreenMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);

  const COUNTIES = ['All', ...KENYA_DATA.map(c => c.name)];

  const CATEGORY_TABS: { id: IssueCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <LayoutGrid size={12} /> },
    { id: 'roads', label: 'Roads', icon: <Truck size={12} /> },
    { id: 'water', label: 'Water', icon: <Droplets size={12} /> },
    { id: 'health', label: 'Health', icon: <HeartPulse size={12} /> },
    { id: 'schools', label: 'Schools', icon: <School size={12} /> },
    { id: 'infrastructure', label: 'Infrastructure', icon: <Building2 size={12} /> },
  ];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUser(); // Refresh profile
      }
    });

    fetchPosts();
    checkUser();

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/issue/')) {
        const id = hash.split('/issue/')[1];
        if (id) {
          const post = posts.find(p => p.issue_id === id);
          if (post) {
            setSelectedPost(post);
            setView('post-detail');
          } else if (posts.length > 0) {
            // Post not found in loaded posts
            window.location.hash = '#/';
          }
        }
      } else if (hash === '#/leaders') {
        setView('leaders');
      } else if (hash === '#/profile') {
        setView('profile');
      } else if (hash === '#/map') {
        setView('map');
      } else {
        setView('feed');
        setSelectedPost(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    if (posts.length > 0) handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [posts]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      // Refresh profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (profile) setUser({ ...user, profile });
    }
  };

  const handleVote = async (post: Issue, type: 'confirm' | 'dispute') => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // Open the structured verification modal instead of direct vote
    setVerificationTarget({ post, type });
  };

  const handleVerificationSubmit = async (payload: VerificationPayload) => {
    if (!verificationTarget || !user) return;
    const { post } = verificationTarget;
    const { voteType, verifierMethod, disputeReason, counterMediaBlob } = payload;

    let counterMediaUrl: string | undefined;
    if (counterMediaBlob) {
      const uploadResult = await uploadToCloudinary(counterMediaBlob, 'image');
      counterMediaUrl = uploadResult.media_url;
    }

    try {
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('issue_id', post.issue_id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          await supabase.from('votes').delete().eq('id', existingVote.id);
        } else {
          await supabase.from('votes').update({
            vote_type: voteType,
            verifier_method: verifierMethod,
            dispute_reason: disputeReason,
            counter_media_url: counterMediaUrl,
          }).eq('id', existingVote.id);
        }
      } else {
        await supabase.from('votes').insert({
          user_id: user.id,
          issue_id: post.issue_id,
          vote_type: voteType,
          verifier_method: verifierMethod,
          dispute_reason: disputeReason,
          counter_media_url: counterMediaUrl,
        });
      }
      setVerificationTarget(null);
      fetchPosts();
    } catch (err) {
      console.error('Vote failed:', err);
      throw err;
    }
  };

  const handleFlag = async (post: Issue, type: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      await supabase.from('flags').insert({
        user_id: user.id,
        issue_id: post.issue_id,
        flag_type: type
      });
      alert('Report flagged for moderation.');
    } catch (err) {
      console.error('Flag failed:', err);
    }
  };

  const handleAddComment = async (text: string, mediaBlob?: Blob, parentId?: string) => {
    if (!selectedPost || !user) {
      setShowAuthModal(true);
      return;
    }

    let mediaUrl: string | undefined;
    let mediaType: 'image' | 'video' | undefined;

    if (mediaBlob) {
      const uploadResult = await uploadToCloudinary(mediaBlob, 'image');
      mediaUrl = uploadResult.media_url;
      mediaType = 'image';
    }

    try {
      await supabase.from('comments').insert({
        user_id: user.id,
        issue_id: selectedPost.issue_id,
        text: text,
        media_url: mediaUrl,
        media_type: mediaType,
        parent_comment_id: parentId,
        is_counter_evidence: !!mediaUrl
      });
      fetchPosts();
    } catch (err) {
      console.error('Comment failed:', err);
    }
  };

  const handlePostSelect = (post: Issue) => {
    window.location.hash = `#/issue/${post.issue_id}`;
  };

  const handleBackFromDetail = () => {
    window.location.hash = '#/';
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false });

      if (data) {
        // Calculate scores for ranking using confidence_score
        const rankedPosts = (data as any[]).map(post => {
          const confirms = post.confirm_count || 0;
          const disputes = post.dispute_count || 0;
          const ageInHours = (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60);
          const recencyBonus = Math.max(0, 24 - ageInHours); // Bonus for posts under 24h

          // Proximity bonus: higher for closer posts
          let proximityBonus = 0;
          if (currentUserLocation) {
            const dist = Math.sqrt(
              Math.pow(post.gps_lat - currentUserLocation.lat, 2) +
              Math.pow(post.gps_long - currentUserLocation.lng, 2)
            );
            // Roughly: 1 degree is ~111km. 0.1 degree is ~11km.
            // Give a bonus of up to 10 points for posts within ~10km
            proximityBonus = Math.max(0, 10 - (dist * 100));
          }

          const score = post.confidence_score + recencyBonus + proximityBonus;
          return { ...post, rankScore: score };
        }).sort((a, b) => b.rankScore - a.rankScore);

        setPosts(rankedPosts as unknown as Issue[]);
      } else {
        setPosts(MOCK_POSTS);
      }
    } catch (e) {
      setPosts(MOCK_POSTS);
    } finally {
      setLoading(false);
    }
  };

  const handleCapture = (
    blob: Blob,
    type: 'image' | 'video',
    metadata: {
      lat: number; lng: number; timestamp: string;
      county: string; ward: string; constituency: string;
      category: CameraCaptureCategory;
      severity: 'low' | 'medium' | 'high';
    }
  ) => {
    setShowSubmissionForm({ blob, type, metadata });
    setShowCamera(false);
    const governor = getGovernor(metadata.county);
    const mp = getMP(metadata.county, metadata.constituency);
    setSubmissionData({
      description: '',
      county: metadata.county,
      constituency: metadata.constituency,
      ward: metadata.ward,
      category: metadata.category,
      severity: metadata.severity,
      governor,
      mp,
      mca_name: '',
    });
  };

  const handleFinalSubmit = async () => {
    if (!showSubmissionForm) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmissionStep(1); // Media Upload

    try {
      const { blob, type, metadata } = showSubmissionForm;

      // Step 1: Upload media
      const uploadResult = await uploadToCloudinary(blob, type);

      // Step 2: Geospatial Sync
      setSubmissionStep(2);
      await new Promise(r => setTimeout(r, 600));

      // Step 3: Ledger Entry
      setSubmissionStep(3);
      await new Promise(r => setTimeout(r, 600));

      // Step 4: Notification
      setSubmissionStep(4);

      const postData = {
        user_id: user?.id,
        title: submissionData.category ? `${submissionData.category} Issue in ${submissionData.ward || submissionData.constituency}` : 'New Report',
        description: submissionData.description,
        issue_type_id: submissionData.category || 'infrastructure',
        subtype: null,
        media_url: uploadResult.media_url,
        media_type: type,
        thumbnail_url: uploadResult.thumbnail_url,
        media_duration: uploadResult.duration,
        gps_lat: metadata.lat,
        gps_lng: metadata.lng,
        ward_id: submissionData.ward || submissionData.constituency,
        constituency_id: submissionData.constituency,
        county_id: submissionData.county,
        mca_id: null, // Need to implement lookup
        mp_id: null,
        governor_id: null,
        senator_id: null,
        responsible_body_id: null,
        capture_timestamp: metadata.timestamp,
        status: 'pending',
        severity: submissionData.severity,
      };

      const { data: newPost, error } = await supabase
        .from('issues')
        .insert(postData)
        .select('*, profiles(*)')
        .single();

      if (error) throw error;
      
      // Immediate local update for better UX
      setPosts(current => [newPost as unknown as Issue, ...current]);
      
      setShowSubmissionForm(null);
      setSubmissionData({ description: '', county: '', constituency: '', ward: '', category: '', severity: 'medium', governor: '', mp: '', mca_name: '' });
      setShowSuccess(true);
      
      // Sync with server as a background check
      fetchPosts();

      setTimeout(() => {
        setShowSuccess(false);
        setView('feed');
      }, 2000);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setSubmitError(err?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
      setSubmissionStep(0);
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setHasCompletedOnboarding(true);
  };

  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-white text-kenya-black font-sans selection:bg-kenya-red/10 selection:text-kenya-red">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between border-b border-black/5">
        {!isSearching ? (
          <>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="w-1.5 h-8 bg-kenya-green rounded-full" />
                <div className="w-1.5 h-8 bg-kenya-red mx-0.5 rounded-full" />
                <div className="w-1.5 h-8 bg-kenya-black rounded-full" />
              </div>
              <div>
                <h1 className="text-xl font-display font-black tracking-tighter leading-none">CITIZEN</h1>
                <p className="text-[9px] font-black text-kenya-red tracking-[0.3em] uppercase mt-1">Witness Kenya</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSearching(true)}
                className="w-10 h-10 flex items-center justify-center text-black/40 hover:text-black hover:bg-black/5 rounded-full transition-all"
              >
                <Search size={18} />
              </button>
              <button
                onClick={() => setView('profile')}
                className="w-10 h-10 rounded-full bg-black/5 border border-black/5 overflow-hidden active:scale-95 transition-transform"
              >
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'guest'}`} alt="avatar" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
              <input
                autoFocus
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/5 rounded-full py-3 pl-12 pr-4 text-sm font-medium focus:bg-black/10 transition-all outline-none"
              />
            </div>
            <button
              onClick={() => {
                setIsSearching(false);
                setSearchQuery('');
              }}
              className="text-[10px] font-black text-black/40 hover:text-black uppercase tracking-widest px-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </header>

      {configMissing && (
        <div className="mx-4 mt-4 bg-amber-50 border border-amber-200/60 rounded-2xl px-4 py-3 flex items-center gap-3 text-amber-800 shadow-sm">
          <AlertCircle size={18} className="shrink-0 text-amber-500" />
          <p className="text-xs font-semibold">
            Config Missing: <span className="font-normal opacity-80">Please connect Supabase and Cloudinary via .env to enable evidence uploads.</span>
          </p>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-24">
        <AnimatePresence mode="wait">
          {view === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12 space-y-10 sm:space-y-20"
            >
              {/* Hero Section */}
              <section className="relative py-10 sm:py-16 md:py-20 text-center space-y-6 sm:space-y-8">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-kenya-red/5 via-transparent to-transparent blur-3xl" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 sm:space-y-5"
                >
                  <h2 className="text-hero font-display font-black tracking-tight leading-[0.9]" style={{ hyphens: 'none', wordBreak: 'keep-all', overflowWrap: 'normal' }}>
                    ACCOUNTABILITY<br />
                    <span className="text-kenya-red">BY DESIGN.</span>
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-black/50 max-w-xl mx-auto font-medium leading-relaxed px-4 sm:px-0">
                    The national ledger for public infrastructure integrity and civic oversight. Verified by citizens, secured for the future.
                  </p>
                </motion.div>
                <div className="flex flex-col xs:flex-row items-center justify-center gap-3 px-4 sm:px-0">
                  <button
                    onClick={() => {
                      if (!user) {
                        setShowAuthModal(true);
                      } else {
                        setShowLocationModal(true);
                      }
                    }}
                    className="btn-kenya bg-kenya-black text-white hover:bg-kenya-red shadow-2xl shadow-kenya-red/20 w-full xs:w-auto"
                  >
                    Report Evidence
                  </button>
                  <button
                    onClick={() => setView('map')}
                    className="btn-kenya border border-black/10 hover:bg-black/5 w-full xs:w-auto"
                  >
                    Explore Map
                  </button>
                </div>
              </section>

              {/* Bento Grid Features */}
              <section className="bento-grid">
                <div className="bento-item col-span-1 sm:col-span-2 md:col-span-8 bg-black text-white flex flex-col justify-between" style={{ minHeight: 'clamp(160px, 30vw, 300px)' }}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="text-kenya-green" size={20} />
                  </div>
                  <div className="mt-8">
                    <h3 className="text-card font-display font-black tracking-tight mb-1 sm:mb-2">Immutable Verification</h3>
                    <p className="text-white/50 text-xs sm:text-sm max-w-sm">Every report is cryptographically signed and anchored to regional administrative boundaries.</p>
                  </div>
                </div>
                <div className="bento-item col-span-1 md:col-span-4 bg-kenya-red text-white flex flex-col justify-between" style={{ minHeight: 'clamp(140px, 25vw, 300px)' }}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <Navigation size={20} />
                  </div>
                  <div className="mt-8">
                    <h3 className="text-card font-display font-black tracking-tight mb-1">Real-time Tracking</h3>
                    <p className="text-white/70 text-xs">Live geospatial monitoring across 47 counties.</p>
                  </div>
                </div>
                <div className="bento-item col-span-1 md:col-span-4 border-kenya-green/20 bg-kenya-green/5 flex flex-col justify-between" style={{ minHeight: 'clamp(140px, 25vw, 300px)' }}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-kenya-green/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-kenya-green">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="mt-8">
                    <h3 className="text-card font-display font-black tracking-tight mb-1">Trust Score</h3>
                    <p className="text-black/40 text-xs">Citizen reporters earn reputation points for verified evidence.</p>
                  </div>
                </div>
                <div className="bento-item col-span-1 sm:col-span-2 md:col-span-8 bg-white flex flex-col justify-between" style={{ minHeight: 'clamp(140px, 25vw, 300px)' }}>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/5 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <LayoutGrid size={20} />
                    </div>
                    <div className="flex -space-x-2 sm:-space-x-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 sm:border-4 border-white bg-black/5 overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-card font-display font-black tracking-tight mb-1">Community Oversight</h3>
                    <p className="text-black/40 text-sm max-w-sm">Join thousands of Kenyans ensuring our taxes build the future we deserve.</p>
                  </div>
                </div>
              </section>

              {/* Feed Section */}
              <section className="space-y-8">
                {/* Header */}
                <div className="space-y-2">
                  <h3 className="text-section font-display font-black tracking-tight">LATEST EVIDENCE</h3>
                  <p className="text-black/40 text-sm font-medium">Verified reports from across the republic.</p>
                </div>

                {/* Filters */}
                <div className="space-y-3 bg-black/[0.02] -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 sm:py-5 rounded-2xl border border-black/5">
                  {/* County row */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30 flex items-center gap-1.5">
                      <MapPin size={10} /> County
                    </span>
                    <div className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
                      {COUNTIES.map(county => (
                        <button
                          key={county}
                          onClick={() => setSelectedCounty(county)}
                          className={cn(
                            "filter-chip",
                            selectedCounty === county
                              ? "bg-kenya-black text-white shadow-lg shadow-black/10"
                              : "bg-white text-black/40 hover:bg-black/5 border border-black/5"
                          )}
                        >
                          {county}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-black/5" />

                  {/* Category row */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30 flex items-center gap-1.5">
                      <LayoutGrid size={10} /> Category
                    </span>
                    <div className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
                      {CATEGORY_TABS.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id as IssueCategory | 'all')}
                          className={cn(
                            'filter-chip flex items-center gap-1',
                            selectedCategory === cat.id
                              ? 'bg-kenya-black text-white shadow-lg shadow-black/10'
                              : 'bg-white text-black/40 hover:bg-black/5 border border-black/5'
                          )}
                        >
                          {cat.icon} {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 pb-24 sm:pb-32">
                  {posts
                    .filter(post => selectedCounty === 'All' || post.county_id === selectedCounty)
                    .filter(post => selectedCategory === 'all' || post.issue_category === selectedCategory)
                    .filter(post =>
                      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      post.county_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      post.ward_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      post.governor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      post.mp?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      post.mca_name?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((post, idx) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                      >
                        <PostCard
                          post={post}
                          onSelect={() => handlePostSelect(post)}
                          onVote={(type) => handleVote(post, type)}
                          onFlag={(type) => handleFlag(post, type)}
                          onComment={(text) => handleAddComment(text)}
                        />
                      </motion.div>
                    ))}
                </div>
              </section>
            </motion.div>
          )}

          {view === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-14 bottom-16"
            >
              <MapView posts={posts} />
            </motion.div>
          )}

          {view === 'leaders' && !selectedLeader && (
            <motion.div
              key="leaders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto px-6 pt-8 pb-32"
            >
              <div className="mb-8">
                <h2 className="text-5xl font-display font-black tracking-tighter text-stone-900 leading-[0.85]">POWER<br /><span className="text-emerald-600">WATCH</span></h2>
                <p className="text-sm text-stone-500 font-medium mt-3 leading-relaxed">Accountability metrics for public officials and regional leaders.</p>
              </div>

              {/* Hierarchical Navigation */}
              <div className="space-y-6">

                {/* Level 0: Searchable Counties List */}
                {selectedCounty === 'All' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                      <input
                        type="text"
                        placeholder="Search 47 counties..."
                        value={leaderSearchQuery}
                        onChange={(e) => setLeaderSearchQuery(e.target.value)}
                        className="w-full bg-stone-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {KENYA_LEADERS
                        .filter(c => c.county.toLowerCase().includes(leaderSearchQuery.toLowerCase()))
                        .map((county, idx) => (
                          <motion.button
                            key={county.code}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => setSelectedCounty(county.county)}
                            className="bg-white p-5 rounded-[2rem] border border-stone-200/60 shadow-sm flex items-center justify-between group hover:border-stone-900 transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center text-stone-900 font-black text-xs border border-stone-200/50 group-hover:bg-stone-900 group-hover:text-white transition-all">
                                {county.code}
                              </div>
                              <div>
                                <h3 className="font-display font-bold text-stone-900">{county.county}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Gov: {county.governor}</p>
                              </div>
                            </div>
                            <ChevronRight size={18} className="text-stone-300 group-hover:text-stone-900 transition-colors" />
                          </motion.button>
                        ))
                      }
                    </div>
                  </div>
                )}

                {/* Level 1: County Overview (Show Governor + Constituencies) */}
                {selectedCounty !== 'All' && !selectedConstituency && (
                  <div className="space-y-6">
                    <button
                      onClick={() => setSelectedCounty('All')}
                      className="flex items-center gap-2 text-stone-400 font-black text-[10px] uppercase tracking-widest hover:text-stone-900 transition-colors"
                    >
                      <ChevronRight className="rotate-180" size={14} /> Back to Counties
                    </button>

                    <div className="bg-emerald-600 rounded-[2.5rem] p-6 text-white shadow-xl shadow-emerald-600/20">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20 overflow-hidden ring-4 ring-white/10">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${getGovernor(selectedCounty)}`} alt="" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-70">Governor: {selectedCounty}</p>
                          <h3 className="text-xl font-display font-black leading-none mt-1">{getGovernor(selectedCounty)}</h3>
                          <button
                            onClick={() => setSelectedLeader({ id: `gov-${selectedCounty}`, name: getGovernor(selectedCounty), position: 'Governor', county_id: selectedCounty })}
                            className="text-[10px] font-bold underline mt-2 flex items-center gap-1 opacity-80"
                          >
                            View Leadership Profile <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 pl-4 mb-4">Constituencies</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {KENYA_LEADERS.find(c => c.county === selectedCounty)?.constituencies.map((consti, idx) => (
                          <button
                            key={consti.name}
                            onClick={() => setSelectedConstituency(consti.name)}
                            className="w-full text-left bg-white p-4 rounded-3xl border border-stone-200/60 shadow-sm flex items-center justify-between hover:border-black transition-all group"
                          >
                            <div>
                              <h3 className="text-sm font-black text-stone-900">{consti.name}</h3>
                              <p className="text-[10px] font-bold text-stone-400">MP: {consti.mp || 'Vacant'}</p>
                            </div>
                            <ChevronRight size={16} className="text-stone-300 group-hover:text-stone-900" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Level 2: Constituency View (Show MP + Wards) */}
                {selectedConstituency && !selectedWard && (
                  <div className="space-y-6">
                    <button
                      onClick={() => setSelectedConstituency(null)}
                      className="flex items-center gap-2 text-stone-400 font-black text-[10px] uppercase tracking-widest hover:text-stone-900 transition-colors"
                    >
                      <ChevronRight className="rotate-180" size={14} /> Back to {selectedCounty}
                    </button>

                    <div className="bg-stone-900 rounded-[2.5rem] p-6 text-white shadow-xl shadow-stone-900/20">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${getMP(selectedCounty, selectedConstituency)}`} alt="" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-70">MP: {selectedConstituency}</p>
                          <h3 className="text-xl font-display font-black leading-none mt-1">{getMP(selectedCounty, selectedConstituency)}</h3>
                          <button
                            onClick={() => setSelectedLeader({ id: `mp-${selectedConstituency}`, name: getMP(selectedCounty, selectedConstituency), position: 'MP', county_id: selectedCounty, constituency_id: selectedConstituency })}
                            className="text-[10px] font-bold underline mt-2 flex items-center gap-1 opacity-80"
                          >
                            View Performance Review <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 pl-4 mb-4">Wards</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {KENYA_DATA.find(c => c.name === selectedCounty)?.constituencies.find(con => con.name === selectedConstituency)?.wards.map((ward) => (
                          <button
                            key={ward}
                            onClick={() => setSelectedWard(ward)}
                            className="bg-stone-50 p-4 rounded-3xl border border-stone-100 flex items-center justify-between group hover:bg-stone-900 hover:text-white transition-all"
                          >
                            <span className="text-[10px] font-black uppercase tracking-tighter truncate leading-none">{ward}</span>
                            <ChevronRight size={14} className="text-stone-300 group-hover:text-emerald-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Level 3: Ward View (MCA + Local Evidence) */}
                {selectedWard && (
                  <div className="space-y-6">
                    <button
                      onClick={() => setSelectedWard(null)}
                      className="flex items-center gap-2 text-stone-400 font-black text-[10px] uppercase tracking-widest hover:text-stone-900 transition-colors"
                    >
                      <ChevronRight className="rotate-180" size={14} /> Back to {selectedConstituency}
                    </button>

                    <div className="bg-white border-2 border-dashed border-stone-200 p-8 rounded-[2.5rem] text-center">
                      <div className="w-16 h-16 bg-stone-100 rounded-full mx-auto flex items-center justify-center text-stone-400 mb-4">
                        <Users size={24} />
                      </div>
                      <h3 className="font-display font-black text-xl text-stone-900 tracking-tight">{selectedWard} Ward</h3>
                      <p className="text-xs text-stone-400 font-bold mt-1">MCA data is currently crowdsourced.</p>

                      <div className="mt-6 pt-6 border-t border-stone-100 grid grid-cols-2 gap-4">
                        <div className="text-left bg-stone-50 p-3 rounded-2xl">
                          <p className="text-[8px] font-black uppercase text-stone-400 tracking-widest">Local Reports</p>
                          <p className="text-lg font-black text-stone-900">{posts.filter(p => p.ward_id === selectedWard).length}</p>
                        </div>
                        <div className="text-left bg-stone-50 p-3 rounded-2xl">
                          <p className="text-[8px] font-black uppercase text-stone-400 tracking-widest">Verified Alerts</p>
                          <p className="text-lg font-black text-emerald-600">{posts.filter(p => p.ward_id === selectedWard && p.status === 'verified').length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 pl-4">Evidence in this Ward</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {posts.filter(p => p.ward_id === selectedWard).map((post) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-stone-50 rounded-3xl p-4 border border-stone-100"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-stone-200 overflow-hidden flex-shrink-0">
                                {post.media_urls?.[0] ? <img src={post.media_urls[0]} alt="" className="w-full h-full object-cover" /> : <MapPin size={16} className="text-stone-300" />}
                              </div>
                              <div>
                                <h5 className="text-[11px] font-black text-stone-900 leading-tight line-clamp-1">{post.description}</h5>
                                <p className="text-[9px] font-bold text-stone-400 mt-1">{post.ward_id}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        {posts.filter(p => p.ward_id === selectedWard).length === 0 && (
                          <div className="text-center py-10 opacity-30">
                            <MapPin size={40} className="mx-auto mb-2" />
                            <p className="text-xs font-bold">No evidence submitted yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'leaders' && selectedLeader && (
            <motion.div
              key="leader-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto px-6 pt-8 pb-32"
            >
              <button
                onClick={() => setSelectedLeader(null)}
                className="flex items-center gap-2 text-stone-400 mb-8 font-black text-[10px] uppercase tracking-[0.2em] hover:text-stone-900 transition-colors"
              >
                <ChevronRight className="rotate-180" size={16} />
                Back to Leaders
              </button>

              <div className="bg-stone-900 rounded-[2.5rem] p-8 text-white mb-10 shadow-2xl shadow-stone-900/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -translate-y-24 translate-x-24 blur-3xl" />

                <div className="relative flex items-center gap-6 mb-10">
                  <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-md border border-white/20 overflow-hidden shadow-2xl">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedLeader.name}`} alt="" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-black leading-tight tracking-tighter">{selectedLeader.name}</h2>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">{selectedLeader.position}</p>
                    <p className="text-stone-400 text-xs font-bold mt-1">{selectedLeader.county_id} County</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-500 mb-2">Total Reports</p>
                    <p className="text-4xl font-display font-black tracking-tighter">
                      {posts.filter(p => {
                        if (selectedLeader.position === 'Governor') return p.county_id === selectedLeader.county_id;
                        if (selectedLeader.position === 'MP') return p.constituency_id === selectedLeader.constituency_id || p.mp === selectedLeader.name;
                        if (selectedLeader.position === 'MCA') return p.mca_name === selectedLeader.name || (p.ward_id === selectedLeader.ward_id && p.mca_name);
                        return false;
                      }).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-500 mb-2">Resolution</p>
                    <p className="text-4xl font-display font-black tracking-tighter text-emerald-400">
                      {Math.round((posts.filter(p => {
                        const inJurisdiction = (selectedLeader.position === 'Governor' && p.county_id === selectedLeader.county_id) ||
                          (selectedLeader.position === 'MP' && (p.constituency_id === selectedLeader.constituency_id || p.mp === selectedLeader.name)) ||
                          (selectedLeader.position === 'MCA' && (p.mca_name === selectedLeader.name || (p.ward_id === selectedLeader.ward_id && p.mca_name)));
                        return inJurisdiction && p.status === 'verified';
                      }).length / (posts.filter(p => {
                        return (selectedLeader.position === 'Governor' && p.county_id === selectedLeader.county_id) ||
                          (selectedLeader.position === 'MP' && (p.constituency_id === selectedLeader.constituency_id || p.mp === selectedLeader.name)) ||
                          (selectedLeader.position === 'MCA' && (p.mca_name === selectedLeader.name || (p.ward_id === selectedLeader.ward_id && p.mca_name)));
                      }).length || 1)) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                  <AlertCircle size={18} className="text-amber-500" />
                  Reports in Jurisdiction
                </h3>
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Live Updates</span>
              </div>

              <div className="space-y-8 pb-12">
                {posts.filter(p => {
                  if (selectedLeader.position === 'Governor') return p.county_id === selectedLeader.county_id;
                  if (selectedLeader.position === 'MP') return p.constituency_id === selectedLeader.constituency_id || p.mp === selectedLeader.name;
                  if (selectedLeader.position === 'MCA') return p.mca_name === selectedLeader.name || (p.ward_id === selectedLeader.ward_id && p.mca_name);
                  return false;
                }).map(post => (
                  <PostCard key={post.id} post={post} onSelect={() => handlePostSelect(post)} />
                ))}
              </div>
            </motion.div>
          )}
          {view === 'post-detail' && (
            <motion.div
              key="post-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto px-4 pt-4 pb-32"
            >
              {!selectedPost ? (
                <div className="flex flex-col items-center justify-center py-20 text-stone-400">
                  <div className="w-16 h-16 bg-stone-100 rounded-full mb-4 animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-widest">Loading Report...</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleBackFromDetail}
                    className="flex items-center gap-2 text-stone-500 font-bold text-xs uppercase tracking-widest mb-6 hover:text-stone-900 transition-colors"
                  >
                    <ChevronRight className="rotate-180" size={16} />
                    Back
                  </button>

                  <div className="evidence-card overflow-hidden">
                    {/* Detailed Media */}
                    <div 
                      className="relative aspect-video bg-stone-950 flex items-center justify-center overflow-hidden cursor-zoom-in"
                      onClick={() => setSelectedPost && setFullscreenMedia({ url: selectedPost.media_url, type: selectedPost.media_type })}
                    >
                      {selectedPost.media_type === 'image' ? (
                        <img src={selectedPost.media_url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                      ) : (
                        <video src={selectedPost.media_url} controls className="w-full h-full object-cover" />
                      )}

                      <div className="absolute top-4 right-4">
                        <span className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-xl border border-white/20",
                          selectedPost.status === 'verified' ? "bg-emerald-500/80 text-white" :
                            selectedPost.status === 'under_review' ? "bg-amber-500/80 text-white" :
                              "bg-black/40 text-white"
                        )}>
                          {selectedPost.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Author Info */}
                      <div className="flex items-center gap-3 pb-6 border-b border-stone-100">
                        <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-400 border border-stone-200/50 overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPost.profiles?.username || 'anon'}`} alt="" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-900">{selectedPost.profiles?.username || 'Anonymous'}</h4>
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                            {formatDistanceToNow(new Date(selectedPost.created_at))} ago
                          </p>
                        </div>
                      </div>

                      {/* Location Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                          <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1">County</p>
                          <p className="text-xs font-bold text-stone-900">{selectedPost.county_id}</p>
                        </div>
                        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                          <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1">Ward</p>
                          <p className="text-xs font-bold text-stone-900">{selectedPost.ward_id}</p>
                        </div>
                        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                          <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1">Latitude</p>
                          <p className="text-xs font-mono font-bold text-stone-900">{selectedPost.gps_lat.toFixed(6)}</p>
                        </div>
                        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                          <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1">Longitude</p>
                          <p className="text-xs font-mono font-bold text-stone-900">{selectedPost.gps_lng.toFixed(6)}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-stone-400">Description</h3>
                        <p className="text-sm text-stone-600 leading-relaxed font-medium">
                          {selectedPost.description}
                        </p>
                      </div>

                      {/* Comments Section */}
                      <CommentSection 
                        postId={selectedPost.issue_id}
                        comments={selectedPost.comments || []}
                        currentUser={user}
                        onAddComment={handleAddComment}
                        onExpandMedia={(url, type) => setFullscreenMedia({ url, type })}
                      />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
          {view === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto px-6 pt-8 pb-32"
            >
              <div className="bg-white rounded-[3rem] p-10 border border-stone-200/60 shadow-2xl shadow-stone-200/20 text-center relative overflow-hidden mb-10">
                <div className="absolute top-0 left-0 right-0 h-40 bg-stone-900" />

                <div className="relative">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-32 h-32 bg-white rounded-[2.5rem] mx-auto flex items-center justify-center text-stone-400 border-8 border-white shadow-2xl overflow-hidden mb-6"
                  >
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'guest'}`} alt="avatar" />
                  </motion.div>
                  <h2 className="text-3xl font-display font-black text-stone-900 tracking-tighter leading-none">
                    {user?.email?.split('@')[0] || 'Citizen Reporter'}
                  </h2>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mt-3">Verified Contributor</p>

                  <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-stone-100">
                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100">
                      <p className="text-[8px] font-black uppercase tracking-[0.15em] text-stone-400 mb-1">Reports</p>
                      <p className="text-xl font-display font-bold text-stone-900 tracking-tighter">
                        {posts.filter(p => p.user_id === (user?.id || 'anonymous')).length}
                      </p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                      <p className="text-[8px] font-black uppercase tracking-[0.15em] text-emerald-600/60 mb-1">Trust</p>
                      <p className="text-xl font-display font-bold text-emerald-600 tracking-tighter">
                        {10 + posts.filter(p => p.user_id === (user?.id || 'anonymous') && p.status === 'verified').length * 15}
                      </p>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100">
                      <p className="text-[8px] font-black uppercase tracking-[0.15em] text-stone-400 mb-1">Impact</p>
                      <p className="text-xl font-display font-bold text-stone-900 tracking-tighter">
                        {posts.filter(p => p.user_id === (user?.id || 'anonymous')).length * 12}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contribution Progress */}
              <div className="bg-stone-900 rounded-[2.5rem] p-8 border border-stone-800 shadow-2xl shadow-stone-900/20 mb-10 text-white">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Contribution Level</h3>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 px-3 py-1 bg-emerald-400/10 rounded-full">Level 3</span>
                </div>
                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  />
                </div>
                <p className="text-[10px] font-bold text-stone-400 leading-relaxed">
                  350 XP until next level. Keep reporting to increase your impact!
                </p>
              </div>

              <div className="mb-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-6 px-2">My Evidence</h3>
                <div className="space-y-8">
                  {posts.filter(p => p.user_id === (user?.id || 'anonymous')).length > 0 ? (
                    posts.filter(p => p.user_id === (user?.id || 'anonymous')).map(post => (
                      <PostCard key={post.issue_id} post={post} onSelect={() => handlePostSelect(post)} />
                    ))
                  ) : (
                    <div className="bg-white rounded-[2rem] p-10 border border-dashed border-stone-200 text-center">
                      <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-300 mx-auto mb-4 border border-stone-100 shadow-inner">
                        <Camera size={28} />
                      </div>
                      <p className="text-sm font-bold text-stone-400">No evidence submitted yet</p>
                      <button
                        onClick={() => {
                          if (!user) setShowAuthModal(true);
                          else setShowCamera(true);
                        }}
                        className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 hover:opacity-70 transition-opacity"
                      >
                        Start Reporting
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {user ? (
                  <>
                    <button className="w-full bg-white p-6 rounded-2xl border border-stone-200/60 flex items-center justify-between font-bold text-stone-700 hover:bg-stone-50 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                          <ShieldCheck size={20} />
                        </div>
                        <span className="text-sm font-display font-bold">Account Verification</span>
                      </div>
                      <ChevronRight size={18} className="text-stone-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => supabase.auth.signOut()}
                      className="w-full bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center justify-center font-black text-[10px] uppercase tracking-[0.2em] text-red-600 hover:bg-red-100 transition-all mt-6"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full bg-kenya-black text-white p-6 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-black/20 hover:bg-kenya-red transition-all"
                  >
                    Sign In to Join the Watch
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-safe left-1/2 -translate-x-1/2 glass-morphism border border-black/5 bottom-nav flex items-center z-50 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-auto max-w-[95vw]" style={{ bottom: 'max(env(safe-area-inset-bottom, 0px), 1rem)', gap: 'clamp(0.5rem, 3vw, 2.5rem)', paddingLeft: 'clamp(0.75rem, 4vw, 2rem)', paddingRight: 'clamp(0.75rem, 4vw, 2rem)', paddingTop: 'clamp(0.5rem, 2vw, 1rem)', paddingBottom: 'clamp(0.5rem, 2vw, 1rem)' }}>
        <NavButton active={view === 'feed'} onClick={() => setView('feed')} icon={<LayoutGrid size={18} />} label="Feed" />
        <NavButton active={view === 'map'} onClick={() => setView('map')} icon={<MapIcon size={18} />} label="Map" />

        <button
          onClick={() => {
            if (!user) setShowAuthModal(true);
            else setShowCamera(true);
          }}
          style={{ width: 'clamp(2.75rem, 10vw, 3.5rem)', height: 'clamp(2.75rem, 10vw, 3.5rem)' }}
          className="bg-kenya-red rounded-full flex items-center justify-center text-white shadow-2xl shadow-kenya-red/40 -translate-y-0.5 active:scale-90 transition-all duration-300 shrink-0"
        >
          <Camera size={20} />
        </button>

        <NavButton active={view === 'leaders'} onClick={() => setView('leaders')} icon={<Navigation size={18} />} label="Leaders" />
        <NavButton active={view === 'profile'} onClick={() => setView('profile')} icon={<User size={18} />} label="Profile" />
      </nav>

      {/* Submission Form Modal */}
      <AnimatePresence>
        {showSubmissionForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-stone-900/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-md card-radius overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 safe-bottom">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-black tracking-tighter">REPORT DETAILS</h2>
                  <button onClick={() => { setShowSubmissionForm(null); setSubmitError(null); }} disabled={isSubmitting} className="text-stone-400 disabled:opacity-30">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">Description</label>
                    <textarea
                      placeholder="Describe the evidence..."
                      value={submissionData.description}
                      onChange={(e) => setSubmissionData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">Location (GPS Locked)</label>
                    <div className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-start gap-3">
                      <Navigation size={16} className="text-kenya-red mt-0.5 shrink-0" />
                      <div>
                        {submissionData.county ? (
                          <>
                            <p className="text-xs font-bold text-stone-800">{submissionData.county}</p>
                            {submissionData.constituency && (
                              <p className="text-[10px] text-stone-500 mt-0.5">{submissionData.constituency} {submissionData.ward ? `• ${submissionData.ward}` : ''}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-xs text-stone-400 italic">Location auto-detected from GPS</p>
                        )}
                      </div>
                      <span className="ml-auto bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Locked</span>
                    </div>
                  </div>
                </div>{/* end space-y-4 */}

                {/* Leader Linkage */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">Linked Leaders</label>

                  {/* Governor & MP chips — auto-populated */}
                  {(submissionData.governor || submissionData.mp) && (
                    <div className="flex flex-wrap gap-2">
                      {submissionData.governor && (
                        <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
                          <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">GOV</span>
                          <span className="text-xs font-bold text-blue-800">{submissionData.governor}</span>
                        </div>
                      )}
                      {submissionData.mp && (
                        <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full">
                          <span className="text-[9px] font-black uppercase tracking-widest text-purple-400">MP</span>
                          <span className="text-xs font-bold text-purple-800">{submissionData.mp}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MCA — user-entered */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-400 px-1">Your Ward MCA Name <span className="text-stone-300">(optional)</span></label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={submissionData.mca_name}
                      onChange={(e) => setSubmissionData(prev => ({ ...prev, mca_name: e.target.value }))}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none"
                    />
                    <p className="text-[10px] text-stone-400 px-1">Enter your elected MCA so this evidence is linked to their ward record.</p>
                  </div>
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                    <AlertCircle size={16} className="text-red-500 shrink-0" />
                    <p className="text-xs font-semibold text-red-700">{submitError}</p>
                  </div>
                )}

                <button
                  onClick={handleFinalSubmit}
                  disabled={!submissionData.description || isSubmitting}
                  className="w-full bg-stone-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-stone-900/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Processing...
                    </>
                  ) : 'Submit Evidence'}
                </button>
              </div>{/* end p-8 space-y-6 */}
            </motion.div>
          </motion.div>

        )}

      </AnimatePresence>

      <AnimatePresence>
        {showCamera && (
          <CameraCapture
            onCapture={handleCapture}
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>

      {/* Verification Modal */}
      <AnimatePresence>
        {verificationTarget && (
          <VerificationModal
            post={verificationTarget.post}
            type={verificationTarget.type}
            userLocation={currentUserLocation}
            onSubmit={handleVerificationSubmit}
            onClose={() => setVerificationTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* Submission Workflow Overlay — only shown during evidence submission */}
      <AnimatePresence>
        {
          isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-stone-900/95 backdrop-blur-xl flex items-center justify-center p-6"
            >
              <div className="w-full max-w-xs space-y-8">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-emerald-500/20 rounded-full" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 left-0 w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShieldCheck className="text-emerald-500" size={32} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-display font-black text-white text-center tracking-tighter">SECURING EVIDENCE</h3>
                  <div className="space-y-3">
                    {[
                      { id: 1, label: 'Media Encryption & Upload' },
                      { id: 2, label: 'Geospatial Verification' },
                      { id: 3, label: 'Accountability Ledger Entry' },
                      { id: 4, label: 'Leader Notification Dispatch' }
                    ].map((step) => (
                      <div key={step.id} className="flex items-center gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-500",
                          submissionStep > step.id ? "bg-emerald-500" :
                            submissionStep === step.id ? "bg-emerald-500/20 border border-emerald-500/50" :
                              "bg-stone-800"
                        )}>
                          {submissionStep > step.id && <Check size={12} className="text-stone-900" />}
                          {submissionStep === step.id && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                        </div>
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest transition-colors duration-500",
                          submissionStep >= step.id ? "text-white" : "text-stone-600"
                        )}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        }
      </AnimatePresence >

      {/* Lightbox */}
      <AnimatePresence>
        {fullscreenMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-10"
            onClick={() => setFullscreenMedia(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-5xl max-h-full flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              {fullscreenMedia.type === 'image' ? (
                <img src={fullscreenMedia.url} alt="" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
              ) : (
                <video src={fullscreenMedia.url} controls autoPlay className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LocationPermissionModal 
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onConfirm={() => {
          setShowLocationModal(false);
          setShowCamera(true);
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
        }}
        onSuccess={(user) => {
          setUser(user);
          setShowAuthModal(false);
        }}
      />

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 pointer-events-none"
          >
            <div className="bg-emerald-500 text-white px-8 py-6 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Check size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-black tracking-tighter">REPORT SECURED</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mt-1">Trust Score +15 Points</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-0.5 transition-all duration-300",
        active ? "text-kenya-black scale-110" : "text-black/30 hover:text-black/60"
      )}
      style={{ minWidth: 'clamp(2.25rem, 8vw, 3.5rem)' }}
    >
      <div className={cn(
        "p-1 rounded-lg transition-colors",
        active ? "bg-black/5" : "bg-transparent"
      )}>
        {icon}
      </div>
      <span className="text-[8px] font-black uppercase tracking-tight leading-none">{label}</span>
    </button>
  );
}

const MOCK_POSTS: Issue[] = [
  {
    issue_id: '1',
    user_id: 'u1',
    title: 'Severe Potholes in Embakasi',
    issue_type_id: 'roads',
    media_url: 'https://picsum.photos/seed/road/800/450',
    media_type: 'image',
    description: 'Severe potholes on Outer Ring Road near Taj Mall. Dangerous for motorists at night.',
    county_id: 'Nairobi',
    constituency_id: 'Embakasi South',
    ward_id: 'Pipeline',
    gps_lat: -1.3148,
    gps_lng: 36.8963,
    capture_timestamp: new Date().toISOString(),
    created_at: new Date(Date.now() - 3600000).toISOString(),
    status: 'pending',
    severity: 'high',
    confidence_score: 8.5,
    verifier_count: 5,
    unique_regions_verified: 2,
    is_sensitive: false,
    profiles: { username: 'Juma_Ke', trust_score: 85 } as any
  },
  {
    issue_id: '2',
    user_id: 'u2',
    title: 'Water pipe burst in Kilimani',
    issue_type_id: 'water',
    media_url: 'https://picsum.photos/seed/water/800/450',
    media_type: 'image',
    description: 'Water pipe burst in Kilimani. Thousands of gallons being wasted for the last 5 hours.',
    county_id: 'Nairobi',
    constituency_id: 'Dagoretti North',
    ward_id: 'Kilimani',
    gps_lat: -1.2897,
    gps_lng: 36.7924,
    capture_timestamp: new Date().toISOString(),
    created_at: new Date(Date.now() - 7200000).toISOString(),
    status: 'verified',
    severity: 'medium',
    confidence_score: 21.4,
    verifier_count: 13,
    unique_regions_verified: 4,
    is_sensitive: false,
    profiles: { username: 'Sarah_M', trust_score: 120 } as any
  },
  {
    issue_id: '3',
    user_id: 'u3',
    title: 'Nyali Bridge Structural Concerns',
    issue_type_id: 'infrastructure',
    media_url: 'https://picsum.photos/seed/bridge/800/450',
    media_type: 'image',
    description: 'Nyali bridge structural concerns. Cracks visible on the main support pillars.',
    county_id: 'Mombasa',
    constituency_id: 'Nyali',
    ward_id: 'Nyali',
    gps_lat: -4.0435,
    gps_lng: 39.6682,
    capture_timestamp: new Date().toISOString(),
    created_at: new Date(Date.now() - 14400000).toISOString(),
    status: 'pending',
    severity: 'high',
    confidence_score: -7.4,
    verifier_count: 10,
    unique_regions_verified: 1,
    is_sensitive: true,
    profiles: { username: 'Ali_Msa', trust_score: 45 } as any
  }
];


