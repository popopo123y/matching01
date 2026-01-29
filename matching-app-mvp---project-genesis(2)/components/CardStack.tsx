
import React, { useState } from 'react';
import { Heart, X, Info } from 'lucide-react';
import { UserProfile } from '../types';
import { FETISH_TAGS } from '../constants';

interface CardStackProps {
  users: UserProfile[];
  onSwipeRight: (user: UserProfile) => void;
  onSwipeLeft: (user: UserProfile) => void;
  onViewDetail: (user: UserProfile) => void;
}

export const CardStack: React.FC<CardStackProps> = ({ users, onSwipeRight, onSwipeLeft, onViewDetail }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (currentIndex >= users.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center p-8">
        <div className="bg-white rounded-full p-6 shadow-xl mb-4">
          <Heart className="text-pink-500 w-12 h-12" />
        </div>
        <h3 className="text-xl font-bold mb-2">本日の紹介は終了しました</h3>
        <p className="text-gray-500 text-sm">明日また新しいお相手をご紹介します！</p>
      </div>
    );
  }

  const user = users[currentIndex];

  const handleAction = (e: React.MouseEvent, direction: 'left' | 'right') => {
    e.stopPropagation();
    if (direction === 'right') onSwipeRight(user);
    else onSwipeLeft(user);
    setCurrentIndex(prev => prev + 1);
  };

  // 性癖関連のタグを除外
  const filteredTags = user.tags.filter(tag => !FETISH_TAGS.includes(tag));

  return (
    <div className="relative w-full max-w-sm mx-auto h-[600px]">
      <div 
        onClick={() => onViewDetail(user)}
        className="absolute inset-0 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="relative flex-1">
          <img 
            src={user.photos[0]} 
            alt={user.nickname}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold">{user.nickname}, {user.age}</h2>
              {user.isVerified && (
                <div className="bg-blue-500 rounded-full p-1">
                  <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                </div>
              )}
            </div>
            <p className="text-sm opacity-90 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {user.residence}
            </p>
          </div>
          <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md p-2 rounded-full text-white">
            <Info size={20} />
          </div>
        </div>

        <div className="p-4 bg-white">
          <div className="flex flex-wrap gap-2 mb-4">
            {filteredTags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] bg-gray-50 px-2 py-1 rounded-full font-bold text-gray-400 border border-gray-100 uppercase">
                #{tag}
              </span>
            ))}
          </div>
          
          <div className="flex justify-around items-center pt-2">
            <button 
              onClick={(e) => handleAction(e, 'left')}
              className="w-16 h-16 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-300 hover:bg-gray-50 transition-colors"
            >
              <X size={32} />
            </button>
            <button 
              onClick={(e) => handleAction(e, 'right')}
              className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-lg shadow-pink-100 hover:bg-pink-600 transition-colors scale-110"
            >
              <Heart size={32} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
