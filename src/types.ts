export type MemberRole = 'teen' | 'parent' | 'sibling';

export type DinnerChoice = 'eating' | 'eating_late' | 'not_eating' | 'undecided' | 'special_request';

export interface FamilyMember {
  id: string;
  name: string;
  role: MemberRole;
  gradeBadge?: string; // e.g., '고2', '중3', '엄마', '아빠', '막내'
  avatar: string;
  color: string;
  bgLight: string;
  borderColor: string;
  mood: string;
  currentStatus: string;
  todayDinner: DinnerChoice;
  dinnerNote?: string;
}

export type ScheduleCategory =
  | 'academy'
  | 'school'
  | 'study'
  | 'exam'
  | 'hangout'
  | 'family'
  | 'hobby'
  | 'pickup'
  | 'other';

export interface ScheduleCheer {
  id: string;
  fromMemberId: string;
  emoji: string;
  message: string;
  timestamp: number;
}

export interface ScheduleItem {
  id: string;
  memberId: string;
  title: string;
  category: ScheduleCategory;
  categoryIcon: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location?: string;
  note?: string;
  tags: string[];
  isPickupNeeded?: boolean;
  pickupNote?: string;
  pickupStatus?: 'requested' | 'accepted' | 'completed';
  acceptedByMemberId?: string;
  cheers: ScheduleCheer[];
  createdAt: number;
}

export interface FamilyMemo {
  id: string;
  fromMemberId: string;
  content: string;
  tag: 'notice' | 'request' | 'cheer' | 'snack';
  date: string;
  likes: string[]; // memberIds
  createdAt: number;
}

export interface DDayEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  emoji: string;
  memberId?: string; // specific member or whole family
  color: string;
}

export type GoalFrequency = 'daily' | 'weekly' | 'dday';

export interface GoalComment {
  id: string;
  fromMemberId: string;
  text: string;
  timestamp: number;
}

export interface MemberGoal {
  id: string;
  memberId: string;
  title: string;
  category: 'study' | 'habit' | 'exercise' | 'life' | 'mind';
  categoryIcon: string;
  frequency: GoalFrequency;
  targetCount?: number; // e.g. 5 days, 3 times
  currentCount?: number;
  isCompletedToday: boolean;
  streakDays: number;
  cheerCount: number;
  cheeredBy: string[]; // memberIds
  comments: GoalComment[];
  deadlineDate?: string; // YYYY-MM-DD
  rewardNote?: string; // e.g., '달성 시 떡볶이 파티!'
  createdAt: number;
}

export type MediaType = 'photo' | 'video';

export interface MediaReaction {
  emoji: string;
  byMemberIds: string[];
}

export interface MediaComment {
  id: string;
  fromMemberId: string;
  text: string;
  timestamp: number;
}

export interface FamilyMediaItem {
  id: string;
  fromMemberId: string;
  type: MediaType;
  url: string; // image/video URL or Data URL or video embed
  caption: string;
  tag: 'study' | 'daily' | 'food' | 'memory' | 'pet' | 'cheer';
  tagLabel: string;
  date: string; // YYYY-MM-DD
  location?: string;
  likes: string[]; // memberIds
  reactions: MediaReaction[];
  comments: MediaComment[];
  createdAt: number;
}
