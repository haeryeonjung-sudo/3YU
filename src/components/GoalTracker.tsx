import React, { useState } from 'react';
import { MemberGoal, FamilyMember } from '../types';
import {
  CheckCircle2,
  Circle,
  Flame,
  Trophy,
  Plus,
  Trash2,
  Heart,
  MessageCircle,
  Gift,
  TrendingUp,
  Sparkles,
  Send,
  Target,
} from 'lucide-react';

interface GoalTrackerProps {
  goals: MemberGoal[];
  members: FamilyMember[];
  activeMember: FamilyMember;
  onToggleGoal: (goalId: string) => void;
  onAddGoal: (goal: Omit<MemberGoal, 'id' | 'createdAt' | 'cheerCount' | 'cheeredBy' | 'comments'>) => void;
  onDeleteGoal: (goalId: string) => void;
  onCheerGoal: (goalId: string) => void;
  onAddGoalComment: (goalId: string, text: string) => void;
}

export const GoalTracker: React.FC<GoalTrackerProps> = ({
  goals,
  members,
  activeMember,
  onToggleGoal,
  onAddGoal,
  onDeleteGoal,
  onCheerGoal,
  onAddGoalComment,
}) => {
  const [selectedFilterMemberId, setSelectedFilterMemberId] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [openCommentGoalId, setOpenCommentGoalId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Form State for new goal
  const [newTitle, setNewTitle] = useState('');
  const [newMemberId, setNewMemberId] = useState(activeMember.id);
  const [newCategory, setNewCategory] = useState<MemberGoal['category']>('study');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📐');
  const [newFrequency, setNewFrequency] = useState<MemberGoal['frequency']>('daily');
  const [newTargetCount, setNewTargetCount] = useState<number>(7);
  const [newRewardNote, setNewRewardNote] = useState('');

  const categoryPresets: {
    category: MemberGoal['category'];
    label: string;
    icon: string;
    suggestedTitle: string;
    reward: string;
  }[] = [
    {
      category: 'study',
      label: '공부/학습 📐',
      icon: '📐',
      suggestedTitle: '매일 수학 기출 10문제 풀기',
      reward: '주말 엽떡 & 허니콤보 치킨 파티!',
    },
    {
      category: 'habit',
      label: '수면/생활습관 ⏰',
      icon: '🌙',
      suggestedTitle: '밤 11시 반에 폰 끄고 꿀잠 자기',
      reward: '원하는 폰 케이스 선물 🎁',
    },
    {
      category: 'exercise',
      label: '운동/체력 🏀',
      icon: '🏀',
      suggestedTitle: '주 3회 30분 달리기 or 홈트',
      reward: '새 운동화 or 용돈 보너스 💸',
    },
    {
      category: 'life',
      label: '정리/집안일 🧹',
      icon: '🧹',
      suggestedTitle: '자기 방 책상 & 침대 매일 정돈하기',
      reward: '방 꾸미기 소품 지원 ✨',
    },
    {
      category: 'mind',
      label: '독서/마인드 📖',
      icon: '📖',
      suggestedTitle: '하루 20분 자유 독서하기',
      reward: '좋아하는 책 & 서점 데이트 📚',
    },
  ];

  const handleApplyPreset = (preset: typeof categoryPresets[0]) => {
    setNewCategory(preset.category);
    setNewCategoryIcon(preset.icon);
    setNewTitle(preset.suggestedTitle);
    setNewRewardNote(preset.reward);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddGoal({
      memberId: newMemberId,
      title: newTitle.trim(),
      category: newCategory,
      categoryIcon: newCategoryIcon,
      frequency: newFrequency,
      targetCount: Number(newTargetCount) || 7,
      currentCount: 0,
      isCompletedToday: false,
      streakDays: 0,
      rewardNote: newRewardNote.trim() || undefined,
    });

    setNewTitle('');
    setNewRewardNote('');
    setIsAddOpen(false);
  };

  const handleSendComment = (goalId: string) => {
    if (!commentInput.trim()) return;
    onAddGoalComment(goalId, commentInput.trim());
    setCommentInput('');
  };

  const filteredGoals = goals.filter((g) =>
    selectedFilterMemberId === 'all' ? true : g.memberId === selectedFilterMemberId
  );

  // Stats calculation
  const totalGoals = goals.length;
  const completedTodayCount = goals.filter((g) => g.isCompletedToday).length;
  const highestStreak = goals.reduce((max, g) => Math.max(max, g.streakDays), 0);
  const overallRate = totalGoals > 0 ? Math.round((completedTodayCount / totalGoals) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 rounded-3xl p-5 sm:p-6 border-2 border-slate-900 pop-shadow relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-900 rounded-full text-xs font-black text-slate-900 pop-shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>우리 가족 목표 & 습관 챌린지</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              오늘의 목표 달성률 <span className="underline decoration-pink-500 decoration-4">{overallRate}%</span> 달성 중! 🔥
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              서로 응원과 칭찬을 날려주고, 달성 시 약속된 보상 파티를 열어보세요!
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="bg-white px-3.5 py-2.5 rounded-2xl border-2 border-slate-900 pop-shadow-sm text-center min-w-[90px]">
              <div className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 오늘 완료
              </div>
              <div className="text-xl font-black text-slate-900">
                {completedTodayCount} <span className="text-xs text-slate-400">/ {totalGoals}</span>
              </div>
            </div>

            <div className="bg-white px-3.5 py-2.5 rounded-2xl border-2 border-slate-900 pop-shadow-sm text-center min-w-[90px]">
              <div className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> 최장 연속
              </div>
              <div className="text-xl font-black text-rose-600">
                {highestStreak}일 🔥
              </div>
            </div>

            <button
              id="btn-open-add-goal"
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-3 bg-slate-900 text-yellow-300 rounded-2xl border-2 border-slate-900 font-black text-sm pop-shadow-sm pop-shadow-hover hover:bg-slate-800 flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>새 목표 등록</span>
            </button>
          </div>
        </div>
      </div>

      {/* Member Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          id="btn-filter-goal-all"
          onClick={() => setSelectedFilterMemberId('all')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black border-2 transition-all shrink-0 ${
            selectedFilterMemberId === 'all'
              ? 'bg-slate-900 text-white border-slate-900 pop-shadow-sm'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-800'
          }`}
        >
          🌟 전체 가족 목표 ({goals.length})
        </button>

        {members.map((member) => {
          const isSelected = selectedFilterMemberId === member.id;
          const memberGoalCount = goals.filter((g) => g.memberId === member.id).length;
          return (
            <button
              key={member.id}
              id={`btn-filter-goal-${member.id}`}
              onClick={() => setSelectedFilterMemberId(member.id)}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-black border-2 transition-all flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? 'border-slate-900 pop-shadow-sm scale-105'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-600'
              }`}
              style={{
                backgroundColor: isSelected ? member.bgLight : undefined,
              }}
            >
              <span>{member.avatar}</span>
              <span>{member.name}</span>
              <span className="text-[11px] px-1.5 py-0.2 bg-slate-900/10 rounded-full">
                {memberGoalCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGoals.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border-2 border-dashed border-slate-300 p-8 text-center space-y-3">
            <div className="text-4xl">🎯</div>
            <h3 className="text-lg font-black text-slate-800">등록된 목표가 아직 없습니다</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              "수학 10문제 풀기", "물 2L 마시기", "11시 반 취침" 등 가족 모두의 목표를 등록해보세요!
            </p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2 bg-pink-500 text-white font-black text-xs rounded-xl border-2 border-slate-900 pop-shadow-sm inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> 첫 목표 등록하기
            </button>
          </div>
        ) : (
          filteredGoals.map((goal) => {
            const member = members.find((m) => m.id === goal.memberId) || activeMember;
            const isMyGoal = goal.memberId === activeMember.id;
            const hasCheered = goal.cheeredBy.includes(activeMember.id);
            const isCommentsOpen = openCommentGoalId === goal.id;

            return (
              <div
                key={goal.id}
                id={`goal-card-${goal.id}`}
                className={`bg-white rounded-3xl border-2 border-slate-900 p-4 sm:p-5 transition-all relative ${
                  goal.isCompletedToday
                    ? 'bg-emerald-50/40 border-emerald-900 shadow-[3px_3px_0px_#059669]'
                    : 'pop-shadow'
                }`}
              >
                {/* Header: Member Avatar & Category & Streak */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl p-1.5 rounded-xl border border-slate-900 bg-white shadow-[1px_1px_0px_#0F172A]">
                      {member.avatar}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900">{member.name}</span>
                        {member.gradeBadge && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 rounded-md font-bold text-slate-600 border border-slate-300">
                            {member.gradeBadge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold">
                        {goal.frequency === 'daily' ? '매일 챌린지' : '주간 챌린지'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Streak Badge */}
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 border border-amber-400 rounded-full text-xs font-black text-amber-900 shadow-[1px_1px_0px_#B45309]">
                      <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
                      <span>{goal.streakDays}일 연속</span>
                    </div>

                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="목표 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Main Check Action & Title */}
                <div className="flex items-start gap-3 mb-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <button
                    id={`btn-toggle-goal-${goal.id}`}
                    onClick={() => onToggleGoal(goal.id)}
                    className={`mt-0.5 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 active:scale-95 ${
                      goal.isCompletedToday
                        ? 'bg-emerald-500 text-white border-slate-900 shadow-[2px_2px_0px_#0F172A]'
                        : 'bg-white text-slate-300 border-slate-400 hover:border-slate-800'
                    }`}
                    title={isMyGoal ? '오늘 달성 완료 체크!' : '가족 목표 체크'}
                  >
                    {goal.isCompletedToday ? (
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm sm:text-base font-black transition-all ${
                        goal.isCompletedToday
                          ? 'text-emerald-900 line-through decoration-emerald-500 decoration-2'
                          : 'text-slate-900'
                      }`}
                    >
                      {goal.title}
                    </h4>

                    {/* Reward Promise Box */}
                    {goal.rewardNote && (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-pink-100/80 border border-pink-300 rounded-lg text-xs font-bold text-pink-900">
                        <Gift className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                        <span className="truncate">보상: {goal.rewardNote}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Bar: Target Progress */}
                {goal.targetCount && goal.targetCount > 0 && (
                  <div className="mb-3 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600">
                      <span>누적 달성 현황</span>
                      <span className="font-black text-slate-900">
                        {goal.currentCount || 0} / {goal.targetCount}회 ({Math.min(100, Math.round(((goal.currentCount || 0) / goal.targetCount) * 100))}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-400">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (((goal.currentCount || 0) / goal.targetCount) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Social Cheering & Comments Bar */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-cheer-goal-${goal.id}`}
                      onClick={() => onCheerGoal(goal.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                        hasCheered
                          ? 'bg-rose-100 text-rose-700 border-rose-400'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-rose-400 hover:text-rose-600'
                      }`}
                      title="응원 하트 날리기"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          hasCheered ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                      <span>응원 {goal.cheerCount}</span>
                    </button>

                    <button
                      onClick={() =>
                        setOpenCommentGoalId(isCommentsOpen ? null : goal.id)
                      }
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-white text-slate-600 border border-slate-300 hover:border-slate-500 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                      <span>한줄 칭찬 ({goal.comments?.length || 0})</span>
                    </button>
                  </div>

                  {goal.isCompletedToday ? (
                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      🎉 오늘 미션 완료!
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      ⚡ 도전 진행중
                    </span>
                  )}
                </div>

                {/* Expandable Comments Drawer */}
                {isCommentsOpen && (
                  <div className="mt-3 pt-3 border-t border-dashed border-slate-200 space-y-2">
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {(!goal.comments || goal.comments.length === 0) && (
                        <p className="text-xs text-slate-400 text-center py-2">
                          가족의 첫 번째 칭찬과 응원 메시지를 남겨보세요! ✨
                        </p>
                      )}
                      {goal.comments?.map((comment) => {
                        const commenter = members.find((m) => m.id === comment.fromMemberId);
                        return (
                          <div
                            key={comment.id}
                            className="flex items-start gap-2 text-xs bg-slate-50 p-2 rounded-xl border border-slate-200"
                          >
                            <span className="text-sm">{commenter?.avatar || '👤'}</span>
                            <div className="flex-1 leading-tight">
                              <span className="font-black text-slate-800 mr-1">
                                {commenter?.name || '가족'}:
                              </span>
                              <span className="text-slate-700">{comment.text}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSendComment(goal.id);
                          }
                        }}
                        placeholder="멋진 응원 한마디 (예: 마라탕 쏜다!)"
                        className="flex-1 px-3 py-1.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900"
                      />
                      <button
                        onClick={() => handleSendComment(goal.id)}
                        className="px-2.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Goal Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl border-2 border-slate-900 p-6 pop-shadow-lg max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">새 목표 & 습관 챌린지</h3>
                  <p className="text-xs text-slate-500 font-bold">
                    목표를 정하고 가족과 함께 칭찬과 보상을 나눠보세요!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 rounded-xl border-2 border-slate-900 flex items-center justify-center font-black text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1.5">
                ⚡ 1초 추천 프리셋 선택
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categoryPresets.map((preset) => (
                  <button
                    type="button"
                    key={preset.category}
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1.5 rounded-xl border-2 border-slate-800 text-xs font-bold bg-amber-50 hover:bg-amber-100 flex items-center gap-1 transition-all"
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              {/* Member Selector */}
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  도전자 선택
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {members.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setNewMemberId(m.id)}
                      className={`p-2 rounded-xl border-2 text-xs font-black flex items-center gap-1.5 transition-all ${
                        newMemberId === m.id
                          ? 'border-slate-900 pop-shadow-sm font-black'
                          : 'border-slate-300 bg-white text-slate-600'
                      }`}
                      style={{
                        backgroundColor: newMemberId === m.id ? m.bgLight : undefined,
                      }}
                    >
                      <span className="text-base">{m.avatar}</span>
                      <span className="truncate">{m.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Title */}
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  목표 내용
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 매일 수학 10문제 & 단어 30개 암기"
                  className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 rounded-xl border-2 border-slate-900 focus:outline-none focus:bg-white"
                  required
                />
              </div>

              {/* Frequency & Target */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">
                    주기
                  </label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value as MemberGoal['frequency'])}
                    className="w-full px-3 py-2 text-xs font-bold bg-slate-50 rounded-xl border-2 border-slate-900 focus:outline-none"
                  >
                    <option value="daily">매일 실천 (Daily)</option>
                    <option value="weekly">주간 목표 (Weekly)</option>
                    <option value="dday">시험/D-Day 전까지</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">
                    목표 횟수 (연속일/회)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newTargetCount}
                    onChange={(e) => setNewTargetCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold bg-slate-50 rounded-xl border-2 border-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Reward Note */}
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-pink-500" />
                  <span>달성 시 약속된 가족 보상 (선택)</span>
                </label>
                <input
                  type="text"
                  value={newRewardNote}
                  onChange={(e) => setNewRewardNote(e.target.value)}
                  placeholder="예: 7일 성공 시 마라탕 & 코노 쏜다! 🍗"
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-pink-50/50 rounded-xl border-2 border-pink-300 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 rounded-xl border-2 border-slate-300 hover:bg-slate-100"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-black text-white bg-slate-900 rounded-xl border-2 border-slate-900 pop-shadow-sm hover:bg-slate-800 active:translate-y-0.5"
                >
                  목표 등록하기 🔥
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
