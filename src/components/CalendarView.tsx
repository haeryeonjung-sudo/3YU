import React, { useState } from 'react';
import { FamilyMember, ScheduleItem } from '../types';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin } from 'lucide-react';

interface CalendarViewProps {
  schedules: ScheduleItem[];
  members: FamilyMember[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenAddScheduleWithDate: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  schedules,
  members,
  selectedDate,
  onSelectDate,
  onOpenAddScheduleWithDate,
}) => {
  // Calendar month state
  const [currentYearMonth, setCurrentYearMonth] = useState(() => {
    const d = new Date(selectedDate || Date.now());
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const [filterMemberId, setFilterMemberId] = useState<string>('all');

  const { year, month } = currentYearMonth;

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentYearMonth((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setCurrentYearMonth((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const handleGoToday = () => {
    const today = new Date();
    setCurrentYearMonth({ year: today.getFullYear(), month: today.getMonth() });
    onSelectDate(today.toISOString().split('T')[0]);
  };

  // Generate calendar grid
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  // Previous month padding
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ day: d, dateStr, isCurrentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ day: d, dateStr, isCurrentMonth: true });
  }

  // Next month padding to fill complete weeks (up to 35 or 42)
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ day: d, dateStr, isCurrentMonth: false });
  }

  const selectedDaySchedules = schedules
    .filter((s) => s.date === selectedDate)
    .filter((s) => (filterMemberId === 'all' ? true : s.memberId === filterMemberId))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const weekHeaders = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl border-2 border-slate-900 p-4 sm:p-6 pop-shadow">
        {/* Calendar Nav Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b-2 border-slate-900">
          <div className="flex items-center gap-2">
            <button
              id="btn-prev-month"
              onClick={handlePrevMonth}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 flex items-center justify-center pop-shadow-sm font-black"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight">
              {year}년 {month + 1}월
            </h2>
            <button
              id="btn-next-month"
              onClick={handleNextMonth}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 flex items-center justify-center pop-shadow-sm font-black"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              id="btn-cal-today"
              onClick={handleGoToday}
              className="px-2.5 py-1 text-xs font-black bg-yellow-300 hover:bg-yellow-400 text-slate-900 border border-slate-900 rounded-lg ml-1"
            >
              오늘
            </button>
          </div>

          {/* Member Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setFilterMemberId('all')}
              className={`px-3 py-1 text-xs font-black rounded-xl border-2 transition-all ${
                filterMemberId === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 pop-shadow-sm'
                  : 'bg-white text-slate-600 border-slate-300'
              }`}
            >
              전체
            </button>
            {members.map((m) => {
              const isSelected = filterMemberId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setFilterMemberId(m.id)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-xl border-2 transition-all flex items-center gap-1 shrink-0 ${
                    isSelected
                      ? 'border-slate-900 pop-shadow-sm font-black text-slate-900'
                      : 'border-slate-300 bg-white text-slate-600'
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

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekHeaders.map((w, idx) => (
            <div
              key={w}
              className={`text-xs font-black py-1.5 ${
                idx === 0 ? 'text-rose-500' : idx === 6 ? 'text-blue-500' : 'text-slate-700'
              }`}
            >
              {w}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {calendarDays.map((cell) => {
            const isSelected = cell.dateStr === selectedDate;
            const isToday = cell.dateStr === new Date().toISOString().split('T')[0];

            // Get schedules on this date
            const daySchedules = schedules.filter((s) => {
              if (s.date !== cell.dateStr) return false;
              if (filterMemberId !== 'all' && s.memberId !== filterMemberId) return false;
              return true;
            });

            return (
              <button
                key={cell.dateStr}
                onClick={() => onSelectDate(cell.dateStr)}
                className={`min-h-[70px] sm:min-h-[85px] p-1.5 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-slate-900 bg-amber-100 pop-shadow-sm scale-102 font-black'
                    : cell.isCurrentMonth
                    ? 'border-slate-200 bg-white hover:border-slate-400'
                    : 'border-slate-100 bg-slate-50 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs sm:text-sm font-black ${
                      isToday
                        ? 'w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs'
                        : 'text-slate-800'
                    }`}
                  >
                    {cell.day}
                  </span>
                  {daySchedules.length > 0 && (
                    <span className="text-[10px] font-black text-slate-500">
                      {daySchedules.length}건
                    </span>
                  )}
                </div>

                {/* Dots / Schedule previews */}
                <div className="space-y-0.5 mt-1 overflow-hidden">
                  {daySchedules.slice(0, 2).map((s) => {
                    const owner = members.find((m) => m.id === s.memberId);
                    return (
                      <div
                        key={s.id}
                        className="text-[10px] font-bold px-1 py-0.2 rounded truncate flex items-center gap-0.5 text-slate-900"
                        style={{ backgroundColor: owner?.bgLight || '#E2E8F0' }}
                      >
                        <span>{s.categoryIcon}</span>
                        <span className="truncate">{s.title}</span>
                      </div>
                    );
                  })}
                  {daySchedules.length > 2 && (
                    <div className="text-[9px] font-bold text-slate-500 pl-1">
                      +{daySchedules.length - 2}개 더보기
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Schedule Detail List */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 p-4 sm:p-6 pop-shadow">
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-900">
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {selectedDate} 일정 목록
              </h3>
              <span className="text-xs text-slate-500 font-bold">
                총 {selectedDaySchedules.length}개의 일정
              </span>
            </div>
          </div>

          <button
            id="btn-add-for-selected-date"
            onClick={() => onOpenAddScheduleWithDate(selectedDate)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-black bg-slate-900 text-white rounded-xl pop-shadow-sm hover:bg-slate-800"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>이 날짜에 추가</span>
          </button>
        </div>

        {selectedDaySchedules.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs font-bold">
            이 날짜에는 등록된 가족 일정이 없어요.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedDaySchedules.map((s) => {
              const owner = members.find((m) => m.id === s.memberId);
              return (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl border-2 border-slate-900 bg-white pop-shadow-sm flex items-start gap-3"
                  style={{ borderLeftWidth: '6px', borderLeftColor: owner?.color || '#000' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl border border-slate-900 flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: owner?.bgLight || '#F1F5F9' }}
                  >
                    {s.categoryIcon}
                  </div>
                  <div className="truncate flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">
                        {owner?.name}
                      </span>
                      <span className="text-[11px] text-slate-500 font-bold">
                        {s.startTime} ~ {s.endTime}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 truncate">
                      {s.title}
                    </h4>
                    {s.location && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3" />
                        {s.location}
                      </p>
                    )}
                    {s.isPickupNeeded && (
                      <span className="inline-block mt-1 text-[10px] font-black px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded border border-rose-300">
                        🚗 픽업 요청됨
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
