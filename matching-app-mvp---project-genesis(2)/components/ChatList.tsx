
import React from 'react';
import { Match } from '../types';

interface ChatListProps {
  matches: Match[];
  onSelect: (matchId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ matches, onSelect }) => {
  return (
    <div className="divide-y divide-gray-100">
      <div className="p-4">
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">新しいマッチング</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {matches.filter(m => !m.lastMessage).length > 0 ? (
            matches.filter(m => !m.lastMessage).map(match => (
              <div 
                key={match.id} 
                onClick={() => onSelect(match.id)}
                className="flex-shrink-0 cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src={match.user.photos[0]} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-pink-500 p-0.5" 
                    alt="" 
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-pink-500 rounded-full border-2 border-white"></div>
                </div>
                <p className="text-[10px] font-bold text-center mt-1 truncate w-16 text-gray-700">{match.user.nickname}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-300 italic">新しいマッチングはありません</p>
          )}
        </div>
      </div>

      <div className="flex-1">
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest p-4 pb-2">やり取り中</h2>
        {matches.filter(m => m.lastMessage).length > 0 ? (
          matches.filter(m => m.lastMessage).map(match => (
            <div 
              key={match.id} 
              onClick={() => onSelect(match.id)}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <img 
                src={match.user.photos[0]} 
                className="w-14 h-14 rounded-full object-cover" 
                alt="" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900 text-sm">{match.user.nickname}</h3>
                  <span className="text-[10px] text-gray-400">本日 12:34</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{match.lastMessage}</p>
              </div>
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-300">
            <p className="text-xs">メッセージのやり取りはありません</p>
          </div>
        )}
      </div>
    </div>
  );
};
