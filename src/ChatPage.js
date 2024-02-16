import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChatPage.css';
import logOutIcon from './assets/log-out-icon.png';
import deleteIcon from './assets/delete.png';
import newChatIcon from './assets/newchat.png';
import tafbotImage from './assets/tafbot.png';
import userLogo from './assets/user-logo.png';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  const [currentChat, setCurrentChat] = useState('TAFBot'); 
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const restoreConversation = (conversation) => {
    setMessages(conversation.messages);
    setCurrentChat(conversation.chatName);
  };
  //let navigate = useNavigate();
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (trimmedInput) {
      // Adaugă mesajul utilizatorului la chat
      setMessages(prevMessages => [...prevMessages, { text: trimmedInput, sender: 'user' }]);
      setInput(''); // Golește input-ul

      try {
        // Realizează cererea POST către server
        const response = await axios.post('http://10.198.82.154:8000/stream_chat', {
          content: trimmedInput,
          queries: messages.filter(m => m.sender === 'user').map(m => m.text),
          answers: messages.filter(m => m.sender === 'bot').map(m => m.text),
        });

        // Prezumăm că răspunsul serverului este text simplu
        
        const botMessage = response.data;

        // Adaugă răspunsul botului la chat
        setMessages(prevMessages => [...prevMessages, { text: botMessage, sender: 'bot' }]);
      } catch (error) {
        console.error('There was an error sending the message to the chatbot:', error);
        // Afișează un mesaj de eroare în chat
        setMessages(prevMessages => [...prevMessages, { text: "Error: Could not connect to the chat service.", sender: 'bot' }]);
      }
    }
  };

  const handleBackToWelcome = () => {
    navigate('/');
  };

  
  

  const handleNewChat = () => {
    setMessages([]); // Resetează lista de mesaje când se creează un nou chat
  };
  const handleClearConversations = () => {
    setMessages([]);
    
  };

  return (
    
    <div className={"chat-page"}> 
      <div className="sidebar">
        <div className="sidebar-button" onClick={handleNewChat}>
          <img src={newChatIcon} alt="New Chat" className="new-chat-icon" />
          New chat
        </div>
        <div className="sidebar-button" onClick={handleClearConversations}>
  <img src={deleteIcon} alt="Delete" className="delete-icon" />
  Clear conversations
</div>
<div className="separator"></div> {/* Acesta este separatorul adăugat */}
        
        
        <div className="sidebar-lower">
          <div className="sidebar-button logout-container" onClick={handleBackToWelcome}>
            <img src={logOutIcon} alt="Log out" className="log-out-icon" />
            Log out
          </div>
        </div>
      </div>
      <div className="chat-container">
        <div className="chat-header">
          <img src={tafbotImage} alt="TAFBot" className="tafbot-icon" />
          {currentChat}
        </div>
        <div className="chat-messages">
  {messages.map((message, index) => (
    <div key={index} className={`message ${message.sender}`}>
      {message.sender === 'user' && <img src={userLogo} alt="User" className="user-logo" />}
      <div className="message-text">{message.text}</div>
    </div>
  ))}
</div>
        <div className="chat-footer">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask ${currentChat} a question...`}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
