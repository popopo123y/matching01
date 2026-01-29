
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MOCK_USERS, NAVIGATION_ITEMS, COLORS, FETISH_TAGS, COMMUNITIES } from './constants';
import { UserProfile, Match, Gender } from './types';
import { CardStack } from './components/CardStack';
import { ChatList } from './components/ChatList';
import { Heart, MessageSquare, Shield, AlertCircle, Settings, Search as SearchIcon, Lock, Flame, ArrowLeft, Send, Footprints, Briefcase, GraduationCap, HeartHandshake, User as UserIcon, Smile, MoreHorizontal, Flag, X, Check, Plus, ShieldAlert, Zap, Filter, ArrowUpDown, ChevronDown, UserRound, Edit3, Camera, ChevronRight, CreditCard, HelpCircle, FileText, Users, Eye, Sparkles, Hash } from 'lucide-react';

// 自分自身のプロフィールデータ（男性）
const ME_USER: UserProfile = {
  id: 'me',
  nickname: 'サンプルユーザー',
  age: 28,
  gender: Gender.MALE,
  residence: '東京都',
  bio: 'Genesisへようこそ！これはあなた自身のプロフィールです。',
  photos: ['https://picsum.photos/seed/me/400/600'],
  tags: ['映画', 'カフェ巡り', 'カメラ'],
  isPremium: false,
  isVerified: true,
  lastLogin: new Date(),
  birthplace: '神奈川県',
  bodyType: '普通',
  height: 175,
  job: 'ITエンジニア',
  education: '大学卒業',
  hobbies: 'プログラミング、サウナ',
  alcohol: 'ときどき飲む',
  smoking: '吸わない'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [isPremium, setIsPremium] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  const [viewingUser, setViewingUser] = useState<UserProfile | any | null>(null);
  const [viewingSource, setViewingSource] = useState<'normal' | 'fetish' | 'community'>('normal');
  const [communitySubTab, setCommunitySubTab] = useState<'members' | 'talk'>('members');
  const [fetishSubTab, setFetishSubTab] = useState<'users' | 'talk'>('users');
  const [matchSubTab, setMatchSubTab] = useState<'normal' | 'fetish'>('normal');
  const [searchFetishTag, setSearchFetishTag] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // 一覧タブ用のフィルタリング
  const [filters, setFilters] = useState({
    minAge: 18,
    maxAge: 60,
    residence: '',
  });
  
  const [talkMessages, setTalkMessages] = useState<any[]>([
    { id: 1, user: '匿名A', text: 'このコミュニティの人、みんな趣味が合って楽しいですね！', time: '10:00' },
    { id: 2, user: '匿名B', text: 'おすすめのスポット知ってる人いますか？', time: '10:05' },
    { id: 3, user: '匿名C', text: '週末にオフ会とかやってるのかな？', time: '10:10' },
    { id: 4, user: '匿名D', text: '新しく入りました！よろしくお願いします。', time: '10:15' },
    { id: 5, user: '匿名E', text: '最近のトレンドについて語りましょう！', time: '10:20' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const [matches, setMatches] = useState<Match[]>([
    { id: 'm1', user: MOCK_USERS[1], lastMessage: 'はじめまして！プロフ見ました。', timestamp: new Date(), source: 'normal' },
    { id: 'm2', user: MOCK_USERS[2], timestamp: new Date(), source: 'normal' },
    { id: 'm3', user: MOCK_USERS[3], lastMessage: '性癖ルームから失礼します...', timestamp: new Date(), source: 'fetish' }
  ]);
  const [showMatchAnimation, setShowMatchAnimation] = useState<UserProfile | null>(null);

  // 自動スクロール
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [talkMessages, communitySubTab, fetishSubTab]);

  // 男性ユーザーを除外したベースリスト（女性のみ）
  const baseFemaleUsers = useMemo(() => {
    return MOCK_USERS.filter(u => u.gender === Gender.FEMALE);
  }, []);

  // 一覧タブ用の表示データ
  const displayUsers = useMemo(() => {
    let result = [...baseFemaleUsers];
    result = result.filter(u => {
      if (u.age < filters.minAge || u.age > filters.maxAge) return false;
      if (filters.residence && u.residence !== filters.residence) return false;
      return true;
    });
    return result;
  }, [filters, baseFemaleUsers]);

  const handleLike = (user: UserProfile, source: 'normal' | 'fetish' = 'normal') => {
    if (user.id === 'me') return;
    if (Math.random() > 0.8) {
      const newMatch: Match = {
        id: `m_${Date.now()}`,
        user: user,
        timestamp: new Date(),
        source: source
      };
      setMatches(prev => [newMatch, ...prev]);
      setShowMatchAnimation(user);
    }
    alert(`${user.nickname}さんに「いいね」を送りました！`);
  };

  const handleJoinCommunity = (id: string) => {
    if (!joinedCommunities.includes(id)) {
      setJoinedCommunities(prev => [...prev, id]);
    } else {
      setJoinedCommunities(prev => prev.filter(cid => cid !== id));
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now(),
      user: 'あなた',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTalkMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  const formatValue = (val: any) => (val === undefined || val === null || val === '') ? '--' : val;

  // コミュニティ詳細画面
  const renderCommunityDetail = (id: string) => {
    const community = COMMUNITIES.find(c => c.id === id);
    if (!community) return null;
    const isJoined = joinedCommunities.includes(id);
    // コミュニティ内でも女性のみ表示
    const members = baseFemaleUsers.filter(u => u.tags.includes(community.name));

    return (
      <div className="absolute inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-right duration-300">
        <header className="p-4 border-b flex items-center gap-4 bg-white sticky top-0 z-30">
          <button onClick={() => setSelectedCommunityId(null)} className="p-2 bg-gray-50 rounded-full text-gray-400">
            <ArrowLeft size={20}/>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-gray-900 truncate">{community.name}</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{community.members} メンバー</p>
          </div>
          <button 
            onClick={() => handleJoinCommunity(id)}
            className={`px-6 py-2 rounded-full text-xs font-black transition-all ${isJoined ? 'bg-gray-100 text-gray-400' : 'bg-pink-500 text-white shadow-lg shadow-pink-100'}`}
          >
            {isJoined ? '参加中' : '参加する'}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="relative aspect-[16/9] w-full shrink-0">
            <img src={community.image} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          <div className="sticky top-0 z-20 flex border-b bg-white shadow-sm">
            <button onClick={() => setCommunitySubTab('members')} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${communitySubTab === 'members' ? 'text-pink-500 border-b-4 border-pink-500 bg-pink-50/30' : 'text-gray-400'}`}>メンバー</button>
            <button onClick={() => setCommunitySubTab('talk')} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${communitySubTab === 'talk' ? 'text-pink-500 border-b-4 border-pink-500 bg-pink-50/30' : 'text-gray-400'}`}>トークルーム</button>
          </div>

          <div className="p-4">
            {communitySubTab === 'members' ? (
              <div className="grid grid-cols-3 gap-3">
                {members.map(user => (
                  <div key={user.id} onClick={() => { setViewingUser(user); setViewingSource('community'); }} className="cursor-pointer group">
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-white group-hover:scale-95 transition-transform">
                      <img src={user.photos[0]} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/20 text-white text-[8px] font-bold text-center">{user.age}歳</div>
                    </div>
                    <p className="text-[10px] font-bold text-gray-700 text-center mt-1 truncate">{user.nickname}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col min-h-[400px]">
                {!isJoined ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm mt-4">
                    <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-6"><Lock size={24} className="text-pink-300" /></div>
                    <h3 className="text-gray-900 font-black mb-2">参加してトークを見よう</h3>
                    <p className="text-[11px] text-gray-400 leading-relaxed mb-8">あなたも参加して、趣味仲間と繋がりましょう！</p>
                    <button onClick={() => handleJoinCommunity(id)} className="w-full py-4 bg-pink-500 text-white rounded-full font-black text-sm shadow-xl shadow-pink-100">コミュニティに参加する</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 pb-20">
                    {talkMessages.map(m => (
                      <div key={m.id} className={`flex flex-col ${m.user === 'あなた' ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{m.user}</span>
                          <span className="text-[8px] text-gray-300">{m.time}</span>
                        </div>
                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm ${m.user === 'あなた' ? 'bg-pink-500 text-white rounded-tr-none' : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'}`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {isJoined && communitySubTab === 'talk' && (
          <div className="p-4 bg-white border-t flex gap-2 items-center sticky bottom-0 z-40">
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="メッセージを入力..." className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm outline-none" />
            <button onClick={handleSendMessage} className={`p-3 rounded-xl transition-all ${newMessage.trim() ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-300'}`}><Send size={20} /></button>
          </div>
        )}
      </div>
    );
  };

  // 性癖詳細画面（プレミアムロール）
  const renderFetishDetail = (role: string) => {
    // プレミアムでも女性のみ表示
    const fetishUsers = baseFemaleUsers.filter(user => {
      if (searchFetishTag) {
        return user.tags.includes(searchFetishTag);
      }
      return true;
    });

    return (
      <div className="absolute inset-0 z-[100] bg-gray-900 flex flex-col animate-in slide-in-from-right duration-300">
        <header className="p-4 border-b border-white/10 flex items-center gap-4 bg-gray-900 sticky top-0 z-30">
          <button onClick={() => { setSelectedRole(null); setSearchFetishTag(null); }} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20}/>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-white truncate text-lg tracking-tight uppercase italic">{role} <span className="text-[10px] text-purple-400 not-italic ml-2 font-bold bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">プレミアム会員限定</span></h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {/* プレミアム・バナー */}
          <div className="relative aspect-[21/9] w-full shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black"></div>
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <Sparkles className="text-purple-400 mb-2 animate-pulse" size={32} />
              <p className="text-white font-black text-xl italic uppercase tracking-tighter">至高の聖域</p>
              <p className="text-purple-300 text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 mt-1">深い繋がりを求めて</p>
            </div>
          </div>

          {/* スティッキータブバー（ダークモード） */}
          <div className="sticky top-0 z-20 flex border-b border-white/10 bg-gray-900/95 backdrop-blur-md shadow-lg shadow-black/20">
            <button 
              onClick={() => setFetishSubTab('users')} 
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${fetishSubTab === 'users' ? 'text-purple-400 border-b-4 border-purple-400 bg-purple-500/10' : 'text-gray-500'}`}
            >
              候補者
            </button>
            <button 
              onClick={() => setFetishSubTab('talk')} 
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${fetishSubTab === 'talk' ? 'text-purple-400 border-b-4 border-purple-400 bg-purple-500/10' : 'text-gray-500'}`}
            >
              匿名トーク
            </button>
          </div>

          {/* タグ検索バー（Candidatesタブのみ表示） */}
          {fetishSubTab === 'users' && (
            <div className="sticky top-[52px] z-10 bg-gray-900/95 p-3 border-b border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2 px-1">
                <Hash size={14} className="text-purple-500" />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">タグ検索</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
                <button 
                  onClick={() => setSearchFetishTag(null)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${!searchFetishTag ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-500 border border-white/5'}`}
                >
                  すべて
                </button>
                {FETISH_TAGS.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSearchFetishTag(tag)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black transition-all whitespace-nowrap ${searchFetishTag === tag ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'bg-white/5 text-gray-500 border border-white/5 hover:bg-white/10'}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-6">
            {fetishSubTab === 'users' ? (
              <div className="flex flex-col gap-6">
                {searchFetishTag && (
                  <div className="flex justify-between items-center mb-2 px-1">
                    <p className="text-xs text-gray-400 font-bold">「#{searchFetishTag}」の候補者: {fetishUsers.length}名</p>
                    <button onClick={() => setSearchFetishTag(null)} className="text-[10px] text-purple-400 font-black uppercase underline">クリア</button>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-6">
                  {fetishUsers.length > 0 ? fetishUsers.map(user => (
                    <div key={user.id} onClick={() => { setViewingUser(user); setViewingSource('fetish'); }} className="cursor-pointer group">
                      <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group-hover:scale-105 transition-all duration-300">
                        <img src={user.photos[0]} className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-white font-black text-sm">{user.nickname}</span>
                            <span className="text-purple-400 text-[10px] font-bold">({user.age})</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {user.tags.filter(t => FETISH_TAGS.includes(t)).slice(0, 2).map(t => (
                              <span key={t} className={`text-[8px] px-2 py-0.5 rounded-full border uppercase font-bold tracking-tighter ${searchFetishTag === t ? 'bg-purple-600 border-purple-400 text-white' : 'bg-white/10 text-gray-400 border-white/5'}`}>#{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 bg-purple-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><Zap size={12} fill="white" /></div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-2 py-20 text-center flex flex-col items-center">
                      <Eye size={48} className="text-gray-800 mb-4 opacity-20" />
                      <p className="text-gray-500 text-sm font-bold">条件に合うお相手が見つかりません</p>
                      <button onClick={() => setSearchFetishTag(null)} className="mt-4 text-purple-400 font-black text-xs uppercase underline">全ての候補者を表示</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 pb-24">
                <div className="bg-purple-500/5 border border-purple-500/20 p-4 rounded-2xl mb-2">
                  <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest flex items-center gap-2 mb-1"><ShieldAlert size={12}/> 匿名トークの規約</p>
                  <p className="text-gray-500 text-[10px] leading-relaxed">ここでは匿名性が保証されます。礼儀を持って深い対話を楽しみましょう。</p>
                </div>
                {talkMessages.map(m => (
                  <div key={m.id} className={`flex flex-col ${m.user === 'あなた' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[9px] font-black text-purple-400 uppercase tracking-tighter">{m.user === 'あなた' ? 'プレミアムユーザー (あなた)' : `匿名ユーザー #${m.id}`}</span>
                    </div>
                    <div className={`max-w-[85%] px-5 py-3.5 rounded-3xl text-sm ${m.user === 'あなた' ? 'bg-purple-600 text-white rounded-tr-none shadow-xl shadow-purple-900/20' : 'bg-gray-800 text-gray-200 rounded-tl-none border border-white/5 shadow-lg'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>
        </div>

        {fetishSubTab === 'talk' && (
          <div className="p-4 bg-gray-900 border-t border-white/5 flex gap-2 items-center sticky bottom-0 z-40 pb-6">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 flex items-center gap-2 focus-within:ring-2 focus-within:ring-purple-500/40 transition-all">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="深い対話を始める..." 
                className="flex-1 bg-transparent text-white text-sm outline-none" 
              />
            </div>
            <button 
              onClick={handleSendMessage}
              className={`p-3.5 rounded-xl transition-all ${newMessage.trim() ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/40' : 'bg-white/5 text-gray-600'}`}
            >
              <Send size={20} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderProfileDetail = (user: UserProfile | any, source: string) => {
    const isMe = user.id === 'me';
    return (
      <div className="absolute inset-0 z-[110] flex flex-col animate-in slide-in-from-right duration-300 bg-white overflow-y-auto pb-32">
        <header className="fixed top-0 left-0 right-0 max-w-md mx-auto z-50 flex justify-between items-center p-4 bg-white/80 backdrop-blur-md">
          <button onClick={() => setViewingUser(null)} className="p-2 bg-black/5 rounded-full"><ArrowLeft size={20} /></button>
          <div className="flex gap-2">
            {!isMe && <button className="p-2 bg-black/5 rounded-full"><MoreHorizontal size={20} /></button>}
            {isMe && <button className="p-2 bg-black/5 rounded-full text-pink-500"><Edit3 size={20} /></button>}
          </div>
        </header>

        <div className="relative aspect-[3/4] w-full">
          <img src={user.photos[0]} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-black">{user.nickname}, {user.age}歳</h1>
              {user.isVerified && <Shield size={20} className="fill-blue-500 text-white" />}
            </div>
            <p className="opacity-80 text-xs">{user.residence} / 最終ログイン: 本日</p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <h3 className="font-bold text-lg mb-3">自己紹介</h3>
            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{user.bio || '--'}</p>
          </section>
          <section>
            <h3 className="font-bold text-lg mb-3">タグ</h3>
            <div className="flex flex-wrap gap-2">
              {user.tags.map((tag: string) => (
                <span key={tag} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${FETISH_TAGS.includes(tag) ? 'bg-purple-50 text-purple-500 border-purple-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>#{tag}</span>
              ))}
            </div>
          </section>
          {source === 'fetish' && (
             <section className="bg-purple-50 p-6 rounded-3xl border border-purple-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-purple-600">
                  <Flame size={20} />
                  <h3 className="font-black text-lg">性癖プロフィール</h3>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center py-2 border-b border-purple-100"><span className="text-[10px] text-purple-400 font-black uppercase">好きなプレイ</span><span className="text-xs font-bold text-purple-700">{user.fetishDesiredPlay || '未設定'}</span></div>
                   <div className="flex justify-between items-center py-2 border-b border-purple-100"><span className="text-[10px] text-purple-400 font-black uppercase">経験年数</span><span className="text-xs font-bold text-purple-700">{user.fetishYears || '未設定'}</span></div>
                   <div className="flex justify-between items-center py-2 border-b border-purple-100"><span className="text-[10px] text-purple-400 font-black uppercase">メインフェチ</span><span className="text-xs font-bold text-purple-700">{user.fetishPhilia || '未設定'}</span></div>
                </div>
             </section>
          )}
        </div>

        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xs flex gap-4 px-6 z-50">
          <button onClick={() => setViewingUser(null)} className="flex-1 h-14 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center text-gray-400 shadow-xl"><X size={28} /></button>
          <button onClick={() => { handleLike(user, source === 'fetish' ? 'fetish' : 'normal'); setViewingUser(null); }} className="flex-1 h-14 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-pink-200"><Heart size={28} fill="white" /></button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (viewingUser) return renderProfileDetail(viewingUser, viewingSource);
    if (selectedCommunityId) return renderCommunityDetail(selectedCommunityId);
    if (selectedRole) return renderFetishDetail(selectedRole);

    switch (activeTab) {
      case 'discover':
        return (
          <div className="p-4 flex flex-col gap-4">
            <header className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-black text-pink-500 italic uppercase">Genesis</h1>
              <div className="relative w-1/2">
                <input type="text" placeholder="検索" className="w-full bg-white border rounded-full py-1 px-4 text-xs" />
                <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              </div>
            </header>
            <CardStack users={baseFemaleUsers} onSwipeRight={(u) => handleLike(u, 'normal')} onSwipeLeft={() => {}} />
          </div>
        );
      case 'list':
        return (
          <div className="min-h-screen bg-white">
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md p-4 border-b">
              <h1 className="text-xl font-black">一覧から探す</h1>
              <div className="flex gap-2 mt-4">
                <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 rounded-xl text-xs font-black text-gray-500 border border-gray-100"><Filter size={14} /> 絞り込み</button>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 rounded-xl text-xs font-black text-gray-500 border border-gray-100"><ArrowUpDown size={14} /> おすすめ順</button>
              </div>
            </header>
            <div className="p-4 grid grid-cols-2 gap-4">
              {displayUsers.map(user => (
                <div key={user.id} onClick={() => { setViewingUser(user); setViewingSource('normal'); }} className="group">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2">
                    <img src={user.photos[0]} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-2 left-3"><p className="text-white text-xs font-black">{user.nickname}, {user.age}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'community':
        return (
          <div className="p-6 pb-24 h-full overflow-y-auto">
            <h1 className="text-3xl font-black mb-8 tracking-tighter italic">コミュニティ</h1>
            <div className="grid grid-cols-2 gap-4">
              {COMMUNITIES.map(comm => (
                <div key={comm.id} onClick={() => setSelectedCommunityId(comm.id)} className="bg-white rounded-[2.5rem] border-2 border-gray-50 overflow-hidden shadow-sm active:scale-95 transition-all">
                  <div className="relative aspect-square overflow-hidden"><img src={comm.image} className="w-full h-full object-cover" /></div>
                  <div className="p-4 text-center">
                    <span className="font-black text-xs block truncate uppercase">{comm.name}</span>
                    <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">{comm.members} メンバー</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'fetish':
        return (
          <div className="p-6 flex flex-col items-center justify-center min-h-[85vh] h-full overflow-y-auto pb-24">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-purple-100 animate-pulse"><Flame className="text-purple-600" size={40} /></div>
            <h1 className="text-4xl font-black mb-2 tracking-tighter italic text-gray-900 uppercase">性癖ルーム</h1>
            <p className="text-gray-400 text-[10px] font-bold text-center mb-12 px-8 uppercase tracking-[0.2em] leading-relaxed">プレミアム会員限定の特別な空間<br/>深い繋がりを求めるあなたへ</p>
            {!isPremium ? (
              <div className="w-full max-w-xs space-y-6">
                <div className="p-12 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center gap-4 text-center">
                  <Lock className="text-gray-200" size={48} />
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">アップグレードして入室</p>
                </div>
                <button onClick={() => setIsPremium(true)} className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-black py-5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase text-sm tracking-widest">プレミアム会員になる</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 w-full max-w-xs animate-in zoom-in duration-300">
                <button onClick={() => setSelectedRole('S男 M女')} className="group relative h-28 bg-gray-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl active:scale-95 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex flex-col items-center justify-center h-full relative z-10">
                    <span className="text-xl font-black text-white italic">S男 M女</span>
                    <span className="text-[9px] font-black text-purple-400 mt-1 uppercase tracking-widest">支配・服従を求める方</span>
                  </div>
                </button>
                <button onClick={() => setSelectedRole('M男 S女')} className="group relative h-28 bg-gray-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl active:scale-95 transition-all">
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex flex-col items-center justify-center h-full relative z-10">
                    <span className="text-xl font-black text-white italic">M男 S女</span>
                    <span className="text-[9px] font-black text-indigo-400 mt-1 uppercase tracking-widest">愛と奉仕を求める方</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        );
      case 'matches':
        return (
          <div className="bg-white min-h-screen flex flex-col h-full overflow-hidden">
             <header className="p-4 border-b">
              <h1 className="font-black text-2xl uppercase italic tracking-tighter">メッセージ</h1>
              <div className="flex bg-gray-50 p-1 rounded-2xl mt-4">
                <button onClick={() => setMatchSubTab('normal')} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all uppercase ${matchSubTab === 'normal' ? 'bg-white text-pink-500 shadow-lg' : 'text-gray-400'}`}>通常</button>
                <button onClick={() => setMatchSubTab('fetish')} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all uppercase ${matchSubTab === 'fetish' ? 'bg-white text-purple-500 shadow-lg' : 'text-gray-400'}`}>性癖</button>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto pb-24">
              <ChatList matches={matches.filter(m => m.source === matchSubTab)} onSelect={(id) => alert(`チャットID: ${id}`)} />
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="bg-white min-h-screen pb-24 h-full overflow-y-auto">
            <header className="p-6 flex justify-between items-center bg-white sticky top-0 z-10">
              <h1 className="text-xl font-black italic text-pink-500 uppercase">マイページ</h1>
              <button className="p-2 bg-gray-50 rounded-full"><Settings size={22} /></button>
            </header>
            <div className="p-6 space-y-8">
              <div className="bg-white rounded-[3rem] p-8 shadow-2xl shadow-pink-100 border border-pink-50 flex flex-col items-center cursor-pointer" onClick={() => setViewingUser(ME_USER)}>
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden mb-4"><img src={ME_USER.photos[0]} className="w-full h-full object-cover" /></div>
                <h2 className="text-2xl font-black">{ME_USER.nickname}, {ME_USER.age}歳</h2>
                <button className="mt-6 w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">プロフィール編集 <ChevronRight size={14}/></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-center">
                   <p className="text-2xl font-black text-pink-500">256</p>
                   <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">もらったいいね</p>
                </div>
                <div onClick={() => setIsPremium(!isPremium)} className={`p-6 rounded-[2rem] border shadow-sm text-center cursor-pointer transition-all ${isPremium ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-100'}`}>
                   <p className={`text-2xl font-black ${isPremium ? 'text-purple-600' : 'text-gray-400'}`}>{isPremium ? '有料会員' : '無料会員'}</p>
                   <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">ステータス</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-gray-50 flex flex-col shadow-2xl overflow-hidden relative font-sans">
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto">{renderContent()}</div>
      </main>
      
      {!viewingUser && !selectedCommunityId && !selectedRole && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around items-center h-20 px-1 z-40">
          {NAVIGATION_ITEMS.map(item => (
            <button 
              key={item.id} 
              onClick={() => {
                setActiveTab(item.id);
                setSelectedRole(null);
                setSelectedCommunityId(null);
              }} 
              className={`flex flex-col items-center justify-center gap-1 flex-1 transition-all ${activeTab === item.id ? (activeTab === 'fetish' ? 'text-purple-600' : 'text-pink-500') : 'text-gray-300'}`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${activeTab === item.id ? (activeTab === 'fetish' ? 'bg-purple-50 scale-110' : 'bg-pink-50 scale-110') : ''}`}>{item.icon}</div>
              <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </nav>
      )}

      {showMatchAnimation && (
        <div className="absolute inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-8 text-white animate-in zoom-in duration-500">
          <Sparkles className="text-pink-500 mb-4 animate-bounce" size={48} />
          <h2 className="text-6xl font-black italic mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">MATCHED!</h2>
          <p className="text-sm font-bold opacity-60 mb-12 uppercase tracking-widest">{showMatchAnimation.nickname} さんとマッチしました</p>
          <div className="flex gap-4 mb-16 relative">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-2xl overflow-hidden"><img src={ME_USER.photos[0]} className="w-full h-full object-cover" /></div>
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-2xl overflow-hidden"><img src={showMatchAnimation.photos[0]} className="w-full h-full object-cover" /></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-500 p-2 rounded-full shadow-lg border-2 border-white"><Heart size={20} fill="white" /></div>
          </div>
          <button onClick={() => { setShowMatchAnimation(null); setActiveTab('matches'); }} className="w-full bg-white text-pink-500 py-5 rounded-full font-black text-lg shadow-2xl active:scale-95 transition-all uppercase tracking-widest">メッセージを送る</button>
          <button onClick={() => setShowMatchAnimation(null)} className="mt-8 text-white/40 font-bold text-[10px] uppercase tracking-widest">探し続ける</button>
        </div>
      )}
    </div>
  );
};

export default App;
