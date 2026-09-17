import React, { useState, useEffect } from 'react';
import { FamilyMember, ScheduleItem, MemberGoal } from '../types';
import {
  Zap,
  Sparkles,
  Heart,
  Flame,
  Gift,
  RefreshCw,
  Edit3,
  Check,
  Camera,
  Target,
  Utensils,
  Car,
  ChevronDown,
  ChevronUp,
  Volume2,
  Play,
  ExternalLink,
  Video,
} from 'lucide-react';

interface HeroInteractiveSectionProps {
  members: FamilyMember[];
  activeMember: FamilyMember;
  schedules: ScheduleItem[];
  goals: MemberGoal[];
  onOpenAddSchedule: () => void;
  onSelectTab: (tab: 'today' | 'goals' | 'gallery' | 'dinner' | 'calendar' | 'memos') => void;
  currentDate: string;
}

interface FloatingParticle {
  id: number;
  emoji: string;
  left: number; // percentage 0-100
  bottom: number;
  rotation: number;
}

const CHEER_CAPSULES = [
  {
    tag: '열공 버닝 📐',
    title: '스카 모의고사 1등급 기운 가득!',
    message: '오늘 스카 3시간 집중하면 저녁에 시원한 버블티 or 마라탕이 기다립니다! 🧋🔥',
    author: '패밀리 응원단',
  },
  {
    tag: '비타민 충전 💊',
    title: '공부도 체력전, 밥심이 최고!',
    message: '오늘 저녁밥 거르지 말고 든든하게 먹기! 엄마아빠가 맛있는 야식 대기중 🍗',
    author: '엄마&아빠',
  },
  {
    tag: '픽업 세이프티 🚗',
    title: '밤길 걱정 제로, 픽업 콜 대기중!',
    message: '학원 끝나고 밤에 나올 때 추우니까 따뜻하게 입고, SOS 픽업 요청 누르면 바로 출발! 🚗💨',
    author: '아빠 드라이버',
  },
  {
    tag: '힐링 & 꿀잠 😴',
    title: '오늘도 정말 수고 많았어!',
    message: '매일 목표를 향해 달리는 당신이 최고예요. 오늘 밤엔 푹 자고 좋은 꿈 꾸기 ✨',
    author: '패밀리 바이브',
  },
  {
    tag: '주말 보너스 🎤',
    title: '이번 주 목표 올클리어 시 코노 & 쇼핑!',
    message: '연속 목표 달성 스트릭 유지하면 이번 주말 코노 1시간 + 용돈 보너스 지원! 💸',
    author: '가족 리워드',
  },
  {
    tag: '긍정 에너지 🍀',
    title: '시험 걱정 No, 지금까지 해온 걸로 충분해!',
    message: '노력한 만큼 멋진 결과가 올 거예요. 우리 가족 모두가 뒤에서 언제나 널 응원해 💯',
    author: '패밀리 하트',
  },
];

const QUICK_CANNON_EMOJIS = [
  { emoji: '🔥', label: '열공' },
  { emoji: '💖', label: '사랑' },
  { emoji: '🧋', label: '버블티' },
  { emoji: '🍗', label: '야식' },
  { emoji: '💯', label: '만점' },
  { emoji: '🚗', label: '픽업' },
];

const STORAGE_KEY_VIBE_ENERGY = 'family_vibe_energy_score_v1';
const STORAGE_KEY_FAMILY_MOTTO = 'family_vibe_motto_text_v1';

