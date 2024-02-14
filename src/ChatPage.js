import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatPage.css';
import logOutIcon from './assets/log-out-icon.png';
import deleteIcon from './assets/delete.png';
import newChatIcon from './assets/newchat.png';
import tafbotImage from './assets/tafbot.png'; // Asigură-te că ai definit această imagine
import userLogo from './assets/user-logo.png';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  const [currentChat, setCurrentChat] = useState('TAFBot'); // Noul state pentru chat-ul curent
  
  //const [savedConversations, setSavedConversations] = useState([]);
  const restoreConversation = (conversation) => {
    setMessages(conversation.messages);
    setCurrentChat(conversation.chatName);
  };
  let navigate = useNavigate();

  const handleSendMessage = () => {
    if (input.trim()) {
        const newConversation = { messages: [...messages], chatName: currentChat };
        /*
        setSavedConversations(prevConversations => {
          const updatedConversations = [...prevConversations, newConversation];
          return updatedConversations.slice(-2); // menține doar ultimele două conversații
        });
        */
        setMessages([...messages, { text: input, sender: 'user' }]);
        setInput('');
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
    /*setSavedConversations(prevConversations => {
      return prevConversations.filter(conversation => conversation.chatName !== currentChat);
    });
    */
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
