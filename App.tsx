import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PhraseList from './components/PhraseList';
import SavedPhrases from './components/SavedPhrases';
import ApiKeyScreen from './components/ApiKeyScreen';
import { generatePhrasesFromImage } from './services/geminiService';
import { Phrase, SavedPhrase, AppState } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [currentImage, setCurrentImage] = useState<{base64: string, mimeType: string} | null>(null);
  const [initialContext, setInitialContext] = useState<string>(""); // Store the original topic
  
  // Check for API Key on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('lingoLens_apiKey');
    const envKey = process.env.API_KEY;
    
    if (storedKey || envKey) {
      setHasApiKey(true);
    }
  }, []);

  // Load saved phrases on mount
  useEffect(() => {
    const saved = localStorage.getItem('lingoLens_saved');
    if (saved) {
      try {
        setSavedPhrases(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved phrases", e);
      }
    }
  }, []);

  // Persist saved phrases
  useEffect(() => {
    localStorage.setItem('lingoLens_saved', JSON.stringify(savedPhrases));
  }, [savedPhrases]);

  const handleImageSelected = async (base64: string, mimeType: string, prompt?: string) => {
    setCurrentImage({ base64, mimeType });
    setInitialContext(prompt || ""); // Save the initial context/topic
    setAppState(AppState.ANALYZING);
    
    try {
      const generatedPhrases = await generatePhrasesFromImage(base64, mimeType, prompt);
      setPhrases(generatedPhrases);
      setAppState(AppState.RESULTS);
    } catch (error) {
      console.error(error);
      alert("Something went wrong analyzing the image. Please check your API Key or try again.");
      setAppState(AppState.HOME);
    }
  };

  const handleRegenerate = async (refinePrompt: string) => {
    if (!currentImage) return;

    setAppState(AppState.ANALYZING);
    
    // Combine original context with new instruction to prevent topic drift
    let fullPrompt = refinePrompt;
    if (initialContext) {
      fullPrompt = `Original Topic/Context: "${initialContext}". \nUser Refinement/Change: "${refinePrompt}"`;
    }

    try {
      const generatedPhrases = await generatePhrasesFromImage(currentImage.base64, currentImage.mimeType, fullPrompt);
      setPhrases(generatedPhrases);
      setAppState(AppState.RESULTS);
    } catch (error) {
       console.error(error);
       alert("Failed to regenerate phrases.");
       setAppState(AppState.RESULTS);
    }
  }

  const handleSavePhrase = (phrase: Phrase) => {
    const newSavedPhrase: SavedPhrase = {
      ...phrase,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setSavedPhrases((prev) => [newSavedPhrase, ...prev]);
  };

  const handleDeletePhrase = (id: string) => {
    setSavedPhrases((prev) => prev.filter((p) => p.id !== id));
  };

  if (!hasApiKey) {
    return <ApiKeyScreen onKeySaved={() => setHasApiKey(true)} />;
  }

  const savedIds = new Set(savedPhrases.map(p => p.portuguese));

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f0]">
      <Header 
        currentState={appState} 
        onNavigate={setAppState} 
        savedCount={savedPhrases.length} 
      />

      <main className="flex-1 w-full max-w-md mx-auto">
        {appState === AppState.HOME && (
          <ImageUploader onImageSelected={handleImageSelected} />
        )}

        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
            <div className="border-4 border-black p-6 bg-white shadow-hard">
               <Loader2 size={64} className="text-black animate-spin" strokeWidth={3} />
            </div>
            <h3 className="mt-8 text-3xl font-black uppercase text-black tracking-widest animate-pulse">
              ANALYZING
            </h3>
            <p className="mt-2 text-black font-medium font-mono border-t-2 border-black pt-2">
              WAITING FOR GEMINI...
            </p>
          </div>
        )}

        {appState === AppState.RESULTS && (
          <PhraseList 
            phrases={phrases} 
            onSave={handleSavePhrase} 
            onReset={() => {
              setCurrentImage(null);
              setInitialContext("");
              setAppState(AppState.HOME);
            }}
            onRegenerate={handleRegenerate}
            savedIds={savedIds}
          />
        )}

        {appState === AppState.SAVED && (
          <SavedPhrases 
            savedPhrases={savedPhrases} 
            onDelete={handleDeletePhrase} 
            onNavigate={setAppState}
          />
        )}
      </main>
    </div>
  );
};

export default App;