export const HeroInteractiveSection: React.FC<HeroInteractiveSectionProps> = ({
  members,
  activeMember,
  schedules,
  goals,
  onOpenAddSchedule,
  onSelectTab,
  currentDate,
}) => {
  // Energy Gauge (0 to 100)
  const [energyScore, setEnergyScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VIBE_ENERGY);
      return saved ? Number(saved) : 85;
    } catch {
      return 85;
    }
  });

  // Family Motto / Daily Cheer
  const [motto, setMotto] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAMILY_MOTTO);
      return saved || '우리 가족 오늘도 각자의 자리에서 파이팅! 사랑해 ❤️';
    } catch {
      return '우리 가족 오늘도 각자의 자리에서 파이팅! 사랑해 ❤️';
    }
  });
  const [isEditingMotto, setIsEditingMotto] = useState(false);
  const [tempMotto, setTempMotto] = useState(motto);

  // Floating particles
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [cheerCountToday, setCheerCountToday] = useState(18);

  // Cheer Capsule index
  const [capsuleIndex, setCapsuleIndex] = useState(0);
  const [isShakingCapsule, setIsShakingCapsule] = useState(false);

  // Collapsed state
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVideoVisible, setIsVideoVisible] = useState(true);

  // Save energy score to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VIBE_ENERGY, String(energyScore));
    } catch (e) {
      console.error(e);
    }
  }, [energyScore]);

  // Save motto
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAMILY_MOTTO, motto);
    } catch (e) {
      console.error(e);
    }
  }, [motto]);

  // Clean up floating particles
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles((prev) => prev.filter((p) => Date.now() - p.id < 2000));
    }, 1500);
    return () => clearTimeout(timer);
  }, [particles]);

  // Boost Energy
  const handleBoostEnergy = () => {
    setEnergyScore((prev) => Math.min(100, prev + 5));
    triggerEmojiShower('⚡');
  };

  // Trigger Emoji Shower
  const triggerEmojiShower = (emoji: string) => {
    setCheerCountToday((prev) => prev + 1);
    const newParticles: FloatingParticle[] = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i * 50 + Math.random() * 10,
      emoji,
      left: Math.floor(Math.random() * 85) + 5,
      bottom: Math.floor(Math.random() * 30),
      rotation: Math.floor(Math.random() * 60) - 30,
    }));
    setParticles((prev) => [...prev.slice(-15), ...newParticles]);
  };

  // Draw new cheer capsule
  const handleDrawNewCapsule = () => {
    setIsShakingCapsule(true);
    setTimeout(() => {
      setCapsuleIndex((prev) => (prev + 1) % CHEER_CAPSULES.length);
      setIsShakingCapsule(false);
      triggerEmojiShower('✨');
    }, 300);
  };

  const handleSaveMotto = () => {
    if (tempMotto.trim()) {
      setMotto(tempMotto.trim());
    }
    setIsEditingMotto(false);
  };

  // Today stats for quick hub
  const todaySchedules = schedules.filter((s) => s.date === currentDate);
  const pickupNeededSchedules = todaySchedules.filter((s) => s.needsPickup && !s.pickupAcceptedBy);
  const completedGoalsCount = goals.filter((g) => g.isCompletedToday).length;

  const currentCapsule = CHEER_CAPSULES[capsuleIndex];

  // Dynamic vibe label based on score
  const getVibeStatusText = (score: number) => {
    if (score >= 95) return '🔥 텐션 200% 폭발! 오늘 완전 대박의 날';
    if (score >= 80) return '💖 가족 에너지 빵빵! 화기애애 파이팅 모드';
    if (score >= 60) return '📚 열공 & 열일 모드 순항 중!';
    return '🥱 살짝 피곤함! 달콤한 간식과 응원이 시급해요';
  };

  return (
    <div className="relative mb-6 rounded-3xl border-2 border-slate-900 bg-gradient-to-br from-amber-300 via-pink-300 to-purple-400 p-4 sm:p-6 pop-shadow overflow-hidden transition-all duration-300">
      {/* Background Floating Animated Particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-2xl sm:text-3xl animate-floatUp select-none"
            style={{
              left: `${particle.left}%`,
              bottom: `${particle.bottom}%`,
              transform: `rotate(${particle.rotation}deg)`,
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>

      {/* Hero Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-900/40 pb-3 mb-4">
        <div className="flex items-center gap-3">
          {/* Hip Neo-Pop Electric Lightning Badge */}
          <button
            id="btn-hero-lightning-boost"
            onClick={handleBoostEnergy}
            title="힙한 번개 터치해서 에너지 충전! ⚡"
            className="relative group w-12 h-12 rounded-2xl bg-slate-900 border-2 border-slate-900 flex items-center justify-center pop-shadow pop-shadow-hover transform -rotate-6 hover:rotate-6 hover:scale-110 active:scale-90 transition-all cursor-pointer shrink-0"
          >
            {/* Cyber Neon Glow Behind */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-lime-300 opacity-90 blur-[2px] group-hover:opacity-100 group-hover:blur-[4px] transition-all" />

            {/* Inner Pill Background with Comic Stripes */}
            <div className="relative w-[calc(100%-4px)] h-[calc(100%-4px)] rounded-[12px] bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 border-2 border-slate-900 flex items-center justify-center overflow-hidden">
              {/* Diagonal Comic Action Stripes */}
              <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,#000,#000_2px,transparent_2px,transparent_6px)]" />

              {/* Razor-Sharp Comic Street Lightning Bolt Vector */}
              <svg
                viewBox="0 0 24 24"
                className="relative z-10 w-7 h-7 filter drop-shadow-[2px_2px_0px_#0F172A] transform group-hover:scale-115 group-hover:-rotate-3 transition-transform"
              >
                {/* Outer Bold Lightning Polygon */}
                <path
                  d="M13.5 1.5L3 13.5H12L10.5 22.5L21 10.5H12L13.5 1.5Z"
                  className="fill-yellow-200 stroke-slate-900"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Inner Electric Highlight Streak */}
                <path
                  d="M12.5 4L6.5 12H11L9.8 17.5L16.5 11.5H12.2L12.5 4Z"
                  className="fill-white/85"
                />
              </svg>

              {/* Electric Pulse Ping */}
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </div>

            {/* Micro Streetwear Tag Badge */}
            <span className="absolute -bottom-1 -right-1 text-[9px] font-black leading-none bg-yellow-300 text-slate-900 px-1 py-0.5 rounded-md border border-slate-900 shadow-xs transform rotate-6">
              BOOST
            </span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight">
                패밀리 바이브 인터랙티브 센터
              </h2>
              <span className="px-2 py-0.5 bg-white border border-slate-900 rounded-full text-[11px] font-black text-slate-900 pop-shadow-xs animate-bounce">
                LIVE 📡
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800">
              터치하고 응원하며 우리 가족 에너지를 충전해보세요!
            </p>
          </div>
        </div>

        {/* Toggle Collapse & Quick Stats */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-900 text-xs font-black text-slate-800 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>오늘 보낸 응원: </span>
            <span className="text-pink-600 font-black">{cheerCountToday}회</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 bg-white rounded-xl border-2 border-slate-900 text-slate-900 hover:bg-slate-100 pop-shadow-xs transition-transform active:scale-95"
            title={isExpanded ? '간략히 접기' : '자세히 펼치기'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* 🎬 Featured YouTube Video & Vibe Player Card (앞부분 삽입) */}
          <div className="relative z-10 mb-4 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-slate-900 p-3 sm:p-4 pop-shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 text-white flex items-center justify-center font-black text-sm shadow-sm border border-slate-900">
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900">
                      패밀리 온에어 추천 영상 & BGM 🎧
                    </h3>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-300 rounded-full text-[10px] font-black">
                      ON AIR 🔴
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    오늘 우리 가족을 위한 공식 추천 플레이리스트 & 영상
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => triggerEmojiShower('💖')}
                  className="px-2.5 py-1 text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 border border-pink-300 rounded-xl flex items-center gap-1 transition-all"
                  title="영상에 하트 응원 날리기"
                >
                  <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                  <span className="hidden sm:inline">하트 응원</span>
                </button>

                <a
                  href="https://youtu.be/kX3EnAayzDo?si=-ZViAkaheu71SDCq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-300 rounded-xl flex items-center gap-1 transition-all"
                  title="YouTube 앱/새창에서 열기"
                >
                  <span>YouTube 열기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => setIsVideoVisible(!isVideoVisible)}
                  className="px-2.5 py-1 text-xs font-black bg-slate-100 hover:bg-slate-200 border border-slate-900 rounded-xl transition-all"
                >
                  {isVideoVisible ? '영상 접기 ▲' : '영상 열기 ▼'}
                </button>
              </div>
            </div>

            {/* Embedded YouTube Player */}
            {isVideoVisible && (
              <div className="relative w-full aspect-video sm:max-h-[380px] rounded-xl overflow-hidden border-2 border-slate-900 bg-slate-950 pop-shadow-xs">
                <iframe
                  src="https://www.youtube.com/embed/kX3EnAayzDo?rel=0"
                  title="패밀리 온에어 추천 영상"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}
          </div>

          {/* Main Interactive Grid */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (7 Cols): Energy Gauge & Emoji Cannon */}
        <div className="lg:col-span-7 space-y-4">
          {/* 1. Interactive Family Vibe Energy Gauge */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border-2 border-slate-900 p-4 pop-shadow-sm space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-black text-slate-900">
                  실시간 우리 가족 에너지 게이지
                </span>
              </div>
              <span className="text-lg sm:text-xl font-black text-slate-900 font-display">
                {energyScore}%
              </span>
            </div>

            {/* Visual Animated Progress Bar */}
            <div className="relative w-full h-4 bg-slate-200 rounded-full border-2 border-slate-900 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${energyScore}%` }}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <span className="text-xs font-black text-slate-700">
                {getVibeStatusText(energyScore)}
              </span>

              <button
                id="btn-boost-energy"
                onClick={handleBoostEnergy}
                className="self-start sm:self-auto px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 rounded-xl border-2 border-slate-900 font-black text-xs pop-shadow-xs hover:bg-yellow-200 active:translate-y-0.5 flex items-center gap-1.5 shrink-0"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-900" />
                <span>에너지 부스트 (+5%) ⚡</span>
              </button>
            </div>
          </div>

          {/* 2. Interactive Emoji Cannon Bar */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border-2 border-slate-900 p-3.5 pop-shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 text-xs font-black text-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>터치해서 실시간 응원 폭죽 날리기 🎆</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold">
                (버튼을 눌러 화면에 띄워보세요)
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
              {QUICK_CANNON_EMOJIS.map((item) => (
                <button
                  key={item.emoji}
                  onClick={() => triggerEmojiShower(item.emoji)}
                  className="py-2 px-1 bg-slate-50 hover:bg-amber-100/70 border-2 border-slate-800 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-90 pop-shadow-xs"
                  title={`${item.label} 응원 보내기`}
                >
                  <span className="text-xl sm:text-2xl">{item.emoji}</span>
                  <span className="text-[10px] font-black text-slate-800 mt-0.5">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Editable Family Motto (오늘의 가족 한마디) */}
          <div className="bg-yellow-100/90 backdrop-blur-sm rounded-2xl border-2 border-slate-900 p-3 pop-shadow-sm flex items-start gap-2.5">
            <span className="text-xl shrink-0 p-1 bg-white rounded-lg border border-slate-900">
              💌
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[11px] font-black text-slate-900">
                  오늘의 가족 한마디 & 가훈
                </span>
                {!isEditingMotto && (
                  <button
                    onClick={() => {
                      setTempMotto(motto);
                      setIsEditingMotto(true);
                    }}
                    className="text-[10px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-0.5"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>수정</span>
                  </button>
                )}
              </div>

              {isEditingMotto ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="text"
                    value={tempMotto}
                    onChange={(e) => setTempMotto(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs font-bold bg-white rounded-lg border border-slate-900 focus:outline-none"
                    placeholder="오늘 가족에게 전할 한마디"
                  />
                  <button
                    onClick={handleSaveMotto}
                    className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                  "{motto}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Fortune Capsule & Quick Action Hub */}
        <div className="lg:col-span-5 space-y-4">
          {/* 4. Interactive Fortune & Cheer Capsule */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border-2 border-slate-900 p-4 pop-shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-black text-slate-900">
                    오늘의 럭키 응원 캡슐 🎁
                  </span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full border border-purple-300">
                  {currentCapsule.tag}
                </span>
              </div>

              <div
                className={`p-3 bg-slate-50 rounded-xl border-2 border-slate-200 transition-transform ${
                  isShakingCapsule ? 'scale-95 rotate-1 bg-amber-50' : ''
                }`}
              >
                <h4 className="text-xs sm:text-sm font-black text-slate-900 mb-1">
                  {currentCapsule.title}
                </h4>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                  {currentCapsule.message}
                </p>
                <div className="mt-2 text-right text-[10px] font-bold text-slate-500">
                  — from {currentCapsule.author}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 mt-2 border-t border-slate-200">
              <button
                onClick={() => triggerEmojiShower('💖')}
                className="text-xs font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1"
              >
                <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                <span>이 응원 받기!</span>
              </button>

              <button
                onClick={handleDrawNewCapsule}
                className="px-3 py-1.5 bg-slate-900 text-yellow-300 rounded-xl border border-slate-900 text-xs font-black flex items-center gap-1 hover:bg-slate-800 transition-all active:scale-95 pop-shadow-xs"
              >
                <RefreshCw className={`w-3 h-3 ${isShakingCapsule ? 'animate-spin' : ''}`} />
                <span>새 캡슐 뽑기</span>
              </button>
            </div>
          </div>

          {/* 5. Quick Interactive Hub Buttons */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border-2 border-slate-900 p-3 pop-shadow-sm space-y-2">
            <div className="text-[11px] font-black text-slate-800 flex items-center gap-1">
              <span>⚡ 빠른 패밀리 액션 허브</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectTab('goals')}
                className="p-2.5 bg-amber-50 hover:bg-amber-100 border-2 border-slate-800 rounded-xl text-left transition-all hover:scale-102 flex items-center gap-2 pop-shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-900">
                  <Target className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-xs font-black block text-slate-900 truncate">
                    목표 달성 체크
                  </span>
                  <span className="text-[10px] text-amber-900 font-bold block truncate">
                    오늘 완료 {completedGoalsCount}개
                  </span>
                </div>
              </button>

              <button
                onClick={() => onSelectTab('gallery')}
                className="p-2.5 bg-pink-50 hover:bg-pink-100 border-2 border-slate-800 rounded-xl text-left transition-all hover:scale-102 flex items-center gap-2 pop-shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center font-bold text-sm shrink-0 border border-slate-900">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-xs font-black block text-slate-900 truncate">
                    사진/영상 올리기
                  </span>
                  <span className="text-[10px] text-pink-700 font-bold block truncate">
                    오늘의 순간 포착 📸
                  </span>
                </div>
              </button>

              <button
                onClick={() => onSelectTab('dinner')}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border-2 border-slate-800 rounded-xl text-left transition-all hover:scale-102 flex items-center gap-2 pop-shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-900 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-900">
                  <Utensils className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-xs font-black block text-slate-900 truncate">
                    오늘 저녁밥 체크
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold block truncate">
                    집밥/외식 1초 투표 🍚
                  </span>
                </div>
              </button>

              <button
                onClick={onOpenAddSchedule}
                className="p-2.5 bg-indigo-50 hover:bg-indigo-100 border-2 border-slate-800 rounded-xl text-left transition-all hover:scale-102 flex items-center gap-2 pop-shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shrink-0 border border-slate-900">
                  <Car className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-xs font-black block text-slate-900 truncate">
                    {pickupNeededSchedules.length > 0
                      ? `🚗 픽업 ${pickupNeededSchedules.length}건 대기!`
                      : '1초 일정 등록'}
                  </span>
                  <span className="text-[10px] text-indigo-800 font-bold block truncate">
                    학원/스카/약속 추가
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )}
</div>
  );
};
