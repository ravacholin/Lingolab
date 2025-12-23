import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Phrase } from "../types";
import { decode, decodeAudioData } from "./audioUtils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Reuse AudioContext to prevent initialization lag and browser limits
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

export const generatePhrasesFromImage = async (base64Image: string, mimeType: string, customPrompt?: string): Promise<Phrase[]> => {
  try {
    let promptText = `
      ROLE: You are a helpful local guide and language tutor helping a traveler.
      TASK: Write 5 conversational lines in PORTUGUESE for a person in the scene shown in the image.
      
      STEP 1: IDENTIFY THE SCENE
      - What is the character doing? (e.g. buying art, ordering coffee, asking for directions, greeting someone).
      - If no specific activity is obvious, assume a polite social interaction relevant to the objects shown.

      STEP 2: GENERATE LINES
      - Output 5 natural phrases the character would SAY.
      - Provide Spanish translations.
      - DEFAULT TONE: Cordial, polite, and friendly. Avoid slang or rudeness unless explicitly asked.
    `;

    if (customPrompt && customPrompt.trim()) {
      promptText += `
        \n\nUSER DIRECTION: "${customPrompt}"
        
        CRITICAL INSTRUCTIONS FOR HANDLING USER DIRECTION:
        1. IF THE USER GIVES A "TOPIC" (e.g. "buying a ticket"): 
           - Switch the scene to that topic.
           
        2. IF THE USER GIVES A "TONE" or "ADJECTIVE" (e.g. "aggressive", "romantic", "shy"):
           - OVERRIDE the default polite tone.
           - CHANGE THE CHARACTER'S PERSONALITY to match the requested tone.
           
           *** FATAL ERROR TO AVOID ***
           - DO NOT describe the object using the adjective.
           - DO NOT say "The painting is aggressive".
           - DO SAY "This painting is garbage! The price is an insult!" (Aggressive Character).
           
           The adjective applies to the SPEAKER, not the IMAGE.
      `;
    }

    // gemini-3-flash-preview is the fastest model, but we strictly disable thinking to ensure low latency
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 }, // SPEED OPTIMIZATION: Disable reasoning to react instantly
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              portuguese: { type: Type.STRING },
              spanish: { type: Type.STRING },
              context: { type: Type.STRING, description: "Brief label of context (e.g. 'Polite Greeting', 'Asking Price')" },
            },
            required: ["portuguese", "spanish", "context"],
          },
        },
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) return [];
    
    return JSON.parse(jsonStr) as Phrase[];
  } catch (error) {
    console.error("Error generating phrases:", error);
    throw error;
  }
};

export const playTextToSpeech = async (text: string, voiceName: 'Kore' | 'Puck' = 'Kore'): Promise<void> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio data returned");
    }

    const ctx = getAudioContext();
    const outputNode = ctx.createGain();
    outputNode.connect(ctx.destination);

    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      ctx,
      24000,
      1,
    );

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputNode);
    source.start();
    
    return new Promise((resolve) => {
        source.onended = () => resolve();
    });

  } catch (error) {
    console.error("Error playing TTS:", error);
    throw error;
  }
};