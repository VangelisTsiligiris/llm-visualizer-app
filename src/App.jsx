import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Cpu, 
  MessageSquare, 
  Zap, 
  ArrowRight, 
  Activity, 
  Layers, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl ${className}`}>
    {children}
  </div>
);

export default function LLMVisualizer() {
  // --- State Management ---
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [useMockMode, setUseMockMode] = useState(false); // New feature: Mock mode
  
  // The 4 main stages of the LLM lifecycle
  const [currentStage, setCurrentStage] = useState('idle'); // idle, tokenizing, embedding, reasoning, generating, complete
  
  // Data for visualization
  const [tokens, setTokens] = useState([]);
  const [embeddingMatrix, setEmbeddingMatrix] = useState([]);
  const [generatedText, setGeneratedText] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [error, setError] = useState(null);

  // --- Animation Helpers ---
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // --- The Core Logic ---
  const handleStart = async (e) => {
    e.preventDefault();
    if (!prompt) return;
    if (!apiKey && !useMockMode) {
      setError("Please enter an API Key or enable Mock Mode");
      return;
    }

    // Reset State
    setIsProcessing(true);
    setCurrentStage('tokenizing');
    setGeneratedText('');
    setDisplayedText('');
    setError(null);
    setTokens([]);

    try {
      // --- STAGE 1: TOKENIZATION ---
      // Real logic: We split by space/punctuation to simulate tokens
      const simulatedTokens = prompt.split(/(\s+)/).filter(t => t.trim().length > 0);
      
      for (let i = 0; i < simulatedTokens.length; i++) {
        setTokens(prev => [...prev, simulatedTokens[i]]);
        await sleep(150); // Delay to visualize "reading"
      }
      await sleep(500);

      // --- STAGE 2: EMBEDDING ---
      setCurrentStage('embedding');
      // Create a fake 8x8 matrix to visualize vector conversion
      const matrix = Array(64).fill(0).map(() => Math.random());
      setEmbeddingMatrix(matrix);
      await sleep(1500);

      // --- STAGE 3: REASONING (The API Call) ---
      setCurrentStage('reasoning');
      let responseText = "";

      if (useMockMode) {
        // Mock Mode logic
        await sleep(2000);
        responseText = "This is a simulated response. Because you are in Mock Mode, I didn't actually call Google's servers, but I'm showing you how the UI would look if I did! In a real scenario, this text is generated based on your vector embeddings.";
      } else {
        // Real API Call
        responseText = await callGemini(prompt, apiKey);
      }

      setGeneratedText(responseText);
      
      // --- STAGE 4: GENERATION (Streaming effect) ---
      setCurrentStage('generating');
      const responseTokens = responseText.split("");
      
      for (let i = 0; i < responseTokens.length; i++) {
        setDisplayedText(prev => prev + responseTokens[i]);
        // Random variance in typing speed to feel "human/AI"
        await sleep(Math.random() * 30 + 10); 
      }

      setCurrentStage('complete');

    } catch (err) {
      console.error(err);
      setError(err.message);
      setCurrentStage('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- API Function ---
  const callGemini = async (userPrompt, key) => {
    try {
      // NOTE: We are using gemini-1.5-flash here. It is the most reliable free tier model.
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }]
          })
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (error.message.includes("Failed to fetch")) {
        throw new Error("CORS Error: Localhost is blocked by Google. Please verify your API key or try deploying this app.");
      }
      throw error;
    }
  };

  // --- Render Helpers ---
  const getStageColor = (stageId) => {
    const stages = ['tokenizing', 'embedding', 'reasoning', 'generating', 'complete'];
    if (currentStage === stageId) return "text-blue-400 border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.5)]";
    if (stages.indexOf(currentStage) > stages.indexOf(stageId)) return "text-green-400 border-green-500/50 opacity-50";
    return "text-slate-600 border-slate-800 bg-slate-900";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-4 ring-1 ring-blue-500/50">
            <Brain className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Neural Process Visualizer
          </h1>
          <p className="text-slate-400">See inside the "Brain" of an LLM</p>
        </header>

        {/* Input Control Panel */}
        <Card className="p-6">
          <form onSubmit={handleStart} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Google Gemini API Key</label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  disabled={useMockMode || isProcessing}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50"
                />
              </div>
              <div className="flex items-end pb-1">
                 <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 transition w-full">
                    <input 
                      type="checkbox" 
                      checked={useMockMode} 
                      onChange={(e) => setUseMockMode(e.target.checked)}
                      className="w-5 h-5 accent-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-300">Enable Mock Mode (No API Key needed)</span>
                 </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Your Prompt</label>
              <div className="relative">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Why is the sky blue?"
                  disabled={isProcessing}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 h-24 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                />
                <button 
                  type="submit"
                  disabled={isProcessing || !prompt}
                  className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isProcessing ? <Activity className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {isProcessing ? 'Processing...' : 'Run Model'}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 p-3 rounded-lg flex items-center gap-2 text-red-200 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </form>
        </Card>

        {/* Visualizer Pipeline */}
        {/* Only show if we have started or are processing */}
        {(isProcessing || currentStage !== 'idle') && (
          <div className="space-y-6 animate-in fade-in duration-700">
            
            {/* Status Indicators */}
            <div className="flex justify-between md:justify-center gap-2 md:gap-8 overflow-x-auto pb-2">
              {[
                { id: 'tokenizing', icon: Layers, label: 'Tokenization' },
                { id: 'embedding', icon: Cpu, label: 'Embedding' },
                { id: 'reasoning', icon: Brain, label: 'Reasoning' },
                { id: 'generating', icon: MessageSquare, label: 'Generation' },
              ].map((step, idx) => (
                <div key={step.id} className={`flex flex-col items-center gap-2 min-w-[80px] transition-all duration-500 ${currentStage === step.id ? 'scale-110' : 'opacity-60'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${getStageColor(step.id)}`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-medium uppercase ${currentStage === step.id ? 'text-blue-400' : 'text-slate-600'}`}>{step.label}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Inputs & Processing */}
              <div className="space-y-6">
                
                {/* Stage 1: Tokens */}
                <Card className={`transition-all duration-500 ${currentStage === 'tokenizing' ? 'ring-2 ring-blue-500/50' : ''}`}>
                  <div className="bg-slate-950/50 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">Input Layer</span>
                    {currentStage === 'tokenizing' && <span className="text-xs text-blue-400 animate-pulse">Tokenizing...</span>}
                  </div>
                  <div className="p-4 min-h-[100px] flex flex-wrap gap-2 content-start">
                    {tokens.map((t, i) => (
                      <span key={i} className="bg-purple-500/20 border border-purple-500/40 text-purple-200 px-2 py-1 rounded text-xs font-mono animate-in zoom-in duration-300">
                        {t}
                      </span>
                    ))}
                    {tokens.length === 0 && <span className="text-slate-600 italic text-sm">Waiting for input...</span>}
                  </div>
                </Card>

                {/* Stage 2 & 3: Embedding & Reasoning */}
                <Card className={`transition-all duration-500 ${(currentStage === 'embedding' || currentStage === 'reasoning') ? 'ring-2 ring-blue-500/50' : ''}`}>
                   <div className="bg-slate-950/50 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">Hidden Layers</span>
                    {currentStage === 'reasoning' && <span className="text-xs text-pink-400 animate-pulse">Neural Activation...</span>}
                  </div>
                  <div className="p-4 h-[160px] relative overflow-hidden flex items-center justify-center">
                    {/* Matrix Visualization */}
                    <div className="grid grid-cols-8 gap-1 w-full max-w-[300px]">
                      {embeddingMatrix.length > 0 ? embeddingMatrix.map((val, i) => (
                        <div 
                          key={i} 
                          className="h-3 w-3 rounded-sm transition-all duration-700"
                          style={{
                            backgroundColor: currentStage === 'reasoning' 
                              ? `rgba(236, 72, 153, ${Math.random()})` // Pink flickering during reasoning
                              : `rgba(147, 51, 234, ${val})` // Purple during embedding
                          }}
                        />
                      )) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-700 text-sm">
                          Waiting for embeddings...
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column: Output */}
              <div className="h-full">
                <Card className={`h-full min-h-[300px] flex flex-col transition-all duration-500 ${currentStage === 'generating' ? 'ring-2 ring-green-500/50' : ''}`}>
                  <div className="bg-slate-950/50 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">Output Layer</span>
                    {currentStage === 'generating' && <span className="text-xs text-green-400 animate-pulse">Streaming...</span>}
                    {currentStage === 'complete' && <span className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Complete</span>}
                  </div>
                  <div className="p-6 flex-grow font-mono text-sm leading-relaxed text-slate-300">
                    {displayedText}
                    {currentStage === 'generating' && <span className="inline-block w-2 h-4 bg-green-500 ml-1 animate-pulse"/>}
                    {!displayedText && <span className="text-slate-700 italic">Output will appear here...</span>}
                  </div>
                </Card>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}