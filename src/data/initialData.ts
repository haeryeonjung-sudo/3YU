import {
  FamilyMember,
  ScheduleItem,
  FamilyMemo,
  DDayEvent,
  MemberGoal,
  FamilyMediaItem,
} from '../types';

export const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: 'teen-1',
    name: '민서',
    role: 'teen',
    gradeBadge: '고2 🎧',
    avatar: '🎧',
    color: '#EC4899',
    bgLight: '#FDF2F8',
    borderColor: '#F472B6',
    mood: '수학 모의고사 D-5 💀',
    currentStatus: '스카 열공중',
    todayDinner: 'eating_late',
    dinnerNote: '학원 끝나고 9시 반에 먹을게요! 찌개 남겨줘',
  },
  {
    id: 'teen-2',
    name: '준우',
    role: 'teen',
    gradeBadge: '중3 ⚡',
    avatar: '🛹',
    color: '#8B5CF6',
    bgLight: '#F5F3FF',
    borderColor: '#A78BFA',
    mood: '오늘 텐션 최고조 🚀',
    currentStatus: '친구랑 축구',
    todayDinner: 'eating',
    dinnerNote: '집밥 대환영! 밥 두 공기 예약 🍚',
  },
  {
    id: 'mom',
    name: '엄마',
    role: 'parent',
    gradeBadge: '원더우먼 👑',
    avatar: '🌸',
    color: '#10B981',
    bgLight: '#ECFDF5',
    borderColor: '#34D399',
    mood: '오늘 삼겹살 굽는 날 🥓',
    currentStatus: '집 (저녁 준비중)',
    todayDinner: 'eating',
    dinnerNote: '7시 반에 따뜻하게 구워둘게~',
  },
  {
    id: 'dad',
    name: '아빠',
    role: 'parent',
    gradeBadge: '든든대장 👓',
    avatar: '🚗',
    color: '#3B82F6',
    bgLight: '#EFF6FF',
    borderColor: '#60A5FA',
    mood: '오늘 칼퇴 성공 기원 🏃‍♂️',
    currentStatus: '퇴근 준비',
    todayDinner: 'eating',
    dinnerNote: '8시 전 도착 예정! 민서 픽업 가능',
  },
];

