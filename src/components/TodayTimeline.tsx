import React, { useState } from 'react';
import { FamilyMember, ScheduleItem, DDayEvent } from '../types';
import { CHEER_STICKERS, getOffsetDateString } from '../data/initialData';
import {
  Clock,
  MapPin,
  Car,
  Heart,
  MessageCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface TodayTimelineProps {
  schedules: ScheduleItem[];
  members: FamilyMember[];
  activeMember: FamilyMember;
  ddays: DDayEvent[];
  currentDate: string;
  onChangeDate: (date: string) => void;
  onOpenAddSchedule: () => void;
  onAddCheer: (scheduleId: string, emoji: string, message: string) => void;
  onAcceptPickup: (scheduleId: string, memberId: string) => void;
  onDeleteSchedule: (scheduleId: string) => void;
  onUpdateMemberStatus: (memberId: string, status: string, mood: string) => void;
}

export const TodayTimeline: React.FC<TodayTimelineProps> = ({
  schedules,
  members,
  activeMember,
  ddays,
  currentDate,
  onChangeDate,
  onOpenAddSchedule,
  onAddCheer,
  onAcceptPickup,
  onDeleteSchedule,
  onUpdateMemberStatus,
}) => {
  const [selectedFilterMemberId, setSelectedFilterMemberId] = useState<string>('all');
  const [cheeringScheduleId, setCheeringScheduleId] = useState<string | null>(null);
  const [customCheerText, setCustomCheerText] = useState('');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState(activeMember.currentStatus);
  const [tempMood, setTempMood] = useState(activeMember.mood);

  // Filter schedules for the active date
  const daySchedules = schedules
    .filter((s) => s.date === currentDate)
    .filter((s) => (selectedFilterMemberId === 'all' ? true : s.memberId === selectedFilterMemberId))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const isToday = currentDate === getOffsetDateString(0);

  const dateObj = new Date(currentDate + 'T00:00:00');
  const dateFormatted = dateObj.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  const handlePrevDay = () => {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    onChangeDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    onChangeDate(d.toISOString().split('T')[0]);
  };

  const handleQuickCheer = (scheduleId: string, emoji: string, defaultMsg: string) => {
    onAddCheer(scheduleId, emoji, customCheerText.trim() || defaultMsg);
    setCheeringScheduleId(null);
    setCustomCheerText('');
  };

  const handleSaveStatus = () => {
    onUpdateMemberStatus(activeMember.id, tempStatus, tempMood);
    setIsEditingStatus(false);
  };

  return (
    <div className="space-y-5">
      {/* Top D-Day Countdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {ddays.map((dday) => {
          const target = new Date(dday.date + 'T00:00:00');
          const today = new Date(getOffsetDateString(0) + 'T00:00:00');
          const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const badgeText =
            diffDays === 0 ? 'D-DAY' : diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;

          return (
            <div
              key={dday.id}
              className="bg-white rounded-2xl border-2 border-slate-900 p-3 flex items-center justify-between pop-shadow-sm"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-2xl">{dday.emoji}</span>
                <div className="truncate">
                  <span className="text-xs sm:text-sm font-black text-slate-900 truncate block">
                    {dday.title}
                  </span>
                  <span className="text-[11px] text-slate-500 font-bold">
                    {dday.date}
                  </span>
                </div>
              </div>
              <span
                className="px-2.5 py-1 text-xs font-black rounded-lg border border-slate-900 text-white shrink-0 shadow-[1px_1px_0px_#0F172A]"
                style={{ backgroundColor: dday.color }}
              >
                {badgeText}
              </span>
            </div>
          );
        })}
      </div>

      {/* Live Family Status Bar: "지금 어디야?" */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 p-4 sm:p-5 pop-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b-2 border-slate-900">
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                실시간 우리 가족 상태 & 무드
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                서로 어디에 있는지 알고 안심하는 실시간 핑
              </p>
            </div>
          </div>

          <button
            id="btn-edit-my-status"
            onClick={() => {
              setTempStatus(activeMember.currentStatus);
              setTempMood(activeMember.mood);
              setIsEditingStatus(!isEditingStatus);
            }}
            className="text-xs font-black px-3 py-1.5 bg-yellow-300 text-slate-900 border border-slate-900 rounded-xl hover:bg-yellow-400 pop-shadow-sm self-start sm:self-auto"
          >
            ✏️ 내 위치/무드 변경
          </button>
        </div>

        {/* Quick status editor for active user */}
        {isEditingStatus && (
          <div className="mb-4 p-3 bg-slate-50 rounded-2xl border-2 border-slate-900 flex flex-col sm:flex-row gap-2">
            <input
              id="input-member-status"
              type="text"
              value={tempStatus}
              onChange={(e) => setTempStatus(e.target.value)}
              placeholder="현재 위치 (예: 독서실 32번석, 학교, 퇴근중)"
              className="text-xs font-bold px-3 py-2 bg-white border border-slate-900 rounded-xl w-full"
            />
            <input
              id="input-member-mood"
              type="text"
              value={tempMood}
              onChange={(e) => setTempMood(e.target.value)}
              placeholder="오늘의 한줄 무드 (예: 수학 버닝 🔥, 피곤쓰 🥱)"
              className="text-xs font-bold px-3 py-2 bg-white border border-slate-900 rounded-xl w-full"
            />
            <button
              id="btn-save-member-status"
              onClick={handleSaveStatus}
              className="px-4 py-2 text-xs font-black bg-slate-900 text-white rounded-xl hover:bg-slate-800 shrink-0"
            >
              저장
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {members.map((m) => (
            <div
              key={m.id}
              className="p-3 rounded-2xl border-2 border-slate-900 flex flex-col justify-between transition-all"
              style={{ backgroundColor: m.bgLight }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{m.avatar}</span>
                  <div className="truncate">
                    <span className="text-xs font-black text-slate-900 block truncate">
                      {m.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold block">
                      {m.gradeBadge || m.role}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-black text-slate-900 bg-white/90 px-2 py-1 rounded-lg border border-slate-900/30 truncate">
                  📍 {m.currentStatus || '집'}
                </div>
              </div>
              <div className="text-[11px] text-slate-600 font-bold mt-2 truncate">
                {m.mood}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date Navigator & Timeline Container */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 p-4 sm:p-6 pop-shadow">
        {/* Date Selector Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-slate-900">
          <div className="flex items-center gap-2">
            <button
              id="btn-prev-day"
              onClick={handlePrevDay}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 flex items-center justify-center pop-shadow-sm font-black"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 font-display tracking-tight">
                {dateFormatted}
              </h2>
              {isToday ? (
                <span className="px-2 py-0.5 text-xs font-black bg-rose-500 text-white rounded-full border border-slate-900 shadow-[1px_1px_0px_#0F172A]">
                  TODAY
                </span>
              ) : (
                <button
                  id="btn-go-today"
                  onClick={() => onChangeDate(getOffsetDateString(0))}
                  className="px-2 py-0.5 text-xs font-black bg-yellow-300 text-slate-900 rounded-lg border border-slate-900 hover:bg-yellow-400"
                >
                  오늘로 이동
                </button>
              )}
            </div>

            <button
              id="btn-next-day"
              onClick={handleNextDay}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 flex items-center justify-center pop-shadow-sm font-black"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Member Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              id="filter-all"
              onClick={() => setSelectedFilterMemberId('all')}
              className={`px-3 py-1 text-xs font-black rounded-xl border-2 transition-all ${
                selectedFilterMemberId === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 pop-shadow-sm'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-slate-800'
              }`}
            >
              전체 일정 ({daySchedules.length})
            </button>
            {members.map((m) => {
              const isSelected = selectedFilterMemberId === m.id;
              return (
                <button
                  key={m.id}
                  id={`filter-member-${m.id}`}
                  onClick={() => setSelectedFilterMemberId(m.id)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-xl border-2 transition-all flex items-center gap-1 shrink-0 ${
                    isSelected
                      ? 'border-slate-900 pop-shadow-sm font-black text-slate-900'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-800'
                  }`}
                  style={{
                    backgroundColor: isSelected ? m.bgLight : undefined,
                  }}
                >
                  <span>{m.avatar}</span>
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule List / Empty State */}
        <div className="mt-5 space-y-3.5">
          {daySchedules.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
              <span className="text-4xl block mb-2">🎈</span>
              <h4 className="text-base font-black text-slate-800 mb-1">
                등록된 일정이 아직 없어요!
              </h4>
              <p className="text-xs text-slate-500 font-medium mb-4">
                학원, 독서실, 약속을 1초 만에 등록하고 가족들과 공유해보세요.
              </p>
              <button
                id="btn-add-schedule-empty"
                onClick={onOpenAddSchedule}
                className="px-4 py-2 text-xs font-black bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl border-2 border-slate-900 pop-shadow-sm pop-shadow-hover"
              >
                + 지금 1초 스케줄 등록하기
              </button>
            </div>
          ) : (
            daySchedules.map((schedule) => {
              const owner = members.find((m) => m.id === schedule.memberId);
              const isCheerDrawerOpen = cheeringScheduleId === schedule.id;

              return (
                <div
                  key={schedule.id}
                  className="bg-white rounded-2xl border-2 border-slate-900 p-4 pop-shadow-hover relative transition-all"
                  style={{ borderLeftWidth: '8px', borderLeftColor: owner?.color || '#0F172A' }}
                >
                  {/* Card Header: Owner Info & Category Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-9 h-9 rounded-xl border-2 border-slate-900 flex items-center justify-center text-lg pop-shadow-sm"
                        style={{ backgroundColor: owner?.bgLight || '#F1F5F9' }}
                      >
                        {schedule.categoryIcon || owner?.avatar || '📌'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900">
                            {owner?.name}
                          </span>
                          {owner?.gradeBadge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 border border-slate-400 rounded">
                              {owner.gradeBadge}
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-black text-slate-900">
                          {schedule.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        id={`btn-delete-schedule-${schedule.id}`}
                        onClick={() => onDeleteSchedule(schedule.id)}
                        title="일정 삭제"
                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Time & Location */}
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-700 mb-2">
                    <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg border border-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {schedule.startTime} ~ {schedule.endTime}
                      </span>
                    </div>

                    {schedule.location && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg border border-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate max-w-[200px]">
                          {schedule.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Note */}
                  {schedule.note && (
                    <p className="text-xs text-slate-600 font-medium bg-amber-50/70 p-2 rounded-xl border border-amber-200 mb-2">
                      📝 {schedule.note}
                    </p>
                  )}

                  {/* Tags */}
                  {schedule.tags && schedule.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {schedule.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Pickup SOS Section (If pickup requested) */}
                  {schedule.isPickupNeeded && (
                    <div className="mt-2 mb-3 p-2.5 rounded-xl border-2 border-rose-400 bg-rose-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-rose-900">
                              🚗 픽업 SOS 요청
                            </span>
                            {schedule.pickupStatus === 'accepted' ? (
                              <span className="text-[10px] font-black px-1.5 py-0.2 bg-emerald-500 text-white rounded">
                                접수완료
                              </span>
                            ) : (
                              <span className="text-[10px] font-black px-1.5 py-0.2 bg-amber-500 text-white rounded animate-pulse">
                                대기중
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-rose-800 font-medium">
                            {schedule.pickupNote || '끝나는 시간에 픽업 부탁해요!'}
                          </span>
                        </div>
                      </div>

                      {schedule.pickupStatus === 'accepted' ? (
                        <div className="text-xs font-black text-emerald-800 flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {members.find((m) => m.id === schedule.acceptedByMemberId)?.name || '가족'} 님이 픽업하기로 했어요!
                          </span>
                        </div>
                      ) : (
                        <button
                          id={`btn-accept-pickup-${schedule.id}`}
                          onClick={() => onAcceptPickup(schedule.id, activeMember.id)}
                          className="px-3 py-1.5 text-xs font-black bg-rose-500 text-white border border-rose-900 rounded-lg pop-shadow-sm hover:bg-rose-600 shrink-0"
                        >
                          🚗 내가 픽업할게! (수락)
                        </button>
                      )}
                    </div>
                  )}

                  {/* Cheers & Encouragement Stickers */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {schedule.cheers && schedule.cheers.length > 0 ? (
                        schedule.cheers.map((ch) => {
                          const cheerer = members.find((m) => m.id === ch.fromMemberId);
                          return (
                            <div
                              key={ch.id}
                              title={`${cheerer?.name || '가족'}: ${ch.message}`}
                              className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 border border-yellow-300 rounded-full text-xs font-bold text-slate-800 pop-shadow-sm"
                            >
                              <span>{ch.emoji}</span>
                              <span className="text-[11px] text-slate-600 font-medium truncate max-w-[120px]">
                                {ch.message}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          아직 응원 스티커가 없어요!
                        </span>
                      )}
                    </div>

                    <button
                      id={`btn-open-cheer-${schedule.id}`}
                      onClick={() =>
                        setCheeringScheduleId(isCheerDrawerOpen ? null : schedule.id)
                      }
                      className="flex items-center gap-1 text-xs font-black text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg border border-pink-200 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>응원 날리기</span>
                    </button>
                  </div>

                  {/* Cheer Drawer / Popover */}
                  {isCheerDrawerOpen && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 rounded-xl border-2 border-slate-900">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                          <span>{activeMember.name} 님의 응원 보내기:</span>
                        </span>
                        <button
                          onClick={() => setCheeringScheduleId(null)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800"
                        >
                          닫기
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2">
                        {CHEER_STICKERS.map((st) => (
                          <button
                            key={st.emoji}
                            onClick={() =>
                              handleQuickCheer(schedule.id, st.emoji, st.label)
                            }
                            className="p-1.5 bg-white border border-slate-800 rounded-lg hover:bg-yellow-100 text-left flex items-center gap-1.5 transition-colors"
                          >
                            <span className="text-base">{st.emoji}</span>
                            <span className="text-[11px] font-bold text-slate-800 truncate">
                              {st.label}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={customCheerText}
                          onChange={(e) => setCustomCheerText(e.target.value)}
                          placeholder="직접 메시지 쓰기 (예: 치킨 시켜줄까?)"
                          className="text-xs px-2.5 py-1.5 bg-white border border-slate-900 rounded-lg w-full font-medium"
                        />
                        <button
                          onClick={() =>
                            handleQuickCheer(schedule.id, '💖', '화이팅!')
                          }
                          className="px-3 py-1.5 text-xs font-black bg-pink-500 text-white rounded-lg hover:bg-pink-600 shrink-0"
                        >
                          전송
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
