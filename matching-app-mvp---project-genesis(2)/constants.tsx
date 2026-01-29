
import React from 'react';
import { Heart, X, MessageCircle, User, Search, Settings, ShieldCheck, Tag, Info, LayoutGrid, Flame } from 'lucide-react';

export const COLORS = {
  primary: '#FF4D6D',
  secondary: '#FF758C',
  accent: '#70E1F5',
  bg: '#F8F9FA'
};

export const FETISH_TAGS = [
  '緊縛', '拘束', '痴漢', '覗き', '露出', '支配', '服従', '言葉責め', '羞恥', 'コスプレ', 
  '制服嗜好', '年上嗜好', '年下嗜好', 'フェチズム', '匂い嗜好', '足嗜好', '声嗜好', 
  '視線嗜好', 'ロールプレイ', 'サディズム', 'マゾヒズム', 'ソフトSM', '管理関係', 
  'オシッコ', '観賞嗜好', '支援関係嗜好', '疑似恋愛', '心理的依存', '背徳嗜好', 
  '秘密共有', '関係性フェチ'
];

export const COMMUNITIES = [
  { id: 'c1', name: '映画好き', members: '12k', category: '趣味', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=300&q=80' },
  { id: 'c2', name: 'カメラ女子', members: '8.5k', category: '趣味', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80' },
  { id: 'c3', name: '週末キャンプ', members: '5.2k', category: 'アウトドア', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=300&q=80' },
  { id: 'c4', name: '猫派の集い', members: '15k', category: 'ペット', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80' },
  { id: 'c5', name: 'サウナ部', members: '3.1k', category: 'ライフスタイル', image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=300&q=80' },
  { id: 'c6', name: 'エンジニア仲間', members: '2.4k', category: '仕事', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80' },
];

const PREFECTURES = ['東京都', '神奈川県', '大阪府', '愛知県', '福岡県', '北海道', '埼玉県', '千葉県', '兵庫県', '京都府', '宮城県', '広島県'];
const FEMALE_NAMES = ['ユウカ', 'アカリ', 'サオリ', 'ミサキ', 'ナナ', 'リン', 'マユ', 'エミ', 'ハルカ', 'ナツミ', 'アイ', 'ユイ', 'リオ', 'メイ', 'ヒナ', 'アスカ', 'レイ', 'マキ', 'アヤ', 'カナ'];
const MALE_NAMES = ['タクミ', 'ケンタ', 'ショウ', 'ダイキ', 'リョウ', 'ユウト', 'カズキ', 'ヒロキ', 'マサト', 'ユウイチ', 'タカシ', 'ツヨシ', 'シンジ', 'サトシ', 'ヨシキ', 'コウヘイ', 'ナオキ', 'タイチ', 'ユウマ', 'トモヤ'];

const generateMockUsers = (count: number) => {
  const users = [];
  for (let i = 1; i <= count; i++) {
    const isFemale = i <= count / 2;
    const gender = isFemale ? '女性' : '男性';
    const id = `${isFemale ? 'f' : 'm'}${i}`;
    const nickname = isFemale 
      ? FEMALE_NAMES[i % FEMALE_NAMES.length] 
      : MALE_NAMES[i % MALE_NAMES.length];
    
    const age = 20 + (i % 21);
    const residence = PREFECTURES[i % PREFECTURES.length];
    
    // 性癖タグの割り当て（より多様に）
    const userFetishes = [];
    userFetishes.push(FETISH_TAGS[i % FETISH_TAGS.length]);
    if (i % 2 === 0) userFetishes.push(FETISH_TAGS[(i * 3) % FETISH_TAGS.length]);
    if (i % 5 === 0) userFetishes.push(FETISH_TAGS[(i + 7) % FETISH_TAGS.length]);
    
    const userCommunities = [];
    userCommunities.push(COMMUNITIES[i % COMMUNITIES.length].name);

    users.push({
      id,
      nickname: `${nickname}${i}`,
      age,
      gender,
      residence,
      bio: `${residence}に住んでいます。趣味は${userCommunities[0]}です。よろしくお願いします。`,
      photos: [`https://picsum.photos/seed/user_${id}/400/600`],
      tags: [...userFetishes, ...userCommunities],
      isPremium: i % 10 === 0,
      isVerified: i % 4 !== 0,
      lastLogin: new Date(Date.now() - (i * 3600000)),
      fetishPreferred: userFetishes.join(', '),
      fetishPhilia: userFetishes[0],
      fetishYears: i % 3 === 0 ? '1年未満' : '3年以上',
      fetishExp: i % 4 === 0 ? '初心者' : '上級者',
      fetishDesiredPlay: userFetishes.includes('緊縛') ? 'ロープを使ったプレイ' : '甘い雰囲気でのプレイ',
      fetishRequest: i % 3 === 0 ? 'リードしてほしい' : '一緒に探求したい',
      fetishBio: 'ここでは本当の自分を出したいと思っています。',
      birthplace: PREFECTURES[(i + 5) % PREFECTURES.length],
      bodyType: i % 3 === 0 ? 'スリム' : '普通',
      height: 150 + (i % 30),
      weight: 45 + (i % 40),
      job: i % 2 === 0 ? '会社員' : 'クリエイター',
      holiday: '土日祝',
      education: '大学卒業',
      marriageHistory: 'なし',
      hasChildren: 'なし',
      marriageIntent: '良い人がいれば',
      wantChildren: 'わからない',
      dateCost: '相談して決める',
      personality: '誠実、穏やか',
      cohabitants: '一人暮らし',
      alcohol: 'ときどき飲む',
      gambling: 'しない',
      smoking: '吸わない',
      hobbies: '読書、映画'
    });
  }
  return users;
};

export const MOCK_USERS: any[] = generateMockUsers(100);

export const NAVIGATION_ITEMS = [
  { id: 'discover', label: '探す', icon: <Search size={20} />, path: '/discover' },
  { id: 'list', label: '一覧', icon: <LayoutGrid size={20} />, path: '/list' },
  { id: 'community', label: 'コミュニティ', icon: <Tag size={20} />, path: '/community' },
  { id: 'fetish', label: '性癖', icon: <Flame size={20} />, path: '/fetish' },
  { id: 'matches', label: 'やり取り', icon: <MessageCircle size={20} />, path: '/matches' },
  { id: 'profile', label: 'マイページ', icon: <User size={20} />, path: '/profile/me' },
];
