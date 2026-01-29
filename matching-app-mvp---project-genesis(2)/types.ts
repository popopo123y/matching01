
export enum Gender {
  MALE = '男性',
  FEMALE = '女性',
  OTHER = 'その他'
}

export interface UserProfile {
  id: string;
  nickname: string;
  age: number;
  gender: Gender;
  residence: string;
  bio: string;
  photos: string[];
  tags: string[];
  isPremium: boolean;
  isVerified: boolean;
  lastLogin: Date;
  // 性癖関連（性癖部屋のみで表示）
  fetishPreferred?: string;
  fetishPhilia?: string;
  fetishYears?: string;
  fetishExp?: string;
  fetishDesiredPlay?: string;
  fetishRequest?: string;
  fetishBio?: string;
  // プロフィール詳細
  birthplace?: string;
  bodyType?: string;
  height?: number;
  weight?: number;
  job?: string;
  holiday?: string;
  education?: string;
  marriageHistory?: string;
  hasChildren?: string;
  marriageIntent?: string;
  wantChildren?: string;
  dateCost?: string;
  personality?: string;
  cohabitants?: string;
  alcohol?: string;
  gambling?: string;
  smoking?: string;
  hobbies?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Match {
  id: string;
  user: UserProfile;
  lastMessage?: string;
  timestamp: Date;
  source: 'normal' | 'fetish';
}
