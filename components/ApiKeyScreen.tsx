import React, { useState } from 'react';
import { Key, ArrowRight, ExternalLink, CheckCircle2 } from 'lucide-react';

interface ApiKeyScreenProps {
  onKeySaved: () => void;
}

const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onKeySaved }) => {
  const [key, setKey] = useState('');

  const handleSave = () => {
    if (key.trim().length > 10) {
      localStorage.setItem('lingoLens_apiKey', key.trim());
      onKeySaved();
    } else {
      alert("Please enter a valid API Key.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f0f0f0]">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-lime-300 border-2 border-black flex items-center justify-center mx-auto shadow-hard">
            <Key size={40} strokeWidth={2} className="text-black" />
          </div>
          <h1 className="text-4xl font-black uppercase text-black">Unlock<br/>LingoLens</h1>
          <p className="text-gray-600 font-medium text-lg">
            To use this app, you need a free Google Gemini API Key.
          </p>
        </div>

        <div className="bg-white border-2 border-black p-6 shadow-hard space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-black uppercase tracking-wider flex items-center gap-2">
              <span className="bg-black text-white w-6 h-6 flex items-center justify-center rounded-full text-sm">1</span>
              Get your key
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Go to Google AI Studio and create a new API key. It is free for personal use.
            </p>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full py-3 bg-white border-2 border-black text-center font-bold uppercase text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              Open AI Studio <ExternalLink size={16} />
            </a>
          </div>

          <div className="space-y-4 border-t-2 border-dashed border-gray-300 pt-6">
            <h3 className="font-bold text-black uppercase tracking-wider flex items-center gap-2">
              <span className="bg-black text-white w-6 h-6 flex items-center justify-center rounded-full text-sm">2</span>
              Paste it here
            </h3>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full p-4 bg-gray-50 border-2 border-black focus:outline-none focus:bg-lime-50 font-mono text-sm"
            />
            <button
              onClick={handleSave}
              disabled={key.length < 10}
              className="w-full py-4 bg-lime-300 text-black border-2 border-black font-black text-xl uppercase tracking-widest shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Start App <ArrowRight size={24} strokeWidth={3} />
            </button>
            <p className="text-xs text-gray-400 text-center font-medium mt-2">
              Your key is stored locally on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyScreen;