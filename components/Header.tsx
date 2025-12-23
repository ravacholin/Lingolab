import React from 'react';
import { Camera, BookMarked } from 'lucide-react';
import { AppState } from '../types';

interface HeaderProps {
  currentState: AppState;
  onNavigate: (state: AppState) => void;
  savedCount: number;
}

const Header: React.FC<HeaderProps> = ({ currentState, onNavigate, savedCount }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => onNavigate(AppState.HOME)}
        >
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center border-2 border-black group-hover:bg-lime-300 group-hover:text-black transition-colors">
            <Camera size={20} strokeWidth={2.5} />
          </div>
          <h1 className="font-bold text-2xl text-black tracking-tight uppercase">LingoLens</h1>
        </div>
        
        <button 
          onClick={() => onNavigate(AppState.SAVED)}
          className={`relative p-2 border-2 border-black transition-all ${
            currentState === AppState.SAVED 
              ? 'bg-black text-white' 
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          <BookMarked size={20} strokeWidth={2} />
          {savedCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-black">
              {savedCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;