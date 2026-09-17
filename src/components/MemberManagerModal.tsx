import React, { useState } from 'react';
import { FamilyMember, MemberRole } from '../types';
import { X, Plus, Trash2, Check, User, Sparkles } from 'lucide-react';

interface MemberManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  onAddMember: (newMember: FamilyMember) => void;
  onUpdateMember: (updated: FamilyMember) => void;
  onDeleteMember: (memberId: string) => void;
}

const AVATAR_OPTIONS = ['🎧', '🛹', '⚡', '🌸', '👓', '🐱', '🐶', '🎮', '🎨', '⚽', '🎸', '👑', '🚀', '☕'];

const COLOR_OPTIONS = [
  { color: '#EC4899', bgLight: '#FDF2F8', borderColor: '#F472B6', name: '핫핑크' },
  { color: '#8B5CF6', bgLight: '#F5F3FF', borderColor: '#A78BFA', name: '퍼플' },
  { color: '#3B82F6', bgLight: '#EFF6FF', borderColor: '#60A5FA', name: '블루' },
  { color: '#10B981', bgLight: '#ECFDF5', borderColor: '#34D399', name: '에메랄드' },
  { color: '#F59E0B', bgLight: '#FFFBEB', borderColor: '#FBBF24', name: '앰버옐로우' },
  { color: '#06B6D4', bgLight: '#ECFEFF', borderColor: '#22D3EE', name: '시안블루' },
];

export const MemberManagerModal: React.FC<MemberManagerModalProps> = ({
  isOpen,
  onClose,
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
}) => {
  if (!isOpen) return null;

  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState<MemberRole>('teen');
  const [gradeBadge, setGradeBadge] = useState('고1 🎧');
  const [avatar, setAvatar] = useState('🎧');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);

  const handleStartEdit = (member: FamilyMember) => {
    setIsAddingNew(false);
    setEditingMemberId(member.id);
    setName(member.name);
    setRole(member.role);
    setGradeBadge(member.gradeBadge || '');
    setAvatar(member.avatar);
    const matchedColor = COLOR_OPTIONS.find((c) => c.color === member.color) || COLOR_OPTIONS[0];
    setSelectedColor(matchedColor);
  };

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingMemberId(null);
    setName('');
    setRole('teen');
    setGradeBadge('중2 ⚡');
    setAvatar('🛹');
    setSelectedColor(COLOR_OPTIONS[1]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isAddingNew) {
      const newMem: FamilyMember = {
        id: `member-${Date.now()}`,
        name: name.trim(),
        role,
        gradeBadge: gradeBadge.trim() || undefined,
        avatar,
        color: selectedColor.color,
        bgLight: selectedColor.bgLight,
        borderColor: selectedColor.borderColor,
        mood: '새로 합류했어요! ✨',
        currentStatus: '집',
        todayDinner: 'eating',
      };
      onAddMember(newMem);
      setIsAddingNew(false);
    } else if (editingMemberId) {
      const existing = members.find((m) => m.id === editingMemberId);
      if (existing) {
        onUpdateMember({
          ...existing,
          name: name.trim(),
          role,
          gradeBadge: gradeBadge.trim() || undefined,
          avatar,
          color: selectedColor.color,
          bgLight: selectedColor.bgLight,
          borderColor: selectedColor.borderColor,
        });
      }
      setEditingMemberId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-slate-900 w-full max-w-lg max-h-[90vh] overflow-y-auto pop-shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-900 bg-gradient-to-r from-purple-200 via-pink-200 to-amber-200 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                가족 구성원 프로필 관리
              </h2>
              <p className="text-xs text-slate-700 font-bold">
                닉네임, 아바타, 퍼스널 컬러 설정
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-100 font-black pop-shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Member list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 uppercase">
                현재 등록된 가족 ({members.length}명)
              </span>
              {!isAddingNew && !editingMemberId && (
                <button
                  id="btn-add-new-member"
                  onClick={handleStartAdd}
                  className="flex items-center gap-1 text-xs font-black text-white bg-slate-900 px-3 py-1.5 rounded-xl pop-shadow-sm hover:bg-slate-800"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>새 구성원 추가</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-2xl border-2 border-slate-900 flex items-center justify-between transition-all"
                  style={{ backgroundColor: m.bgLight }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{m.avatar}</span>
                    <div>
                      <span className="text-xs sm:text-sm font-black text-slate-900 block">
                        {m.name}
                      </span>
                      <span className="text-[11px] text-slate-500 font-bold block">
                        {m.gradeBadge || m.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(m)}
                      className="px-2 py-1 text-xs font-bold bg-white border border-slate-900 rounded-lg hover:bg-slate-50"
                    >
                      수정
                    </button>
                    {members.length > 1 && (
                      <button
                        onClick={() => onDeleteMember(m.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form for Edit or Add */}
          {(isAddingNew || editingMemberId) && (
            <form
              onSubmit={handleSave}
              className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-900 space-y-3"
            >
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAddingNew ? '새 가족 구성원 추가' : '프로필 수정'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-black text-slate-700 block mb-1">
                    이름 / 닉네임 *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: 예은, 막내, 이모"
                    className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-900 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-700 block mb-1">
                    신분 / 뱃지 (예: 고1, 중2, 아빠)
                  </label>
                  <input
                    type="text"
                    value={gradeBadge}
                    onChange={(e) => setGradeBadge(e.target.value)}
                    placeholder="예: 고2 🎧"
                    className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-900 rounded-xl"
                  />
                </div>
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-1">
                  아바타 이모지 선택
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVATAR_OPTIONS.map((em) => (
                    <button
                      type="button"
                      key={em}
                      onClick={() => setAvatar(em)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border-2 transition-transform ${
                        avatar === em
                          ? 'border-slate-900 bg-yellow-300 scale-110 pop-shadow-sm'
                          : 'border-slate-300 bg-white hover:border-slate-600'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-1">
                  퍼스널 컬러
                </label>
                <div className="flex gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      type="button"
                      key={c.color}
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-transform ${
                        selectedColor.color === c.color
                          ? 'border-slate-900 scale-110 pop-shadow-sm'
                          : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: c.color }}
                    >
                      {selectedColor.color === c.color && (
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingMemberId(null);
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-xl"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-black bg-slate-900 text-white rounded-xl pop-shadow-sm hover:bg-slate-800"
                >
                  저장하기
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
