import React, { useState } from 'react';
import { FamilyMember, DinnerChoice } from '../types';
import { Utensils, Sparkles, Check, Clock, MessageSquare, Plus, ChefHat } from 'lucide-react';

interface DinnerBoardProps {
  members: FamilyMember[];
  activeMember: FamilyMember;
  onUpdateDinnerStatus: (
    memberId: string,
    choice: DinnerChoice,
    note?: string
  ) => void;
  dinnerMenu: string;
  onUpdateDinnerMenu: (menu: string) => void;
}

export const DinnerBoard: React.FC<DinnerBoardProps> = ({
  members,
  activeMember,
  onUpdateDinnerStatus,
  dinnerMenu,
  onUpdateDinnerMenu,
}) => {
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [tempMenu, setTempMenu] = useState(dinnerMenu);
  const [customNote, setCustomNote] = useState(activeMember.dinnerNote || '');
  const [showNoteInput, setShowNoteInput] = useState(false);

  // Count headcount
  const eatingCount = members.filter(
    (m) => m.todayDinner === 'eating' || m.todayDinner === 'eating_late' || m.todayDinner === 'special_request'
  ).length;

  const choices: {
    type: DinnerChoice;
    label: string;
    sub: string;
    icon: string;
    bgColor: string;
    activeBorder: string;
  }[] = [
    {
      type: 'eating',
      label: '집밥 맛있게 먹어요 🍚',
      sub: '정상 식사 시간에 먹을게요',
      icon: '🍚',
      bgColor: 'bg-emerald-50 text-emerald-900 border-emerald-300',
      activeBorder: 'ring-4 ring-emerald-400 bg-emerald-100 border-emerald-500',
    },
    {
      type: 'eating_late',
      label: '늦게 먹어요 (학원/야자) ⏰',
      sub: '학원 끝나고 늦게 챙겨주세요',
      icon: '⏰',
      bgColor: 'bg-amber-50 text-amber-900 border-amber-300',
      activeBorder: 'ring-4 ring-amber-400 bg-amber-100 border-amber-500',
    },
    {
      type: 'not_eating',
      label: '밖에서 먹고 가요 (패스) 🍔',
      sub: '친구랑 먹거나 밖에서 해결해요',
      icon: '🍔',
      bgColor: 'bg-rose-50 text-rose-900 border-rose-300',
      activeBorder: 'ring-4 ring-rose-400 bg-rose-100 border-rose-500',
    },
    {
      type: 'special_request',
      label: '메뉴 건의 / 야식 원츄 🍗',
      sub: '치킨, 떡볶이, 특별 메뉴 요청!',
      icon: '🍗',
      bgColor: 'bg-purple-50 text-purple-900 border-purple-300',
      activeBorder: 'ring-4 ring-purple-400 bg-purple-100 border-purple-500',
    },
  ];

  const handleSaveMenu = () => {
    onUpdateDinnerMenu(tempMenu);
    setIsEditingMenu(false);
  };

  const handleSelectChoice = (choice: DinnerChoice) => {
    onUpdateDinnerStatus(activeMember.id, choice, customNote);
  };

  const handleSaveCustomNote = () => {
    onUpdateDinnerStatus(activeMember.id, activeMember.todayDinner, customNote);
    setShowNoteInput(false);
  };

  return (
    <section className="bg-white rounded-3xl border-2 border-slate-900 p-4 sm:p-6 pop-shadow">
      {/* Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b-2 border-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-2xl pop-shadow-sm rotate-1">
            🍳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                오늘 저녁밥 게시판
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-black bg-rose-400 text-white rounded-full border border-slate-900 shadow-[1px_1px_0px_#0F172A]">
                밥솥 카운터 {eatingCount}/{members.length}명
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              "엄마 오늘 밥 먹어?" 전화 대신 1초 만에 탭해서 알리기!
            </p>
          </div>
        </div>

        {/* Dinner Menu Display / Editor */}
        <div className="bg-amber-50 rounded-2xl border-2 border-slate-900 p-3 sm:max-w-md w-full">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-black text-amber-900 flex items-center gap-1">
              <ChefHat className="w-3.5 h-3.5 text-amber-700" />
              오늘의 저녁 메뉴 공지:
            </span>
            {!isEditingMenu && (
              <button
                id="btn-edit-dinner-menu"
                onClick={() => {
                  setTempMenu(dinnerMenu);
                  setIsEditingMenu(true);
                }}
                className="text-[11px] font-bold text-amber-800 underline hover:text-amber-950"
              >
                메뉴 수정
              </button>
            )}
          </div>

          {isEditingMenu ? (
            <div className="flex gap-2 mt-1">
              <input
                id="input-dinner-menu"
                type="text"
                value={tempMenu}
                onChange={(e) => setTempMenu(e.target.value)}
                placeholder="예: 지글지글 삼겹살 파티 🥓"
                className="w-full text-xs sm:text-sm px-2.5 py-1.5 bg-white border border-slate-900 rounded-xl font-bold"
              />
              <button
                id="btn-save-dinner-menu"
                onClick={handleSaveMenu}
                className="px-3 py-1 text-xs font-black bg-slate-900 text-white rounded-xl hover:bg-slate-800 shrink-0"
              >
                저장
              </button>
            </div>
          ) : (
            <p className="text-sm font-black text-slate-900 tracking-tight">
              {dinnerMenu || '아직 정해지지 않았어요! 메뉴 건의해보세요 🍕'}
            </p>
          )}
        </div>
      </div>

      {/* Active Member Action Card: "나(선택된 사람)의 저녁 상태 선택" */}
      <div className="mt-5 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-2xl border-2 border-slate-900 p-4 pop-shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeMember.avatar}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black text-slate-900">
                  {activeMember.name} 님의 저녁 여부 선택
                </span>
                {activeMember.gradeBadge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white border border-slate-800 rounded">
                    {activeMember.gradeBadge}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-600">
                원하는 버튼을 한 번만 누르면 가족 모두에게 바로 공유돼요!
              </span>
            </div>
          </div>

          <button
            id="btn-toggle-dinner-note"
            onClick={() => setShowNoteInput(!showNoteInput)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-white text-slate-800 border border-slate-900 rounded-lg hover:bg-slate-100"
          >
            <MessageSquare className="w-3.5 h-3.5 text-pink-500" />
            <span>한마디 남기기</span>
          </button>
        </div>

        {/* Choice Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {choices.map((c) => {
            const isSelected = activeMember.todayDinner === c.type;
            return (
              <button
                key={c.type}
                id={`btn-dinner-choice-${c.type}`}
                onClick={() => handleSelectChoice(c.type)}
                className={`p-3 rounded-xl border-2 text-left transition-all relative pop-shadow-hover ${
                  c.bgColor
                } ${
                  isSelected
                    ? `${c.activeBorder} pop-shadow-sm scale-[1.02]`
                    : 'border-slate-800 hover:border-slate-950'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <div className="text-xl mb-1">{c.icon}</div>
                <div className="text-xs sm:text-sm font-black tracking-tight leading-snug">
                  {c.label}
                </div>
                <div className="text-[11px] opacity-75 font-medium mt-0.5">
                  {c.sub}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom note expansion */}
        {showNoteInput && (
          <div className="mt-3 pt-3 border-t border-slate-300 flex gap-2">
            <input
              id="input-dinner-note"
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="예: 9시 반에 도착해요! 국물 많이 남겨주세요 / 친구랑 떡볶이 먹어요"
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white border-2 border-slate-900 rounded-xl font-medium"
            />
            <button
              id="btn-save-dinner-note"
              onClick={handleSaveCustomNote}
              className="px-4 py-2 text-xs font-black bg-pink-500 text-white border-2 border-slate-900 rounded-xl pop-shadow-sm hover:bg-pink-600 shrink-0"
            >
              확인
            </button>
          </div>
        )}
      </div>

      {/* All Family Members Dinner Status Cards */}
      <div className="mt-6">
        <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>우리 가족 오늘 저녁 현황 한눈에 보기</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {members.map((member) => {
            let badgeBg = 'bg-slate-100 text-slate-700';
            let labelText = '미정';
            let icon = '❓';

            if (member.todayDinner === 'eating') {
              badgeBg = 'bg-emerald-100 text-emerald-900 border-emerald-400';
              labelText = '집밥 먹음 🍚';
              icon = '🍚';
            } else if (member.todayDinner === 'eating_late') {
              badgeBg = 'bg-amber-100 text-amber-900 border-amber-400';
              labelText = '늦게 먹음 ⏰';
              icon = '⏰';
            } else if (member.todayDinner === 'not_eating') {
              badgeBg = 'bg-rose-100 text-rose-900 border-rose-400';
              labelText = '밖에서 먹음 🍔';
              icon = '🍔';
            } else if (member.todayDinner === 'special_request') {
              badgeBg = 'bg-purple-100 text-purple-900 border-purple-400';
              labelText = '특별 메뉴 희망 🍗';
              icon = '🍗';
            }

            return (
              <div
                key={member.id}
                className="bg-white rounded-2xl border-2 border-slate-900 p-3.5 pop-shadow-sm flex flex-col justify-between"
                style={{ backgroundColor: member.bgLight }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{member.avatar}</span>
                      <div>
                        <span className="text-sm font-black text-slate-900 block">
                          {member.name}
                        </span>
                        <span className="text-[10px] text-slate-600 font-bold">
                          {member.gradeBadge || member.role}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full border ${badgeBg}`}
                    >
                      {labelText}
                    </span>
                  </div>

                  {member.dinnerNote ? (
                    <div className="bg-white/80 rounded-xl p-2 border border-slate-900/40 text-xs text-slate-800 font-medium break-keep">
                      💬 "{member.dinnerNote}"
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic">
                      남긴 한마디 없음
                    </div>
                  )}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-900/10 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                  <span>현재 위치/상태</span>
                  <span className="text-slate-800 font-black">
                    {member.currentStatus || '집'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
