import React, { useState } from 'react';
import { Play, Bookmark, Check, Loader2, Volume2, Mic } from 'lucide-react';
import { Phrase, AudioState } from '../types';
import { playTextToSpeech } from '../services/geminiService';

interface PhraseCardProps {
  phrase: Phrase;
  onSave?: (phrase: Phrase) => void;
  onDelete?: (id: string) => void; // For saved list
  isSaved?: boolean;
}

const PhraseCard: React.FC<PhraseCardProps> = ({ phrase, onSave, isSaved = false }) => {
  const [audioState, setAudioState] = useState<AudioState>(AudioState.IDLE);
  const [saved, setSaved] = useState(isSaved);

  const handlePlay = async () => {
    if (audioState !== AudioState.IDLE) return;

    setAudioState(AudioState.LOADING);
    try {
      await playTextToSpeech(phrase.portuguese);
      setAudioState(AudioState.PLAYING);
      setTimeout(() => setAudioState(AudioState.IDLE), 500); 
    } catch (e) {
      console.error(e);
      setAudioState(AudioState.IDLE);
    }
  };

  const handleSave = () => {
    if (onSave && !saved) {
      onSave(phrase);
      setSaved(true);
    }
  };

  return (
    <div className="bg-white border-2 border-black p-5 shadow-hard hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
      <div className="flex justify-between items-start mb-4">
        <span className="inline-block px-2 py-1 text-xs font-bold border-2 border-black bg-black text-white uppercase tracking-wider">
          {phrase.context}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handlePlay}
            disabled={audioState !== AudioState.IDLE}
            className="w-10 h-10 flex items-center justify-center border-2 border-black bg-lime-300 hover:bg-lime-400 active:bg-lime-500 transition-colors disabled:opacity-50 disabled:bg-gray-200"
            aria-label="Listen to phrase"
          >
             {audioState === AudioState.LOADING ? (
              <Loader2 size={20} className="animate-spin" />
            ) : audioState === AudioState.PLAYING ? (
               <Volume2 size={20} className="animate-pulse" />
            ) : (
              <Play size={20} fill="currentColor" strokeWidth={2} />
            )}
          </button>
          
          {onSave && (
            <button
              onClick={handleSave}
              disabled={saved}
              className={`w-10 h-10 flex items-center justify-center border-2 border-black transition-colors ${
                saved 
                  ? 'bg-black text-white' 
                  : 'bg-white hover:bg-gray-100'
              }`}
              aria-label="Save phrase"
            >
              {saved ? <Check size={20} strokeWidth={3} /> : <Bookmark size={20} strokeWidth={2} />}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl font-black text-black leading-tight">
          {phrase.portuguese}
        </h3>
        <div className="h-0.5 w-full bg-gray-200"></div>
        <p className="text-gray-600 font-medium text-lg leading-snug">
          {phrase.spanish}
        </p>
      </div>
    </div>
  );
};

export default PhraseCard;