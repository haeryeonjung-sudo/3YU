import React, { useState } from 'react';
import { FamilyMember, ScheduleItem, ScheduleCategory } from '../types';
import { TEEN_QUICK_PRESETS, QuickPreset, getOffsetDateString } from '../data/initialData';
import { X, Sparkles, Clock, MapPin, Tag, Car, Zap, Check } from 'lucide-react';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  activeMember: FamilyMember;
  onAddSchedule: (schedule: Omit<ScheduleItem, 'id' | 'createdAt' | 'cheers'>) => void;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  isOpen,
  onClose,
  members,
  activeMember,
  onAddSchedule,
}) => {
  if (!isOpen) return null;

  const [selectedMemberId, setSelectedMemberId] = useState(activeMember.id);
  const [selectedPreset, setSelectedPreset] = useState<QuickPreset | null>(TEEN_QUICK_PRESETS[0]);
  const [title, setTitle] = useState(TEEN_QUICK_PRESETS[0].title);
  const [category, setCategory] = useState<ScheduleCategory>(TEEN_QUICK_PRESETS[0].category);
  const [categoryIcon, setCategoryIcon] = useState(TEEN_QUICK_PRESETS[0].categoryIcon);
  const [date, setDate] = useState(getOffsetDateString(0));
  const [startTime, setStartTime] = useState(TEEN_QUICK_PRESETS[0].suggestedTimes[0].start);
  const [endTime, setEndTime] = useState(TEEN_QUICK_PRESETS[0].suggestedTimes[0].end);
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>(TEEN_QUICK_PRESETS[0].tags);
  const [customTagInput, setCustomTagInput] = useState('');
  const [isPickupNeeded, setIsPickupNeeded] = useState(false);
  const [pickupNote, setPickupNote] = useState('');

  const currentSelectedMember = members.find((m) => m.id === selectedMemberId) || activeMember;

  const handleSelectPreset = (preset: QuickPreset) => {
    setSelectedPreset(preset);
    setTitle(preset.title);
    setCategory(preset.category);
    setCategoryIcon(preset.categoryIcon);
    setTags(preset.tags);
    if (preset.suggestedTimes.length > 0) {
      setStartTime(preset.suggestedTimes[0].start);
      setEndTime(preset.suggestedTimes[0].end);
    }
    if (preset.isPickupPossible && preset.category === 'pickup') {
      setIsPickupNeeded(true);
      setPickupNote('학원/학교 끝나는 시간에 픽업 부탁드려요!');
    }
  };

  const handleApplySuggestedTime = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);
  };

  const handleAddTag = () => {
    if (!customTagInput.trim()) return;
    const clean = customTagInput.startsWith('#')
      ? customTagInput.trim()
      : `#${customTagInput.trim()}`;
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setCustomTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddSchedule({
      memberId: selectedMemberId,
      title: title.trim(),
      category,
      categoryIcon: categoryIcon || '📌',
      date,
      startTime,
      endTime,
      location: location.trim() || undefined,
      note: note.trim() || undefined,
      tags,
      isPickupNeeded,
      pickupNote: isPickupNeeded ? (pickupNote.trim() || '끝나고 픽업 부탁해요!') : undefined,
      pickupStatus: isPickupNeeded ? 'requested' : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-slate-900 w-full max-w-xl max-h-[92vh] overflow-y-auto pop-shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-900 bg-gradient-to-r from-amber-200 via-pink-200 to-indigo-200 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-yellow-300 flex items-center justify-center text-xl font-bold shadow-[2px_2px_0px_#fff]">
              ⚡
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                1초 초간편 스케줄 등록
              </h2>
              <p className="text-xs text-slate-700 font-bold">
                프리셋 터치 한 번으로 끝내는 중고등학생 맞춤 스케줄러
              </p>
            </div>
          </div>

          <button
            id="btn-close-schedule-modal"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-100 font-black pop-shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          {/* Member Selection */}
          <div>
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <span>누구의 일정인가요?</span>
              <span className="text-[11px] text-pink-500 font-normal">
                (터치해서 변경)
              </span>
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {members.map((member) => {
                const isSelected = member.id === selectedMemberId;
                return (
                  <button
                    type="button"
                    key={member.id}
                    id={`btn-modal-member-${member.id}`}
                    onClick={() => setSelectedMemberId(member.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 transition-all shrink-0 ${
                      isSelected
                        ? 'border-slate-900 pop-shadow-sm font-black'
                        : 'border-slate-300 bg-white opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: isSelected ? member.bgLight : undefined,
                    }}
                  >
                    <span className="text-lg">{member.avatar}</span>
                    <span className="text-xs">{member.name}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-slate-900 stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Presets for Teens */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                중고딩 원클릭 퀵 프리셋
              </span>
              <span className="text-[11px] text-slate-500">
                선택시 시간과 태그가 자동 세팅돼요
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TEEN_QUICK_PRESETS.map((preset) => {
                const isCurrent = selectedPreset?.id === preset.id;
                return (
                  <button
                    type="button"
                    key={preset.id}
                    id={`preset-btn-${preset.id}`}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2 rounded-xl border-2 text-left transition-all ${
                      isCurrent
                        ? 'bg-yellow-300 border-slate-900 pop-shadow-sm font-black text-slate-900 scale-102'
                        : 'bg-white border-slate-300 hover:border-slate-800 text-slate-700'
                    }`}
                  >
                    <div className="text-lg">{preset.categoryIcon}</div>
                    <div className="text-xs font-bold truncate">
                      {preset.title.replace(/ [^\s]+$/, '')}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Suggested times for selected preset */}
            {selectedPreset && (
              <div className="mt-3 pt-2.5 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                  추천 시간대 빠른 적용:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPreset.suggestedTimes.map((st, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleApplySuggestedTime(st.start, st.end)}
                      className="px-2.5 py-1 text-xs font-bold bg-white border border-slate-800 rounded-lg hover:bg-yellow-100 text-slate-800 transition-colors"
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Title & Emoji Icon */}
          <div>
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1">
              일정 제목 *
            </label>
            <div className="flex gap-2">
              <input
                id="input-schedule-icon"
                type="text"
                value={categoryIcon}
                onChange={(e) => setCategoryIcon(e.target.value)}
                title="이모지 아이콘"
                className="w-14 text-center text-xl font-bold bg-white border-2 border-slate-900 rounded-xl p-2"
              />
              <input
                id="input-schedule-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 수학 학원 모의고사 풀이"
                className="w-full text-sm font-bold bg-white border-2 border-slate-900 rounded-xl px-3 py-2 focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>
          </div>

          {/* Date & Time Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                날짜
              </label>
              <input
                id="input-schedule-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs sm:text-sm font-bold bg-white border-2 border-slate-900 rounded-xl px-2.5 py-2"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                시작 시간
              </label>
              <input
                id="input-schedule-start"
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-xs sm:text-sm font-bold bg-white border-2 border-slate-900 rounded-xl px-2.5 py-2"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                종료 시간
              </label>
              <input
                id="input-schedule-end"
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-xs sm:text-sm font-bold bg-white border-2 border-slate-900 rounded-xl px-2.5 py-2"
              />
            </div>
          </div>

          {/* Pickup Request SOS Toggle (Huge Teen Favorite!) */}
          <div
            className={`p-3.5 rounded-2xl border-2 transition-all ${
              isPickupNeeded
                ? 'bg-rose-50 border-rose-500 pop-shadow-sm'
                : 'bg-white border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                    isPickupNeeded
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-black text-slate-900 block">
                    🚗 가족 픽업 요청하기 (SOS)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    비 오거나 짐이 많을 때, 늦은 귀가 시 부모님께 바로 알림
                  </span>
                </div>
              </div>

              <input
                id="toggle-pickup-needed"
                type="checkbox"
                checked={isPickupNeeded}
                onChange={(e) => setIsPickupNeeded(e.target.checked)}
                className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
              />
            </div>

            {isPickupNeeded && (
              <div className="mt-3 pt-2.5 border-t border-rose-200">
                <label className="text-[11px] font-bold text-rose-800 block mb-1">
                  픽업 장소 및 요청 사항:
                </label>
                <input
                  id="input-pickup-note"
                  type="text"
                  value={pickupNote}
                  onChange={(e) => setPickupNote(e.target.value)}
                  placeholder="예: 학원 사거리 올리브영 앞에서 10시에 차로 데리러 와주세요!"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-rose-300 rounded-xl font-medium"
                />
              </div>
            )}
          </div>

          {/* Location & Memo Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                장소 (선택)
              </label>
              <input
                id="input-schedule-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예: 작심 스터디카페 / 탑수학학원"
                className="w-full text-xs sm:text-sm font-medium bg-white border-2 border-slate-900 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                메모 / 준비물 (선택)
              </label>
              <input
                id="input-schedule-memo"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="예: 오답노트 제출, 간식비 챙기기"
                className="w-full text-xs sm:text-sm font-medium bg-white border-2 border-slate-900 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-black text-slate-700 block mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              태그 추가
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-xs font-black bg-pink-100 text-pink-900 border border-pink-300 rounded-lg flex items-center gap-1"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-pink-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                id="input-custom-tag"
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="#단어시험, #모의고사, #축제..."
                className="w-full text-xs font-medium bg-white border border-slate-900 rounded-xl px-3 py-1.5"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 shrink-0"
              >
                태그 추가
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-white border-2 border-slate-300 rounded-xl hover:border-slate-700"
            >
              취소
            </button>
            <button
              type="submit"
              id="btn-submit-schedule"
              className="px-6 py-2.5 text-xs sm:text-sm font-black text-white bg-slate-900 border-2 border-slate-900 rounded-xl pop-shadow-sm pop-shadow-hover hover:bg-slate-800"
            >
              🚀 일정 등록 완료!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
