import React, { useState } from 'react';
import { FamilyMember, FamilyMemo } from '../types';
import { Heart, Plus, Trash2, Sparkles, MessageSquare } from 'lucide-react';

interface FamilyMemoBoardProps {
  memos: FamilyMemo[];
  members: FamilyMember[];
  activeMember: FamilyMember;
  onAddMemo: (content: string, tag: FamilyMemo['tag']) => void;
  onToggleLikeMemo: (memoId: string, memberId: string) => void;
  onDeleteMemo: (memoId: string) => void;
}

export const FamilyMemoBoard: React.FC<FamilyMemoBoardProps> = ({
  memos,
  members,
  activeMember,
  onAddMemo,
  onToggleLikeMemo,
  onDeleteMemo,
}) => {
  const [newMemoText, setNewMemoText] = useState('');
  const [selectedTag, setSelectedTag] = useState<FamilyMemo['tag']>('notice');

  const tagOptions: { tag: FamilyMemo['tag']; label: string; icon: string; bg: string }[] = [
    { tag: 'notice', label: '가족 공지', icon: '📢', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
    { tag: 'snack', label: '간식/냉장고 알림', icon: '🍰', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    { tag: 'request', label: '부탁/SOS', icon: '🚗', bg: 'bg-rose-100 text-rose-900 border-rose-300' },
    { tag: 'cheer', label: '사랑 & 응원', icon: '💖', bg: 'bg-pink-100 text-pink-900 border-pink-300' },
  ];

  const handlePostMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoText.trim()) return;
    onAddMemo(newMemoText.trim(), selectedTag);
    setNewMemoText('');
  };

  return (
    <div className="space-y-5">
      {/* Post New Memo Box */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 p-4 sm:p-6 pop-shadow">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">💌</span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              가족 한줄 메모 & 간식/SOS 보드
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              "냉장고에 과일 먹어", "우산 챙겨줘" 등 짧고 다정한 한마디
            </p>
          </div>
        </div>

        <form onSubmit={handlePostMemo} className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {tagOptions.map((t) => (
              <button
                type="button"
                key={t.tag}
                onClick={() => setSelectedTag(t.tag)}
                className={`px-3 py-1.5 rounded-xl border-2 text-xs font-black flex items-center gap-1.5 transition-all ${
                  selectedTag === t.tag
                    ? `${t.bg} border-slate-900 pop-shadow-sm scale-102`
                    : 'bg-white border-slate-300 text-slate-600 hover:border-slate-600'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              id="input-memo-content"
              type="text"
              required
              value={newMemoText}
              onChange={(e) => setNewMemoText(e.target.value)}
              placeholder={`${activeMember.name}의 한마디: (예: 학원 끝나고 떡볶이 사갈 사람?)`}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl font-bold focus:bg-white outline-none"
            />
            <button
              type="submit"
              id="btn-submit-memo"
              className="px-5 py-2.5 text-xs sm:text-sm font-black bg-pink-500 text-white rounded-xl border-2 border-slate-900 pop-shadow-sm hover:bg-pink-600 shrink-0"
            >
              톡 남기기!
            </button>
          </div>
        </form>
      </div>

      {/* Memo Sticky Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {memos.map((memo) => {
          const author = members.find((m) => m.id === memo.fromMemberId);
          const hasLiked = memo.likes.includes(activeMember.id);
          const tagInfo = tagOptions.find((t) => t.tag === memo.tag) || tagOptions[0];

          return (
            <div
              key={memo.id}
              className="p-4 rounded-2xl border-2 border-slate-900 bg-amber-50/60 pop-shadow-sm flex flex-col justify-between relative transform hover:-translate-y-1 transition-transform"
              style={{
                backgroundColor:
                  memo.tag === 'snack'
                    ? '#F0FDF4'
                    : memo.tag === 'request'
                    ? '#FFF1F2'
                    : memo.tag === 'cheer'
                    ? '#FDF2F8'
                    : '#FFFBEB',
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">{author?.avatar || '👤'}</span>
                    <span className="text-xs font-black text-slate-900">
                      {author?.name || '가족'}
                    </span>
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.2 rounded border ${tagInfo.bg}`}
                    >
                      {tagInfo.icon} {tagInfo.label}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteMemo(memo.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="메모 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-sm font-bold text-slate-800 leading-relaxed break-keep my-2">
                  {memo.content}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-900/10 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">
                  {memo.date}
                </span>

                <button
                  id={`btn-like-memo-${memo.id}`}
                  onClick={() => onToggleLikeMemo(memo.id, activeMember.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all ${
                    hasLiked
                      ? 'bg-rose-500 text-white border-rose-600 font-bold'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-slate-500'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${hasLiked ? 'fill-white' : ''}`}
                  />
                  <span>{memo.likes.length}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
