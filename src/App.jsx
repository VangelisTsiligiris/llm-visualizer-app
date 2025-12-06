import React, { useState } from 'react';
import { Send, Zap, Brain, MessageSquare, CheckCircle } from 'lucide-react';

export default function LLMVisualizer() {
  const [prompt, setPrompt] = useState('');
  const [selectedAPI, setSelectedAPI] = useState('claude');
  const [apiKeys, setApiKeys] = useState({
    claude: '',
    gemini: '',
    openai: ''
  });
  const [response, setResponse] = useState('');
  const [stage, setStage] = useState('idle');
  const [tokens, setTokens] = useState([]);
  const [thinking, setThinking] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const stages = [
    { id: 'tokenization', name: 'Tokenization', icon: Zap, color: 'bg-blue-500' },
    { id: 'embedding', name: 'Embedding', icon: Brain, color: 'bg-purple-500' },
    { id: 'processing', name: 'Processing', icon: Brain, color: 'bg-pink-500' },
    { id: 'generation', name: 'Generation', icon: MessageSquare, color: 'bg-green-500' },
    { id: 'complete', name: 'Complete', icon: CheckCircle, color: 'bg-emerald-500' }
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(s => s.id === stage);
  };

  const simulateTokenization = (text) => {
    const words = text.split(/(\s+)/);
    const tokenArray = [];
    words.forEach((word, idx) => {
      if (word.trim()) {
        tokenArray.push({ id: idx, text: word, type: 'word' });
      }
    });
    return tokenArray;
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    console.log("Button clicked! Form submitted!");
    console.log("Selected API:", selectedAPI);
    console.log("Prompt:", prompt);
    
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }
    
    const currentApiKey = apiKeys[selectedAPI];
    if (!currentApiKey.trim()) {
      alert(`Please enter your ${selectedAPI.toUpperCase()} API key`);
      return;
    }
    
    if (isLoading) {
      console.log("Already loading, skipping...");
      return;
    }

    console.log("Starting processing with prompt:", prompt);
    setIsLoading(true);
    setResponse('');
    setThinking([]);
    setStage('idle');
    
    try {
      // Stage 1: Tokenization
      console.log("Stage 1: Tokenization");
      setStage('tokenization');
      const tokenArray = simulateTokenization(prompt);
      console.log("Tokens:", tokenArray);
      setTokens(tokenArray);
      await sleep(1200);

      // Stage 2: Embedding
      console.log("Stage 2: Embedding");
      setStage('embedding');
      await sleep(1000);

      // Stage 3: Processing
      console.log("Stage 3: Processing");
      setStage('processing');
      setThinking(['Analyzing context...', 'Understanding intent...', 'Formulating response...']);
      await sleep(800);
      
      // Call the selected API
      console.log(`Calling ${selectedAPI.toUpperCase()} API...`);
      let fullResponse = '';
      
      if (selectedAPI === 'claude') {
        fullResponse = await callClaudeAPI(prompt, currentApiKey);
      } else if (selectedAPI === 'gemini') {
        fullResponse = await callGeminiAPI(prompt, currentApiKey);
      } else if (selectedAPI === 'openai') {
        fullResponse = await callOpenAIAPI(prompt, currentApiKey);
      }
      
      console.log("Full response length:", fullResponse.length);
      
      // Stage 4: Generation
      console.log("Stage 4: Generation");
      setStage('generation');
      
      // Simulate streaming effect
      let currentText = '';
      for (let i = 0; i < fullResponse.length; i++) {
        currentText += fullResponse[i];
        setResponse(currentText);
        if (i % 5 === 0) {
          await sleep(20);
        }
      }
      
      // Stage 5: Complete
      console.log("Stage 5: Complete");
      await sleep(300);
      setStage('complete');
      
    } catch (error) {
      console.error("Error occurred:", error);
      setResponse(`Error: ${error.message}\n\nPlease check the console for more details.`);
      setStage('complete');
    }
    
    setIsLoading(false);
    console.log("Processing complete");
  };

  const callClaudeAPI = async (promptText, apiKey) => {
    try {
      const apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            { role: "user", content: promptText }
          ],
        })
      });

      console.log("Claude API Response status:", apiResponse.status);

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error("Claude API error response:", errorText);
        throw new Error(`Claude API error: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      console.log("Claude API Response data:", data);
      
      return data.content
        .map(item => (item.type === "text" ? item.text : ""))
        .filter(Boolean)
        .join("\n");
    } catch (fetchError) {
      console.error("Claude fetch error:", fetchError);
      throw new Error(`Claude API: ${fetchError.message}`);
    }
  };

  const callGeminiAPI = async (promptText, apiKey) => {
    try {
      // Using gemini-1.5-flash which is the current stable model
      const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      
      const apiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptText
                }
              ]
            }
          ]
        })
      });

      console.log("Gemini API Response status:", apiResponse.status);

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error("Gemini API error response:", errorText);
        throw new Error(`Gemini API error: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      console.log("Gemini API Response data:", data);
      
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
    } catch (fetchError) {
      console.error("Gemini fetch error:", fetchError);
      throw new Error(`Gemini API (May be blocked by CORS): ${fetchError.message}`);
    }
  };

  const callOpenAIAPI = async (promptText, apiKey) => {
    try {
      const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "user", content: promptText }
          ],
          max_tokens: 1000
        })
      });

      console.log("OpenAI API Response status:", apiResponse.status);

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error("OpenAI API error response:", errorText);
        throw new Error(`OpenAI API error: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      console.log("OpenAI API Response data:", data);
      
      return data.choices?.[0]?.message?.content || "No response generated";
    } catch (fetchError) {
      console.error("OpenAI fetch error:", fetchError);
      throw new Error(`OpenAI API (May be blocked by CORS): ${fetchError.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            LLM Processing Visualizer
          </h1>
          <p className="text-purple-200">
            Watch how LLMs process your prompts in real-time with Claude, Gemini, or ChatGPT
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-blue-400 mt-1">ℹ️</div>
            <div className="text-sm text-blue-100">
              <strong>Note:</strong> Claude API works in this environment. Gemini and OpenAI APIs may be blocked by CORS restrictions. 
              If you get a "Failed to fetch" error, try using Claude or download this artifact to run locally.
            </div>
          </div>
        </div>

        {/* Stage Progress Bar */}
        <div className="bg-slate-800/80 backdrop-blur rounded-lg p-4 md:p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between">
            {stages.map((s, idx) => {
              const StageIcon = s.icon;
              const isPast = getCurrentStageIndex() > idx;
              const isCurrent = getCurrentStageIndex() === idx;
              
              return (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isPast || isCurrent ? s.color : 'bg-slate-700'
                      } ${isCurrent ? 'scale-110 ring-4 ring-white/30 shadow-lg' : ''}`}
                    >
                      <StageIcon className={`w-5 h-5 md:w-6 md:h-6 ${
                        isPast || isCurrent ? 'text-white' : 'text-slate-500'
                      }`} />
                    </div>
                    <p className={`text-xs mt-2 font-medium text-center ${
                      isPast || isCurrent ? 'text-white' : 'text-slate-500'
                    }`}>
                      {s.name}
                    </p>
                  </div>
                  {idx < stages.length - 1 && (
                    <div className={`h-1 flex-1 mx-1 md:mx-2 rounded transition-all duration-500 ${
                      isPast ? s.color : 'bg-slate-700'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-slate-800/80 backdrop-blur rounded-lg p-4 md:p-6 mb-6 shadow-xl">
          <form onSubmit={handleSubmit}>
            {/* API Selection */}
            <div className="mb-4">
              <label className="block text-purple-200 text-sm font-semibold mb-2">
                Select LLM Provider
              </label>
              <select
                value={selectedAPI}
                onChange={(e) => setSelectedAPI(e.target.value)}
                className="w-full bg-slate-900/50 text-white border border-purple-500/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                disabled={isLoading}
              >
                <option value="claude">Claude (Anthropic) - Works ✓</option>
                <option value="gemini">Gemini (Google) - May be blocked</option>
                <option value="openai">ChatGPT (OpenAI) - May be blocked</option>
              </select>
            </div>

            {/* API Key Input */}
            <div className="mb-4">
              <label className="block text-purple-200 text-sm font-semibold mb-2">
                {selectedAPI === 'claude' && 'Claude API Key'}
                {selectedAPI === 'gemini' && 'Gemini API Key'}
                {selectedAPI === 'openai' && 'OpenAI API Key'}
              </label>
              <input
                type="password"
                value={apiKeys[selectedAPI]}
                onChange={(e) => setApiKeys({...apiKeys, [selectedAPI]: e.target.value})}
                className="w-full bg-slate-900/50 text-white border border-purple-500/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder={`Enter your ${selectedAPI === 'claude' ? 'Claude' : selectedAPI === 'gemini' ? 'Gemini' : 'OpenAI'} API key...`}
                disabled={isLoading}
              />
              <p className="text-xs text-purple-300 mt-1">
                {selectedAPI === 'claude' && (
                  <>Get your API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-100">Anthropic Console</a></>
                )}
                {selectedAPI === 'gemini' && (
                  <>Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-100">Google AI Studio</a></>
                )}
                {selectedAPI === 'openai' && (
                  <>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-100">OpenAI Platform</a></>
                )}
              </p>
            </div>
            
            {/* Prompt Input */}
            <div className="mb-4">
              <label className="block text-purple-200 text-sm font-semibold mb-2">
                Enter Your Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-slate-900/50 text-white border border-purple-500/30 rounded-lg p-4 h-24 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Ask anything... (e.g., 'Explain quantum computing in simple terms')"
                disabled={isLoading}
              />
            </div>
            
            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !prompt.trim() || !apiKeys[selectedAPI].trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5" />
              {isLoading ? 'Processing...' : `Submit to ${selectedAPI === 'claude' ? 'Claude' : selectedAPI === 'gemini' ? 'Gemini' : 'ChatGPT'}`}
            </button>
          </form>
        </div>

        {/* Visualization Sections */}
        {stage !== 'idle' && (
          <>
            {/* Tokenization View */}
            {(stage === 'tokenization' || getCurrentStageIndex() > 0) && tokens.length > 0 && (
              <div className="bg-slate-800/80 backdrop-blur rounded-lg p-4 md:p-6 mb-6 shadow-xl animate-slideIn">
                <h3 className="text-lg md:text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  Tokenization
                </h3>
                <p className="text-purple-200 text-sm mb-4">
                  Breaking down your prompt into tokens
                </p>
                <div className="flex flex-wrap gap-2">
                  {tokens.map((token, idx) => (
                    <div
                      key={token.id}
                      className="bg-blue-500/20 border border-blue-500/50 text-blue-200 px-3 py-1 rounded-md text-sm font-mono animate-fadeIn"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      {token.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Embedding View */}
            {(stage === 'embedding' || getCurrentStageIndex() > 1) && (
              <div className="bg-slate-800/80 backdrop-blur rounded-lg p-4 md:p-6 mb-6 shadow-xl animate-slideIn">
                <h3 className="text-lg md:text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Embedding
                </h3>
                <p className="text-purple-200 text-sm mb-4">
                  Converting tokens to high-dimensional vectors
                </p>
                <div className="grid grid-cols-8 md:grid-cols-12 gap-2">
                  {Array.from({ length: 48 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-t from-purple-500 to-purple-300 rounded animate-pulse"
                      style={{
                        animationDelay: `${idx * 30}ms`,
                        height: `${Math.random() * 40 + 30}px`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Processing View */}
            {(stage === 'processing' || getCurrentStageIndex() > 2) && thinking.length > 0 && (
              <div className="bg-slate-800/80 backdrop-blur rounded-lg p-4 md:p-6 mb-6 shadow-xl animate-slideIn">
                <h3 className="text-lg md:text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-pink-400" />
                  Neural Processing
                </h3>
                <div className="space-y-3">
                  {thinking.map((thought, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-pink-200 animate-fadeIn"
                      style={{ animationDelay: `${idx * 200}ms` }}
                    >
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                      <span>{thought}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Output View */}
            {response && (
              <div className="bg-slate-800/80 backdrop-blur rounded-lg p-4 md:p-6 shadow-xl animate-slideIn">
                <h3 className="text-lg md:text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                  {selectedAPI === 'claude' && 'Claude Response'}
                  {selectedAPI === 'gemini' && 'Gemini Response'}
                  {selectedAPI === 'openai' && 'ChatGPT Response'}
                </h3>
                <div className="bg-slate-900/50 rounded-lg p-4 text-green-100 whitespace-pre-wrap leading-relaxed">
                  {response}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slideIn {
          animation: slideIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}