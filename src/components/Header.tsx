import React from 'react';
import { FamilyMember } from '../types';
import { Calendar, Plus, Share2, Users, Sparkles, Utensils, Target, Camera } from 'lucide-react';

interface HeaderProps {
  members: FamilyMember[];
  activeMember: FamilyMember;
  onSelectActiveMember: (memberId: string) => void;
  onOpenAddSchedule: () => void;
  onOpenMemberManager: () => void;
  onOpenShareModal: () => void;
  activeTab: 'today' | 'goals' | 'gallery' | 'dinner' | 'calendar' | 'memos';
  onSelectTab: (tab: 'today' | 'goals' | 'gallery' | 'dinner' | 'calendar' | 'memos') => void;
  goalCount?: number;
  mediaCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  members,
  activeMember,
  onSelectActiveMember,
  onOpenAddSchedule,
  onOpenMemberManager,
  onOpenShareModal,
  activeTab,
  onSelectTab,
  goalCount,
  mediaCount,
}) => {
  const todayDateStr = new Date().toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b-2 border-slate-900 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Top bar: Brand & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-2.5">
            <div className="relative group w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 border-2 border-slate-900 flex items-center justify-center pop-shadow-sm transform -rotate-3 hover:rotate-6 hover:scale-105 transition-all">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 filter drop-shadow-[1px_1px_0px_#0F172A]"
              >
                <path
                  d="M13.5 1.5L3 13.5H12L10.5 22.5L21 10.5H12L13.5 1.5Z"
                  className="fill-yellow-200 stroke-slate-900"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.5 4L6.5 12H11L9.8 17.5L16.5 11.5H12.2L12.5 4Z"
                  className="fill-white/80"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-display">
                  패밀리바이브
                </span>
                <span className="px-2 py-0.5 text-xs font-black bg-yellow-300 text-slate-900 border border-slate-900 rounded-full shadow-[1px_1px_0px_#0F172A] -rotate-1">
                  TEEN & FAMILY
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 hidden sm:block">
                {todayDateStr} • 우리 가족 실시간 라이프 & 스케줄
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              id="btn-open-share"
              onClick={onOpenShareModal}
              title="카톡 공유 및 백업"
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold bg-white text-slate-800 border-2 border-slate-900 rounded-xl pop-shadow-sm pop-shadow-hover hover:bg-slate-50"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">단톡 공유</span>
            </button>

            <button
              id="btn-manage-members"
              onClick={onOpenMemberManager}
              title="가족 구성원 관리"
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold bg-white text-slate-800 border-2 border-slate-900 rounded-xl pop-shadow-sm pop-shadow-hover hover:bg-slate-50"
            >
              <Users className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">가족 관리</span>
            </button>

            <button
              id="btn-add-schedule-main"
              onClick={onOpenAddSchedule}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-black bg-gradient-to-r from-pink-500 to-rose-500 text-white border-2 border-slate-900 rounded-xl pop-shadow-sm pop-shadow-hover active:translate-y-0.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>1초 일정 등록</span>
            </button>
          </div>
        </div>

        {/* Member Switcher Bar: "지금 누가 쓰고 있나요?" */}
        <div className="bg-slate-50 p-2 sm:p-2.5 rounded-2xl border-2 border-slate-900 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-black text-slate-700 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>현재 입력자:</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              (터치해서 본인 프로필로 바로 전환!)
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {members.map((member) => {
              const isSelected = member.id === activeMember.id;
              return (
                <button
                  key={member.id}
                  id={`btn-select-member-${member.id}`}
                  onClick={() => onSelectActiveMember(member.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 transition-all shrink-0 ${
                    isSelected
                      ? 'border-slate-900 pop-shadow-sm scale-105 font-black text-slate-900'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-500 opacity-80'
                  }`}
                  style={{
                    backgroundColor: isSelected ? member.bgLight : undefined,
                  }}
                >
                  <span className="text-base">{member.avatar}</span>
                  <div className="text-left leading-tight">
                    <span className="text-xs font-black block">
                      {member.name}
                    </span>
                    {member.gradeBadge && (
                      <span className="text-[10px] text-slate-500 font-bold block">
                        {member.gradeBadge}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-none">
          <button
            id="nav-tab-today"
            onClick={() => onSelectTab('today')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-black rounded-xl border-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'today'
                ? 'bg-slate-900 text-yellow-300 border-slate-900 pop-shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-700'
            }`}
          >
            <span>⚡ 오늘의 흐름</span>
          </button>

          <button
            id="nav-tab-goals"
            onClick={() => onSelectTab('goals')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-black rounded-xl border-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'goals'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 border-slate-900 pop-shadow-sm font-black'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-700'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-rose-600" />
            <span>🎯 각자의 목표달성</span>
            {goalCount !== undefined && goalCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-black">
                {goalCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-gallery"
            onClick={() => onSelectTab('gallery')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-black rounded-xl border-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'gallery'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-slate-900 pop-shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-700'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>📸 사진/영상 공유</span>
            {mediaCount !== undefined && mediaCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-yellow-300 text-slate-900 font-black">
                {mediaCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-dinner"
            onClick={() => onSelectTab('dinner')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-black rounded-xl border-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'dinner'
                ? 'bg-amber-400 text-slate-900 border-slate-900 pop-shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-700'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>🍚 오늘 저녁밥</span>
          </button>

          <button
            id="nav-tab-calendar"
            onClick={() => onSelectTab('calendar')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-black rounded-xl border-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'calendar'
                ? 'bg-indigo-600 text-white border-slate-900 pop-shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-700'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>📅 캘린더</span>
          </button>

          <button
            id="nav-tab-memos"
            onClick={() => onSelectTab('memos')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-black rounded-xl border-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'memos'
                ? 'bg-purple-600 text-white border-slate-900 pop-shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-700'
            }`}
          >
            <span>💌 가족 메모</span>
          </button>
        </div>
      </div>
    </header>
  );
};
