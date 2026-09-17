import React, { useState, useEffect } from 'react';
import {
  FamilyMember,
  ScheduleItem,
  FamilyMemo,
  DDayEvent,
  DinnerChoice,
  MemberGoal,
  FamilyMediaItem,
} from './types';
import {
  INITIAL_MEMBERS,
  getInitialSchedules,
  INITIAL_MEMOS,
  INITIAL_DDAYS,
  INITIAL_GOALS,
  INITIAL_MEDIA_ITEMS,
  getOffsetDateString,
} from './data/initialData';
import { Header } from './components/Header';
import { HeroInteractiveSection } from './components/HeroInteractiveSection';
import { TodayTimeline } from './components/TodayTimeline';
import { GoalTracker } from './components/GoalTracker';
import { FamilyMediaGallery } from './components/FamilyMediaGallery';
import { DinnerBoard } from './components/DinnerBoard';
import { CalendarView } from './components/CalendarView';
import { FamilyMemoBoard } from './components/FamilyMemoBoard';
import { AddScheduleModal } from './components/AddScheduleModal';
import { MemberManagerModal } from './components/MemberManagerModal';
import { ShareModal } from './components/ShareModal';
import { Sparkles, Heart } from 'lucide-react';

const STORAGE_KEY_MEMBERS = 'family_vibe_members_v1';
const STORAGE_KEY_SCHEDULES = 'family_vibe_schedules_v1';
const STORAGE_KEY_MEMOS = 'family_vibe_memos_v1';
const STORAGE_KEY_DDAYS = 'family_vibe_ddays_v1';
const STORAGE_KEY_DINNER_MENU = 'family_vibe_dinner_menu_v1';
const STORAGE_KEY_GOALS = 'family_vibe_goals_v1';
const STORAGE_KEY_MEDIA = 'family_vibe_media_v1';

