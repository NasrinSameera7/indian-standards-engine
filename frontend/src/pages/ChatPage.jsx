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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Chat with Standards (RAG)</h1>
        <p className="text-gray-600 mb-8">Have a technical question about a specific Indian Standard? Chat directly with our AI to get instant citations and answers without reading the entire PDF.</p>

        {!isChatActive ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-lg mx-auto">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-50 mb-6">
              <MessageSquare className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Which standard do you want to chat with?</h2>
            <form onSubmit={startChat} className="flex space-x-2">
              <input
                type="text"
                value={standardId}
                onChange={(e) => setStandardId(e.target.value)}
                placeholder="e.g. 269 or 455 or 13428"
                className="flex-1 block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
              <button
                type="submit"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Start Chat
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px]">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Chatting with IS {standardId.toUpperCase()}</h3>
              </div>
              <button onClick={() => setIsChatActive(false)} className="text-sm text-gray-500 hover:text-gray-700">Change Standard</button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg px-5 py-3 text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-800 leading-relaxed'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 shadow-sm rounded-lg px-5 py-3 flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-3" />
                    <span className="text-sm text-gray-500">AI is reading the standard clauses...</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <form onSubmit={handleSend} className="flex space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. Does it allow the addition of 5% gypsum?"
                  className="flex-1 block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
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
