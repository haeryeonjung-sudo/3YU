import React, { useState } from 'react';
import { FamilyMember, ScheduleItem, FamilyMemo, MemberGoal, FamilyMediaItem } from '../types';
import { X, Copy, Check, Download, Upload, Share2, Sparkles } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  schedules: ScheduleItem[];
  memos: FamilyMemo[];
  goals?: MemberGoal[];
  mediaItems?: FamilyMediaItem[];
  dinnerMenu: string;
  currentDate: string;
  onImportData: (imported: {
    members?: FamilyMember[];
    schedules?: ScheduleItem[];
    memos?: FamilyMemo[];
    goals?: MemberGoal[];
    mediaItems?: FamilyMediaItem[];
    dinnerMenu?: string;
  }) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  members,
  schedules,
  memos,
  goals,
  mediaItems,
  dinnerMenu,
  currentDate,
  onImportData,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  // Filter schedules for currentDate
  const todaySchedules = schedules
    .filter((s) => s.date === currentDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const dateObj = new Date(currentDate + 'T00:00:00');
  const dateFormatted = dateObj.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  // Count dinner headcount
  const eatingCount = members.filter(
    (m) =>
      m.todayDinner === 'eating' ||
      m.todayDinner === 'eating_late' ||
      m.todayDinner === 'special_request'
  ).length;

  // Build the copyable KakaoTalk text
  let kakaoText = `⚡ [패밀리바이브] 오늘 우리 가족 스케줄 (${dateFormatted})\n\n`;

  kakaoText += `🍳 [오늘 저녁밥 현황] (${eatingCount}/${members.length}명 식사)\n`;
  if (dinnerMenu) {
    kakaoText += `메뉴: ${dinnerMenu}\n`;
  }
  members.forEach((m) => {
    let dinnerStatusLabel = '미정';
    if (m.todayDinner === 'eating') dinnerStatusLabel = '집밥 먹음 🍚';
    else if (m.todayDinner === 'eating_late') dinnerStatusLabel = '늦게 먹음 ⏰';
    else if (m.todayDinner === 'not_eating') dinnerStatusLabel = '밖에서 먹음 🍔';
    else if (m.todayDinner === 'special_request') dinnerStatusLabel = '메뉴 건의 🍗';

    const notePart = m.dinnerNote ? ` ("${m.dinnerNote}")` : '';
    kakaoText += `• ${m.name}: ${dinnerStatusLabel}${notePart}\n`;
  });

  kakaoText += `\n⏰ [오늘의 일정 흐름]\n`;
  if (todaySchedules.length === 0) {
    kakaoText += `(등록된 일정이 없습니다)\n`;
  } else {
    todaySchedules.forEach((s) => {
      const owner = members.find((m) => m.id === s.memberId);
      const pickupInfo = s.isPickupNeeded
        ? s.pickupStatus === 'accepted'
          ? ' [🚗 픽업예정]'
          : ' [🚗 픽업요청중!]'
        : '';
      kakaoText += `• [${owner?.name || '가족'}] ${s.startTime}~${s.endTime} | ${s.categoryIcon} ${s.title}${pickupInfo}\n`;
    });
  }

  const todayMemos = memos.filter((m) => m.date === currentDate);
  if (todayMemos.length > 0) {
    kakaoText += `\n💌 [가족 메모]\n`;
    todayMemos.forEach((memo) => {
      const author = members.find((m) => m.id === memo.fromMemberId);
      kakaoText += `• ${author?.name || '가족'}: ${memo.content}\n`;
    });
  }

  if (goals && goals.length > 0) {
    kakaoText += `\n🎯 [오늘의 목표 달성 현황]\n`;
    goals.forEach((g) => {
      const owner = members.find((m) => m.id === g.memberId);
      const statusIcon = g.isCompletedToday ? '✅ 달성완료!' : '⏳ 도전중';
      kakaoText += `• [${owner?.name || '가족'}] ${g.title} (${statusIcon}, ${g.streakDays}일 연속)\n`;
    });
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(kakaoText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleExportJson = () => {
    const data = {
      members,
      schedules,
      memos,
      goals,
      mediaItems,
      dinnerMenu,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family-vibe-backup-${currentDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    try {
      setImportError('');
      const parsed = JSON.parse(importJsonText);
      onImportData(parsed);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 2000);
      setImportJsonText('');
    } catch (e: any) {
      setImportError('올바른 JSON 백업 데이터 형식이 아닙니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-slate-900 w-full max-w-lg max-h-[90vh] overflow-y-auto pop-shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-900 bg-gradient-to-r from-emerald-200 via-teal-200 to-amber-200 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📢</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                단톡방 공유 & 데이터 백업
              </h2>
              <p className="text-xs text-slate-700 font-bold">
                카카오톡 가족방 1초 공유 & 기기 간 동기화
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

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* KakaoTalk Share Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-slate-900 uppercase flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                카톡 단톡방용 브리핑 텍스트
              </label>
              <button
                id="btn-copy-kakao"
                onClick={handleCopyText}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl border-2 transition-all ${
                  copied
                    ? 'bg-emerald-500 text-white border-emerald-600 pop-shadow-sm'
                    : 'bg-yellow-300 text-slate-900 border-slate-900 pop-shadow-sm hover:bg-yellow-400'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>전체 텍스트 복사</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              readOnly
              rows={8}
              value={kakaoText}
              className="w-full text-xs font-mono bg-slate-50 border-2 border-slate-900 rounded-2xl p-3 text-slate-800 select-all"
            />
          </div>

          {/* Backup / Restore Section */}
          <div className="pt-4 border-t-2 border-slate-200">
            <h4 className="text-xs font-black text-slate-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>가족 데이터 백업 및 다른 기기로 가져오기</span>
            </h4>

            <div className="flex gap-2 mb-3">
              <button
                onClick={handleExportJson}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold bg-white text-slate-800 border-2 border-slate-900 rounded-xl pop-shadow-sm hover:bg-slate-50"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>백업 파일(.json) 다운로드</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 block">
                백업 JSON 붙여넣어 복원하기:
              </label>
              <textarea
                rows={3}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='{"members": [...], "schedules": [...]}'
                className="w-full text-[11px] font-mono p-2 bg-slate-50 border border-slate-900 rounded-xl"
              />

              {importError && (
                <p className="text-xs text-rose-600 font-bold">{importError}</p>
              )}
              {importSuccess && (
                <p className="text-xs text-emerald-600 font-bold">
                  성공적으로 데이터를 불러왔습니다!
                </p>
              )}

              <button
                onClick={handleImportJson}
                disabled={!importJsonText.trim()}
                className="w-full py-1.5 text-xs font-black bg-slate-900 text-white rounded-xl disabled:opacity-40"
              >
                데이터 불러오기 (덮어쓰기)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
