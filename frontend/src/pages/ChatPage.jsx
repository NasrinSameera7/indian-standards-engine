import React, { useState } from 'react';
import { MessageSquare, Send, Loader2, Search } from 'lucide-react';
import axios from 'axios';

const ChatPage = () => {
  const [standardId, setStandardId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);

  const startChat = (e) => {
    e.preventDefault();
    if (!standardId.trim()) return;
    setIsChatActive(true);
    setMessages([
      { role: 'ai', content: `Hello! I am the AI trained on IS ${standardId.toUpperCase()}. What technical details would you like to know about this standard?` }
    ]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // We'll use a generic mock ID (1) since we don't know the exact ID in this UI, 
      // but the backend handles keyword RAG regardless.
      const res = await axios.post(`https://indian-standards-api.onrender.com/api/v1/standards/1/chat`, {
        message: userMsg
      });
      // Replace the generic standard number with the one they typed
      const personalizedReply = res.data.reply.replace(/IS \d+/g, `IS ${standardId.toUpperCase()}`);
      setMessages(prev => [...prev, { role: 'ai', content: personalizedReply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I am having trouble connecting to the knowledge base right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Chat with Standards (RAG)</h1>
        <p className="text-gray-700 mb-8 font-medium">Have a technical question about a specific Indian Standard? Chat directly with our AI to get instant citations and answers without reading the entire PDF.</p>

        {!isChatActive ? (
          <div className="bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl p-8 text-center max-w-lg mx-auto">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white/60 shadow-inner mb-6">
              <MessageSquare className="h-10 w-10 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Which standard do you want to chat with?</h2>
            <form onSubmit={startChat} className="flex space-x-2">
              <input
                type="text"
                value={standardId}
                onChange={(e) => setStandardId(e.target.value)}
                placeholder="e.g. 269 or 455 or 13428"
                className="flex-1 block w-full px-4 py-3 rounded-xl border border-white/50 bg-white/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm backdrop-blur-sm shadow-inner placeholder-gray-500"
                required
              />
              <button
                type="submit"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-lg text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Start Chat
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl overflow-hidden flex flex-col h-[600px]">
            <div className="bg-white/30 px-6 py-4 border-b border-white/40 flex justify-between items-center backdrop-blur-md">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Chatting with IS {standardId.toUpperCase()}</h3>
              </div>
              <button onClick={() => setIsChatActive(false)} className="text-sm font-medium text-gray-600 hover:text-indigo-700 bg-white/30 px-3 py-1.5 rounded-lg transition-colors">Change Standard</button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-5 py-3 text-sm shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white/70 border border-white/80 text-gray-800 leading-relaxed rounded-bl-none backdrop-blur-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/70 border border-white/80 backdrop-blur-sm shadow-sm rounded-2xl rounded-bl-none px-5 py-3 flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-600 mr-3" />
                    <span className="text-sm text-gray-600 font-medium">AI is reading the standard clauses...</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white/30 backdrop-blur-md px-6 py-4 border-t border-white/40">
              <form onSubmit={handleSend} className="flex space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. Does it allow the addition of 5% gypsum?"
                  className="flex-1 block w-full px-4 py-3 rounded-xl border border-white/50 bg-white/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-inner placeholder-gray-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-lg text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:shadow-none transition-all"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