// Helper to get formatted date string YYYY-MM-DD
export function getOffsetDateString(offsetDays: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export function getInitialSchedules(): ScheduleItem[] {
  const today = getOffsetDateString(0);
  const tomorrow = getOffsetDateString(1);
  const yesterday = getOffsetDateString(-1);

  return [
    {
      id: 'sch-1',
      memberId: 'teen-1',
      title: '수학 심화반 학원',
      category: 'academy',
      categoryIcon: '📐',
      date: today,
      startTime: '18:00',
      endTime: '21:30',
      location: '대치탑학원 4층',
      note: '숙제 검사 있음. 모의고사 오답노트 필수',
      tags: ['#수학', '#학원', '#열공'],
      isPickupNeeded: true,
      pickupNote: '21:30에 정문 앞 픽업 부탁해요!',
      pickupStatus: 'accepted',
      acceptedByMemberId: 'dad',
      cheers: [
        {
          id: 'ch-1',
          fromMemberId: 'mom',
          emoji: '🧋',
          message: '수학 끝나고 시원한 음료수 사먹어!',
          timestamp: Date.now() - 1000 * 60 * 30,
        },
        {
          id: 'ch-2',
          fromMemberId: 'dad',
          emoji: '🚗',
          message: '아빠가 9시 25분까지 차 대고 기다릴게~',
          timestamp: Date.now() - 1000 * 60 * 15,
        },
      ],
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
    },
    {
      id: 'sch-2',
      memberId: 'teen-2',
      title: '친구들이랑 풋살 & 코노',
      category: 'hangout',
      categoryIcon: '⚽',
      date: today,
      startTime: '16:30',
      endTime: '18:30',
      location: '학교 운동장 + 코인노래방',
      note: '반 대항전 연습',
      tags: ['#운동', '#친구', '#스트레스해소'],
      cheers: [
        {
          id: 'ch-3',
          fromMemberId: 'teen-1',
          emoji: '🎤',
          message: '노래 적당히 불러라 목 쉰다 ㅋㅋㅋ',
          timestamp: Date.now() - 1000 * 60 * 20,
        },
      ],
      createdAt: Date.now() - 1000 * 60 * 60 * 4,
    },
    {
      id: 'sch-3',
      memberId: 'mom',
      title: '가족 저녁 준비 (삼겹살 파티)',
      category: 'family',
      categoryIcon: '🥓',
      date: today,
      startTime: '19:00',
      endTime: '20:30',
      location: '우리집 식탁',
      note: '신선한 쌈채소랑 된장찌개 준비 완료!',
      tags: ['#집밥', '#삼겹살', '#가족모임'],
      cheers: [
        {
          id: 'ch-4',
          fromMemberId: 'teen-2',
          emoji: '🔥',
          message: '엄마 최고 사랑해요 밥 세 그릇 먹을게요!',
          timestamp: Date.now() - 1000 * 60 * 10,
        },
      ],
      createdAt: Date.now() - 1000 * 60 * 60 * 3,
    },
    {
      id: 'sch-4',
      memberId: 'dad',
      title: '민서 학원 픽업 & 퇴근',
      category: 'pickup',
      categoryIcon: '🚗',
      date: today,
      startTime: '21:15',
      endTime: '22:00',
      location: '학원가 사거리',
      note: '비 올 수 있으니 우산 챙겨감',
      tags: ['#픽업', '#딸바보', '#안전귀가'],
      cheers: [],
      createdAt: Date.now() - 1000 * 60 * 60 * 2,
    },
    {
      id: 'sch-5',
      memberId: 'teen-1',
      title: '독서실 모의고사 풀기',
      category: 'study',
      categoryIcon: '🎧',
      date: tomorrow,
      startTime: '14:00',
      endTime: '19:00',
      location: '작심 스터디카페 32번석',
      note: '영어 3회분 풀고 오답정리',
      tags: ['#스카', '#집중', '#열공'],
      cheers: [],
      createdAt: Date.now() - 1000 * 60 * 60 * 1,
    },
    {
      id: 'sch-6',
      memberId: 'teen-2',
      title: '영어 회화 학원',
      category: 'academy',
      categoryIcon: '📚',
      date: tomorrow,
      startTime: '17:00',
      endTime: '19:00',
      location: '글로벌 어학원',
      tags: ['#영어', '#단어시험'],
      cheers: [],
      createdAt: Date.now() - 1000 * 60 * 30,
    },
  ];
}

export const INITIAL_MEMOS: FamilyMemo[] = [
  {
    id: 'memo-1',
    fromMemberId: 'mom',
    content: '냉장고에 샤인머스캣 씻어뒀으니까 꺼내먹어~! 🍇',
    tag: 'snack',
    date: getOffsetDateString(0),
    likes: ['teen-1', 'teen-2', 'dad'],
    createdAt: Date.now() - 1000 * 60 * 120,
  },
  {
    id: 'memo-2',
    fromMemberId: 'teen-1',
    content: '아빠 이따 학원 끝날 때 우산 하나만 챙겨와주세요 비 조금씩 와요 ☔',
    tag: 'request',
    date: getOffsetDateString(0),
    likes: ['dad'],
    createdAt: Date.now() - 1000 * 60 * 45,
  },
  {
    id: 'memo-3',
    fromMemberId: 'dad',
    content: '주말에 다같이 영화관 갈 사람 손! 팝콘 쏜다 🍿',
    tag: 'notice',
    date: getOffsetDateString(0),
    likes: ['teen-1', 'teen-2', 'mom'],
    createdAt: Date.now() - 1000 * 60 * 200,
  },
];

export const INITIAL_DDAYS: DDayEvent[] = [
  {
    id: 'dday-1',
    title: '민서 2학기 중간고사 💯',
    date: getOffsetDateString(5),
    emoji: '📝',
    memberId: 'teen-1',
    color: '#EC4899',
  },
  {
    id: 'dday-2',
    title: '가족 가을 캠핑 ⛺',
    date: getOffsetDateString(12),
    emoji: '🔥',
    color: '#10B981',
  },
  {
    id: 'dday-3',
    title: '준우 축구 결승전 ⚽',
    date: getOffsetDateString(8),
    emoji: '🏆',
    memberId: 'teen-2',
    color: '#8B5CF6',
  },
];

export interface QuickPreset {
  id: string;
  title: string;
  category: ScheduleItem['category'];
  categoryIcon: string;
  defaultDurationHours: number;
  tags: string[];
  suggestedTimes: { label: string; start: string; end: string }[];
  isPickupPossible?: boolean;
}

export const TEEN_QUICK_PRESETS: QuickPreset[] = [
  {
    id: 'p-math',
    title: '수학 학원 📐',
    category: 'academy',
    categoryIcon: '📐',
    defaultDurationHours: 3,
    tags: ['#학원', '#수학', '#열공'],
    suggestedTimes: [
      { label: '방과후 5시~8시', start: '17:00', end: '20:00' },
      { label: '저녁 6시~9시', start: '18:00', end: '21:00' },
      { label: '심야 7시~10시', start: '19:00', end: '22:00' },
    ],
    isPickupPossible: true,
  },
  {
    id: 'p-eng',
    title: '영어 학원 📚',
    category: 'academy',
    categoryIcon: '📚',
    defaultDurationHours: 2,
    tags: ['#학원', '#영어', '#단어'],
    suggestedTimes: [
      { label: '오후 4시~6시', start: '16:00', end: '18:00' },
      { label: '저녁 6시~8시', start: '18:00', end: '20:00' },
      { label: '저녁 7시~9시 반', start: '19:00', end: '21:30' },
    ],
    isPickupPossible: true,
  },
  {
    id: 'p-study',
    title: '스카 / 독서실 🎧',
    category: 'study',
    categoryIcon: '🎧',
    defaultDurationHours: 4,
    tags: ['#스카', '#집중모드', '#시험대비'],
    suggestedTimes: [
      { label: '오후 2시~6시', start: '14:00', end: '18:00' },
      { label: '저녁 6시~10시', start: '18:00', end: '22:00' },
      { label: '밤 8시~자정', start: '20:00', end: '24:00' },
    ],
    isPickupPossible: true,
  },
  {
    id: 'p-exam',
    title: '시험 기간 직전대비 💯',
    category: 'exam',
    categoryIcon: '💯',
    defaultDurationHours: 3,
    tags: ['#시험기간', '#오답정리', '#버닝'],
    suggestedTimes: [
      { label: '방과후 4시~7시', start: '16:00', end: '19:00' },
      { label: '저녁 7시~11시', start: '19:00', end: '23:00' },
    ],
  },
  {
    id: 'p-friends',
    title: '친구랑 약속 (코노/PC) 🎤',
    category: 'hangout',
    categoryIcon: '🎮',
    defaultDurationHours: 2.5,
    tags: ['#친구약속', '#코노', '#꿀잼'],
    suggestedTimes: [
      { label: '방과후 4시 반~7시', start: '16:30', end: '19:00' },
      { label: '주말 1시~4시', start: '13:00', end: '16:00' },
      { label: '주말 5시~8시', start: '17:00', end: '20:00' },
    ],
  },
  {
    id: 'p-school',
    title: '야간 자율학습 (야자) 🌙',
    category: 'school',
    categoryIcon: '🌙',
    defaultDurationHours: 3,
    tags: ['#야자', '#학교', '#밤10시'],
    suggestedTimes: [
      { label: '야자 18:30~21:30', start: '18:30', end: '21:30' },
      { label: '풀야자 19:00~22:00', start: '19:00', end: '22:00' },
    ],
    isPickupPossible: true,
  },
  {
    id: 'p-family',
    title: '가족 외식 & 모임 🍽️',
    category: 'family',
    categoryIcon: '🍽️',
    defaultDurationHours: 2,
    tags: ['#가족외식', '#맛있는거', '#주말'],
    suggestedTimes: [
      { label: '점심 12시~14시', start: '12:00', end: '14:00' },
      { label: '저녁 18시 반~20시 반', start: '18:30', end: '20:30' },
    ],
  },
  {
    id: 'p-pickup',
    title: 'SOS 픽업 요청 🚗',
    category: 'pickup',
    categoryIcon: '🚗',
    defaultDurationHours: 0.5,
    tags: ['#픽업요청', '#비옴', '#짐많음'],
    suggestedTimes: [
      { label: '밤 9시 30분', start: '21:30', end: '22:00' },
      { label: '밤 10시', start: '22:00', end: '22:30' },
      { label: '밤 10시 30분', start: '22:30', end: '23:00' },
    ],
    isPickupPossible: true,
  },
];

export const CHEER_STICKERS = [
  { emoji: '🔥', label: '열공 화이팅!' },
  { emoji: '🧋', label: '버블티 쏜다!' },
  { emoji: '💖', label: '수고했어 하트!' },
  { emoji: '🍗', label: '야식 대기중!' },
  { emoji: '🚗', label: '픽업 준비완료!' },
  { emoji: '💯', label: '100점 가자!' },
  { emoji: '😴', label: '쉬어가면서 해~' },
  { emoji: '💸', label: '용돈 보낸다!' },
];

export const INITIAL_GOALS: MemberGoal[] = [
  {
    id: 'goal-1',
    memberId: 'teen-1', // 민서 (고2)
    title: '매일 수학 기출 10문제 & 오답노트 정리 📐',
    category: 'study',
    categoryIcon: '📐',
    frequency: 'daily',
    targetCount: 7,
    currentCount: 5,
    isCompletedToday: true,
    streakDays: 5,
    cheerCount: 6,
    cheeredBy: ['mom', 'dad', 'teen-2'],
    comments: [
      {
        id: 'gc-1',
        fromMemberId: 'mom',
        text: '5일 연속 달성 대단해! 주말에 마라탕 쏜다 🍲',
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
      },
      {
        id: 'gc-2',
        fromMemberId: 'dad',
        text: '수학 모의고사 1등급 가즈아! 🔥',
        timestamp: Date.now() - 1000 * 60 * 30,
      },
    ],
    rewardNote: '7일 연속 달성 시 민서 최애 마라탕 & 탕후루 파티!',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 'goal-2',
    memberId: 'teen-1',
    title: '스카 끝나고 밤 11시 반 전에 폰 끄고 취침 😴',
    category: 'habit',
    categoryIcon: '🌙',
    frequency: 'daily',
    targetCount: 7,
    currentCount: 3,
    isCompletedToday: false,
    streakDays: 3,
    cheerCount: 2,
    cheeredBy: ['mom'],
    comments: [
      {
        id: 'gc-3',
        fromMemberId: 'teen-1',
        text: '오늘은 꼭 11시 반에 폰 끄고 잘게요!',
        timestamp: Date.now() - 1000 * 60 * 45,
      },
    ],
    rewardNote: '성공하면 수면 안대 & 디퓨저 선물',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'goal-3',
    memberId: 'teen-2', // 준우 (중3)
    title: '영어 단어 하루 30개 암기 (클래스카드) 📚',
    category: 'study',
    categoryIcon: '📚',
    frequency: 'daily',
    targetCount: 7,
    currentCount: 4,
    isCompletedToday: true,
    streakDays: 4,
    cheerCount: 4,
    cheeredBy: ['mom', 'teen-1'],
    comments: [
      {
        id: 'gc-4',
        fromMemberId: 'teen-1',
        text: '오 준우 단어 시험 만점 받으면 코노 3곡 지원함 🎤',
        timestamp: Date.now() - 1000 * 60 * 60,
      },
    ],
    rewardNote: '영단어 200개 마스터 시 닌텐도 게임팩',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: 'goal-4',
    memberId: 'teen-2',
    title: '주 3회 저녁 러닝 & 농구 연습 🏀',
    category: 'exercise',
    categoryIcon: '🏀',
    frequency: 'weekly',
    targetCount: 3,
    currentCount: 2,
    isCompletedToday: true,
    streakDays: 6,
    cheerCount: 3,
    cheeredBy: ['dad', 'mom'],
    comments: [],
    rewardNote: '체력 증진 & 새 농구화 득템!',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: 'goal-5',
    memberId: 'mom', // 엄마
    title: '하루 만보 걷기 & 저녁 요가 🧘‍♀️',
    category: 'exercise',
    categoryIcon: '🧘‍♀️',
    frequency: 'daily',
    targetCount: 7,
    currentCount: 5,
    isCompletedToday: true,
    streakDays: 8,
    cheerCount: 5,
    cheeredBy: ['dad', 'teen-1', 'teen-2'],
    comments: [
      {
        id: 'gc-5',
        fromMemberId: 'dad',
        text: '오늘 퇴근하고 탄천 같이 걸어요~ 🏃‍♂️',
        timestamp: Date.now() - 1000 * 60 * 120,
      },
    ],
    rewardNote: '한 달 성공 시 주말 온천 힐링',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
  {
    id: 'goal-6',
    memberId: 'dad', // 아빠
    title: '주 3회 야식 참기 & 물 2L 마시기 💧',
    category: 'habit',
    categoryIcon: '💧',
    frequency: 'weekly',
    targetCount: 3,
    currentCount: 3,
    isCompletedToday: true,
    streakDays: 12,
    cheerCount: 7,
    cheeredBy: ['mom', 'teen-1'],
    comments: [
      {
        id: 'gc-6',
        fromMemberId: 'teen-1',
        text: '아빠 야식 참기 성공 축하! 치킨 냄새 맡아도 꾹 참음 대단함 👍',
        timestamp: Date.now() - 1000 * 60 * 90,
      },
    ],
    rewardNote: '뱃살 2kg 감량 시 가족들이 안마권 5장 증정!',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
  },
];

export const INITIAL_MEDIA_ITEMS: FamilyMediaItem[] = [
  {
    id: 'media-yt-featured',
    fromMemberId: 'teen-1', // 민서
    type: 'video',
    url: 'https://www.youtube.com/embed/kX3EnAayzDo',
    caption: '🎧 우리 가족 공식 추천 영상 & BGM 온에어! 지친 하루 힐링하고 함께 파이팅해요 ✨',
    tag: 'memory',
    tagLabel: '가족추억 📹',
    date: getOffsetDateString(0),
    location: '패밀리 바이브 온에어',
    likes: ['mom', 'dad', 'teen-1', 'teen-2'],
    reactions: [
      { emoji: '🔥', byMemberIds: ['teen-1', 'teen-2'] },
      { emoji: '💖', byMemberIds: ['mom', 'dad'] },
      { emoji: '👏', byMemberIds: ['dad'] },
    ],
    comments: [
      {
        id: 'mc-yt-1',
        fromMemberId: 'mom',
        text: '이 영상이랑 음악 너무 신나고 좋다! 온 가족 에너지 충전 완 ⚡',
        timestamp: Date.now() - 1000 * 60 * 15,
      },
      {
        id: 'mc-yt-2',
        fromMemberId: 'dad',
        text: '퇴근길에 들으니 기분 최고네~ 👍',
        timestamp: Date.now() - 1000 * 60 * 5,
      },
    ],
    createdAt: Date.now(),
  },
  {
    id: 'media-1',
    fromMemberId: 'teen-1', // 민서
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    caption: '오늘 스카 6시간 버닝 완료! 📐 모의고사 오답노트 3장째 작성중 🎧 커피 마시고 힘내자',
    tag: 'study',
    tagLabel: '열공인증 📖',
    date: getOffsetDateString(0),
    location: '르하임 스터디카페 32번석',
    likes: ['mom', 'dad', 'teen-2'],
    reactions: [
      { emoji: '🔥', byMemberIds: ['mom', 'dad'] },
      { emoji: '🧋', byMemberIds: ['dad'] },
      { emoji: '💯', byMemberIds: ['teen-2'] },
    ],
    comments: [
      {
        id: 'mc-1',
        fromMemberId: 'mom',
        text: '글씨 깔끔한 것 봐! 집 올 때 조심해서 와 민서야 💕',
        timestamp: Date.now() - 1000 * 60 * 45,
      },
      {
        id: 'mc-2',
        fromMemberId: 'dad',
        text: '아빠가 9시 반에 정문으로 픽업 갈게!',
        timestamp: Date.now() - 1000 * 60 * 20,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 50,
  },
  {
    id: 'media-2',
    fromMemberId: 'teen-2', // 준우
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    caption: '방과후 학교 운동장에서 풋살 한판! ⚽ 마지막 슛으로 동점골 넣음 ㅋㅋㅋ 짱잼',
    tag: 'daily',
    tagLabel: '학교&일상 🛹',
    date: getOffsetDateString(0),
    location: '학교 대운동장',
    likes: ['dad', 'teen-1'],
    reactions: [
      { emoji: '⚽', byMemberIds: ['dad'] },
      { emoji: '👏', byMemberIds: ['mom', 'teen-1'] },
    ],
    comments: [
      {
        id: 'mc-3',
        fromMemberId: 'dad',
        text: '캬 나이스 슛! 끝나고 물 챙겨마시고 들어가라',
        timestamp: Date.now() - 1000 * 60 * 120,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 130,
  },
  {
    id: 'media-3',
    fromMemberId: 'mom', // 엄마
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    caption: '오늘 저녁은 지글지글 통삼겹 & 된장찌개! 🥓 노릇노릇하게 굽고 있으니 얼른 와요',
    tag: 'food',
    tagLabel: '오늘의밥상 🍚',
    date: getOffsetDateString(0),
    location: '스위트홈 주방',
    likes: ['teen-1', 'teen-2', 'dad'],
    reactions: [
      { emoji: '🤤', byMemberIds: ['teen-1', 'teen-2', 'dad'] },
      { emoji: '❤️', byMemberIds: ['dad'] },
    ],
    comments: [
      {
        id: 'mc-4',
        fromMemberId: 'teen-1',
        text: '헐 대박 비주얼 ㅠㅠ 제 몫 꼭 남겨주세요!!',
        timestamp: Date.now() - 1000 * 60 * 70,
      },
      {
        id: 'mc-5',
        fromMemberId: 'teen-2',
        text: '지금 집 가는 중입니다 폭풍흡입 예정 🏃‍♂️💨',
        timestamp: Date.now() - 1000 * 60 * 60,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 80,
  },
  {
    id: 'media-4',
    fromMemberId: 'dad', // 아빠
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    caption: '퇴근길 노을 하늘 너무 예뻐서 영상 찍어봄 🌅 가족들 모두 오늘도 수고 많았어!',
    tag: 'memory',
    tagLabel: '가족추억 📹',
    date: getOffsetDateString(-1),
    location: '한강 탄천 다리 위',
    likes: ['mom', 'teen-1'],
    reactions: [
      { emoji: '✨', byMemberIds: ['mom', 'teen-1', 'teen-2'] },
      { emoji: '💖', byMemberIds: ['mom'] },
    ],
    comments: [
      {
        id: 'mc-6',
        fromMemberId: 'mom',
        text: '여보 감성 넘치네 ㅎㅎ 운전 조심해서 와요',
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 25,
  },
];
