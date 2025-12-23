import React, { useState } from 'react';
import PhraseCard from './PhraseCard';
import { Phrase } from '../types';
import { RotateCcw, Sparkles, ArrowRight } from 'lucide-react';

interface PhraseListProps {
  phrases: Phrase[];
  onSave: (phrase: Phrase) => void;
  onReset: () => void;
  onRegenerate: (prompt: string) => void;
  savedIds: Set<string>; 
}

const PhraseList: React.FC<PhraseListProps> = ({ phrases, onSave, onReset, onRegenerate, savedIds }) => {
  const [refinePrompt, setRefinePrompt] = useState("");

  const handleRegenerateClick = () => {
    onRegenerate(refinePrompt);
    setRefinePrompt(""); 
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-32">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black uppercase text-black">Results</h2>
        <button 
          onClick={onReset}
          className="text-sm font-bold text-black flex items-center gap-2 bg-white border-2 border-black px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors shadow-hard-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <RotateCcw size={16} />
          RESET
        </button>
      </div>

      <div className="space-y-6 mb-12">
        {phrases.map((phrase, index) => {
           const isSaved = savedIds.has(phrase.portuguese);
           return (
            <PhraseCard 
              key={`${index}-${phrase.portuguese}`} 
              phrase={phrase} 
              onSave={onSave}
              isSaved={isSaved}
            />
          );
        })}
      </div>

      {/* Refine / Regenerate Section */}
      <div className="bg-lime-200 border-2 border-black p-4 shadow-hard">
        <h3 className="text-sm font-bold text-black uppercase mb-3 flex items-center gap-2">
          <Sparkles size={16} />
          Refine Results
        </h3>
        <div className="flex gap-0">
          <input
            type="text"
            value={refinePrompt}
            onChange={(e) => setRefinePrompt(e.target.value)}
            placeholder="e.g. 'Make it aggressive'..."
            className="flex-1 px-4 py-3 text-base font-medium border-2 border-black border-r-0 focus:outline-none focus:bg-white bg-white/50 placeholder-black/50"
            onKeyDown={(e) => e.key === 'Enter' && handleRegenerateClick()}
          />
          <button
            onClick={handleRegenerateClick}
            className="bg-black text-white px-4 border-2 border-black border-l-0 hover:bg-gray-800 transition-colors"
            title="Generate New Phrases"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhraseList;