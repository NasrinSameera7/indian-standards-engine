import React, { useState } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import axios from 'axios';

const StandardChatModal = ({ isOpen, onClose, standard }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hello! I am an AI trained on IS ${standard?.is_number}. Ask me any technical questions about this standard.` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !standard) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await axios.post(`https://indian-standards-api.onrender.com/api/v1/standards/${standard.id}/chat`, {
        message: userMsg
      });
      setMessages(prev => [...prev, { role: 'ai', content: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I am having trouble connecting to the knowledge base right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl text-left overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-white/30 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-white/40">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white/60 shadow-inner sm:mx-0 sm:h-10 sm:w-10">
                  <MessageSquare className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900" id="modal-title">
                    Chat with IS {standard.is_number}
                  </h3>
                  <p className="text-xs text-gray-600 truncate w-64 font-medium">{standard.title}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800 bg-white/30 rounded-full p-1 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="p-4 h-80 overflow-y-auto flex flex-col space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white/70 border border-white/80 text-gray-800 rounded-bl-none backdrop-blur-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/70 border border-white/80 rounded-2xl rounded-bl-none px-4 py-2 flex items-center backdrop-blur-sm shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600 mr-2" />
                  <span className="text-sm text-gray-600 font-medium">AI is reading the standard...</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white/30 px-4 py-3 sm:px-6 border-t border-white/40">
            <form onSubmit={handleSend} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about materials, tests, limits..."
                className="flex-1 min-w-0 block w-full px-4 py-2 rounded-xl border border-white/50 bg-white/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-inner placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-lg text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:shadow-none transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandardChatModal;