export default function App() {
  // Members state
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEMBERS);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  const [activeMemberId, setActiveMemberId] = useState<string>(() => {
    return members[0]?.id || 'teen-1';
  });

  // Schedules state
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCHEDULES);
      return saved ? JSON.parse(saved) : getInitialSchedules();
    } catch {
      return getInitialSchedules();
    }
  });

  // Memos state
  const [memos, setMemos] = useState<FamilyMemo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEMOS);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMOS;
    }
  });

  // D-Day state
  const [ddays, setDdays] = useState<DDayEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DDAYS);
      return saved ? JSON.parse(saved) : INITIAL_DDAYS;
    } catch {
      return INITIAL_DDAYS;
    }
  });

  // Dinner Menu state
  const [dinnerMenu, setDinnerMenu] = useState<string>(() => {
    return (
      localStorage.getItem(STORAGE_KEY_DINNER_MENU) ||
      '지글지글 삼겹살 파티 & 차돌된장찌개 🥓'
    );
  });

  // Navigation and date states
  const [activeTab, setActiveTab] = useState<
    'today' | 'goals' | 'gallery' | 'dinner' | 'calendar' | 'memos'
  >('today');
  const [currentDate, setCurrentDate] = useState<string>(getOffsetDateString(0));

  // Goals state
  const [goals, setGoals] = useState<MemberGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GOALS);
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  // Media Gallery state
  const [mediaItems, setMediaItems] = useState<FamilyMediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEDIA);
      if (saved) {
        const parsed: FamilyMediaItem[] = JSON.parse(saved);
        if (!parsed.some((item) => item.id === 'media-yt-featured' || item.url.includes('kX3EnAayzDo'))) {
          return [...INITIAL_MEDIA_ITEMS.filter((i) => i.id === 'media-yt-featured'), ...parsed];
        }
        return parsed;
      }
      return INITIAL_MEDIA_ITEMS;
    } catch {
      return INITIAL_MEDIA_ITEMS;
    }
  });

  // Modal open states
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);
  const [isMemberManagerModalOpen, setIsMemberManagerModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
    } catch (e) {
      console.error(e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(schedules));
    } catch (e) {
      console.error(e);
    }
  }, [schedules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MEMOS, JSON.stringify(memos));
    } catch (e) {
      console.error(e);
    }
  }, [memos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DDAYS, JSON.stringify(ddays));
    } catch (e) {
      console.error(e);
    }
  }, [ddays]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DINNER_MENU, dinnerMenu);
    } catch (e) {
      console.error(e);
    }
  }, [dinnerMenu]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(goals));
    } catch (e) {
      console.error(e);
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MEDIA, JSON.stringify(mediaItems));
    } catch (e) {
      console.error(e);
    }
  }, [mediaItems]);

  // Current active member object
  const activeMember = members.find((m) => m.id === activeMemberId) || members[0] || INITIAL_MEMBERS[0];

  // Schedule operations
  const handleAddSchedule = (
    newScheduleData: Omit<ScheduleItem, 'id' | 'createdAt' | 'cheers'>
  ) => {
    const newSchedule: ScheduleItem = {
      ...newScheduleData,
      id: `sch-${Date.now()}`,
      cheers: [],
      createdAt: Date.now(),
    };
    setSchedules((prev) => [newSchedule, ...prev]);
    // Also navigate view date to the schedule's date so user sees it right away
    setCurrentDate(newSchedule.date);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
  };

  const handleAddCheer = (scheduleId: string, emoji: string, message: string) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id !== scheduleId) return s;
        const newCheer = {
          id: `cheer-${Date.now()}`,
          fromMemberId: activeMember.id,
          emoji,
          message,
          timestamp: Date.now(),
        };
        return {
          ...s,
          cheers: [...s.cheers, newCheer],
        };
      })
    );
  };

  const handleAcceptPickup = (scheduleId: string, memberId: string) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id !== scheduleId) return s;
        return {
          ...s,
          pickupStatus: 'accepted',
          acceptedByMemberId: memberId,
        };
      })
    );
  };

  // Member status updates
  const handleUpdateMemberStatus = (
    memberId: string,
    status: string,
    mood: string
  ) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, currentStatus: status, mood } : m))
    );
  };

  // Dinner board operations
  const handleUpdateDinnerStatus = (
    memberId: string,
    choice: DinnerChoice,
    note?: string
  ) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        return {
          ...m,
          todayDinner: choice,
          dinnerNote: note !== undefined ? note : m.dinnerNote,
        };
      })
    );
  };

  const handleUpdateDinnerMenu = (menu: string) => {
    setDinnerMenu(menu);
  };

  // Memo operations
  const handleAddMemo = (content: string, tag: FamilyMemo['tag']) => {
    const newMemo: FamilyMemo = {
      id: `memo-${Date.now()}`,
      fromMemberId: activeMember.id,
      content,
      tag,
      date: currentDate,
      likes: [],
      createdAt: Date.now(),
    };
    setMemos((prev) => [newMemo, ...prev]);
  };

  const handleToggleLikeMemo = (memoId: string, memberId: string) => {
    setMemos((prev) =>
      prev.map((m) => {
        if (m.id !== memoId) return m;
        const alreadyLiked = m.likes.includes(memberId);
        return {
          ...m,
          likes: alreadyLiked
            ? m.likes.filter((id) => id !== memberId)
            : [...m.likes, memberId],
        };
      })
    );
  };

  const handleDeleteMemo = (memoId: string) => {
    setMemos((prev) => prev.filter((m) => m.id !== memoId));
  };

  // Member management operations
  const handleAddMember = (newMember: FamilyMember) => {
    setMembers((prev) => [...prev, newMember]);
    setActiveMemberId(newMember.id);
  };

  const handleUpdateMember = (updated: FamilyMember) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDeleteMember = (memberId: string) => {
    if (members.length <= 1) return;
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    if (activeMemberId === memberId) {
      const remaining = members.filter((m) => m.id !== memberId);
      if (remaining[0]) setActiveMemberId(remaining[0].id);
    }
  };

  // Goal operations
  const handleToggleGoal = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const willComplete = !g.isCompletedToday;
        const newStreak = willComplete ? g.streakDays + 1 : Math.max(0, g.streakDays - 1);
        const newCount = willComplete
          ? (g.currentCount || 0) + 1
          : Math.max(0, (g.currentCount || 1) - 1);
        return {
          ...g,
          isCompletedToday: willComplete,
          streakDays: newStreak,
          currentCount: newCount,
        };
      })
    );
  };

  const handleAddGoal = (
    newGoalData: Omit<MemberGoal, 'id' | 'createdAt' | 'cheerCount' | 'cheeredBy' | 'comments'>
  ) => {
    const newGoal: MemberGoal = {
      ...newGoalData,
      id: `goal-${Date.now()}`,
      cheerCount: 0,
      cheeredBy: [],
      comments: [],
      createdAt: Date.now(),
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const handleCheerGoal = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const alreadyCheered = g.cheeredBy.includes(activeMember.id);
        return {
          ...g,
          cheerCount: alreadyCheered ? Math.max(0, g.cheerCount - 1) : g.cheerCount + 1,
          cheeredBy: alreadyCheered
            ? g.cheeredBy.filter((id) => id !== activeMember.id)
            : [...g.cheeredBy, activeMember.id],
        };
      })
    );
  };

  const handleAddGoalComment = (goalId: string, text: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const newComment = {
          id: `gc-${Date.now()}`,
          fromMemberId: activeMember.id,
          text,
          timestamp: Date.now(),
        };
        return {
          ...g,
          comments: [...(g.comments || []), newComment],
        };
      })
    );
  };

  // Media Gallery operations
  const handleAddMedia = (
    newMediaData: Omit<FamilyMediaItem, 'id' | 'createdAt' | 'likes' | 'reactions' | 'comments'>
  ) => {
    const newMedia: FamilyMediaItem = {
      ...newMediaData,
      id: `media-${Date.now()}`,
      likes: [],
      reactions: [],
      comments: [],
      createdAt: Date.now(),
    };
    setMediaItems((prev) => [newMedia, ...prev]);
  };

  const handleDeleteMedia = (mediaId: string) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== mediaId));
  };

  const handleToggleLikeMedia = (mediaId: string) => {
    setMediaItems((prev) =>
      prev.map((item) => {
        if (item.id !== mediaId) return item;
        const alreadyLiked = item.likes.includes(activeMember.id);
        return {
          ...item,
          likes: alreadyLiked
            ? item.likes.filter((id) => id !== activeMember.id)
            : [...item.likes, activeMember.id],
        };
      })
    );
  };

  const handleAddMediaReaction = (mediaId: string, emoji: string) => {
    setMediaItems((prev) =>
      prev.map((item) => {
        if (item.id !== mediaId) return item;
        const existingReaction = item.reactions.find((r) => r.emoji === emoji);
        let updatedReactions;

        if (existingReaction) {
          const hasReacted = existingReaction.byMemberIds.includes(activeMember.id);
          updatedReactions = item.reactions.map((r) => {
            if (r.emoji !== emoji) return r;
            return {
              ...r,
              byMemberIds: hasReacted
                ? r.byMemberIds.filter((id) => id !== activeMember.id)
                : [...r.byMemberIds, activeMember.id],
            };
          });
        } else {
          updatedReactions = [
            ...item.reactions,
            { emoji, byMemberIds: [activeMember.id] },
          ];
        }

        return {
          ...item,
          reactions: updatedReactions.filter((r) => r.byMemberIds.length > 0),
        };
      })
    );
  };

  const handleAddMediaComment = (mediaId: string, text: string) => {
    setMediaItems((prev) =>
      prev.map((item) => {
        if (item.id !== mediaId) return item;
        const newComment = {
          id: `mc-${Date.now()}`,
          fromMemberId: activeMember.id,
          text,
          timestamp: Date.now(),
        };
        return {
          ...item,
          comments: [...(item.comments || []), newComment],
        };
      })
    );
  };

  // Full data import (restore)
  const handleImportData = (imported: {
    members?: FamilyMember[];
    schedules?: ScheduleItem[];
    memos?: FamilyMemo[];
    goals?: MemberGoal[];
    mediaItems?: FamilyMediaItem[];
    dinnerMenu?: string;
  }) => {
    if (imported.members && Array.isArray(imported.members)) {
      setMembers(imported.members);
      if (imported.members[0]) setActiveMemberId(imported.members[0].id);
    }
    if (imported.schedules && Array.isArray(imported.schedules)) {
      setSchedules(imported.schedules);
    }
    if (imported.memos && Array.isArray(imported.memos)) {
      setMemos(imported.memos);
    }
    if (imported.goals && Array.isArray(imported.goals)) {
      setGoals(imported.goals);
    }
    if (imported.mediaItems && Array.isArray(imported.mediaItems)) {
      setMediaItems(imported.mediaItems);
    }
    if (imported.dinnerMenu) {
      setDinnerMenu(imported.dinnerMenu);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20 selection:bg-pink-300 selection:text-slate-900">
      {/* Sticky Top Header */}
      <Header
        members={members}
        activeMember={activeMember}
        onSelectActiveMember={setActiveMemberId}
        onOpenAddSchedule={() => setIsAddScheduleModalOpen(true)}
        onOpenMemberManager={() => setIsMemberManagerModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        goalCount={goals.length}
        mediaCount={mediaItems.length}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'today' && (
          <>
            <HeroInteractiveSection
              members={members}
              activeMember={activeMember}
              schedules={schedules}
              goals={goals}
              onOpenAddSchedule={() => setIsAddScheduleModalOpen(true)}
              onSelectTab={setActiveTab}
              currentDate={currentDate}
            />
            <TodayTimeline
              schedules={schedules}
              members={members}
              activeMember={activeMember}
              ddays={ddays}
              currentDate={currentDate}
              onChangeDate={setCurrentDate}
              onOpenAddSchedule={() => setIsAddScheduleModalOpen(true)}
              onAddCheer={handleAddCheer}
              onAcceptPickup={handleAcceptPickup}
              onDeleteSchedule={handleDeleteSchedule}
              onUpdateMemberStatus={handleUpdateMemberStatus}
            />
          </>
        )}

        {activeTab === 'goals' && (
          <GoalTracker
            goals={goals}
            members={members}
            activeMember={activeMember}
            onToggleGoal={handleToggleGoal}
            onAddGoal={handleAddGoal}
            onDeleteGoal={handleDeleteGoal}
            onCheerGoal={handleCheerGoal}
            onAddGoalComment={handleAddGoalComment}
          />
        )}

        {activeTab === 'gallery' && (
          <FamilyMediaGallery
            mediaItems={mediaItems}
            members={members}
            activeMember={activeMember}
            onAddMedia={handleAddMedia}
            onDeleteMedia={handleDeleteMedia}
            onToggleLike={handleToggleLikeMedia}
            onAddReaction={handleAddMediaReaction}
            onAddComment={handleAddMediaComment}
          />
        )}

        {activeTab === 'dinner' && (
          <DinnerBoard
            members={members}
            activeMember={activeMember}
            onUpdateDinnerStatus={handleUpdateDinnerStatus}
            dinnerMenu={dinnerMenu}
            onUpdateDinnerMenu={handleUpdateDinnerMenu}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            schedules={schedules}
            members={members}
            selectedDate={currentDate}
            onSelectDate={(date) => {
              setCurrentDate(date);
            }}
            onOpenAddScheduleWithDate={(date) => {
              setCurrentDate(date);
              setIsAddScheduleModalOpen(true);
            }}
          />
        )}

        {activeTab === 'memos' && (
          <FamilyMemoBoard
            memos={memos}
            members={members}
            activeMember={activeMember}
            onAddMemo={handleAddMemo}
            onToggleLikeMemo={handleToggleLikeMemo}
            onDeleteMemo={handleDeleteMemo}
          />
        )}
      </main>

      {/* Modals */}
      <AddScheduleModal
        isOpen={isAddScheduleModalOpen}
        onClose={() => setIsAddScheduleModalOpen(false)}
        members={members}
        activeMember={activeMember}
        onAddSchedule={handleAddSchedule}
      />

      <MemberManagerModal
        isOpen={isMemberManagerModalOpen}
        onClose={() => setIsMemberManagerModalOpen(false)}
        members={members}
        onAddMember={handleAddMember}
        onUpdateMember={handleUpdateMember}
        onDeleteMember={handleDeleteMember}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        members={members}
        schedules={schedules}
        memos={memos}
        goals={goals}
        mediaItems={mediaItems}
        dinnerMenu={dinnerMenu}
        currentDate={currentDate}
        onImportData={handleImportData}
      />

      {/* Floating Bottom Bar for Quick Schedule Entry on Mobile */}
      <div className="fixed bottom-4 right-4 sm:hidden z-20">
        <button
          id="btn-floating-add"
          onClick={() => setIsAddScheduleModalOpen(true)}
          className="w-14 h-14 rounded-full bg-slate-900 text-yellow-300 border-2 border-slate-900 flex items-center justify-center text-2xl font-black pop-shadow-lg active:scale-95"
        >
          ⚡
        </button>
      </div>
    </div>
  );
}
