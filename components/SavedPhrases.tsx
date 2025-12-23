import React from 'react';
import PhraseCard from './PhraseCard';
import { SavedPhrase } from '../types';
import { Trash2, ArrowLeft } from 'lucide-react';
import { AppState } from '../types';

interface SavedPhrasesProps {
  savedPhrases: SavedPhrase[];
  onDelete: (id: string) => void;
  onNavigate: (state: AppState) => void;
}

const SavedPhrases: React.FC<SavedPhrasesProps> = ({ savedPhrases, onDelete, onNavigate }) => {
  return (
    <div className="max-w-md mx-auto p-4 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => onNavigate(AppState.HOME)}
          className="w-10 h-10 flex items-center justify-center border-2 border-black bg-white shadow-hard-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h2 className="text-3xl font-black uppercase text-black">Saved</h2>
      </div>

      {savedPhrases.length === 0 ? (
        <div className="text-center py-20 bg-white border-2 border-black border-dashed">
          <p className="text-gray-500 font-medium">Collection Empty</p>
          <button 
            onClick={() => onNavigate(AppState.HOME)}
            className="mt-6 inline-block bg-black text-white px-6 py-3 font-bold uppercase border-2 border-black hover:bg-lime-300 hover:text-black transition-colors"
          >
            Start Scanning
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {savedPhrases.map((phrase) => (
            <div key={phrase.id} className="relative group">
              <PhraseCard phrase={phrase} />
              <button
                onClick={() => onDelete(phrase.id)}
                className="absolute -top-3 -right-3 p-2 bg-red-500 text-white border-2 border-black shadow-hard-sm hover:bg-red-600 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all z-10"
                aria-label="Delete phrase"
              >
                <Trash2 size={18} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPhrases;