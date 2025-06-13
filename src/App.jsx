import React, { useEffect, useRef, useState } from 'react';
import ChatbotIcon from './components/ChatbotIcon';
import ChatForm from './components/ChatForm';
import ChatMessage from './components/ChatMessage';
import "./assests/css/index.css"
// import { companyWipro } from './companyWipro';

export default function App() {
// company information get then its code execute line 8-13,line 14 comment and 5 line import uncomment
//   const [chatHistory, setChatHistory] = useState([{
//     hideInChat:false,
//     role:"model",
//     text:companyWipro
// }]);
const [chatHistory,setChatHistory]=useState([])
  const[showChatbot,setShowChatbot]=useState(false)
const chatBodyRef=useRef();
  async function generateResponse(history) {  
    // console.log(history)
    // Chat history change API Format
    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: formattedHistory }),
    };

    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCZravL9YIExvbobtEMRDAQLpzr7BhwIXM',
        requestOptions
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.error?.message || 'Something went wrong');

      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

      // chatbot thinking remove add real answer
      setChatHistory((prev) => {
        const updated = [...prev];
        updated.pop(); // remove Thinking...
        return [...updated, { role: 'model', text: botResponse }];
      });
    } catch (error) {
      console.error(error.message);
      setChatHistory((prev) => {
        const updated = [...prev];
        updated.pop(); // remove Thinking...
        return [
          ...updated,
          { role: 'model', text: ` ${error.message}`, isError: true },
        ];
      });
    }
  }
useEffect(()=>{
chatBodyRef.current.scrollTo({top:chatBodyRef.current.scrollHeight,behavior:"smooth"})
},[chatHistory])
  return (

<div className="container">
{/* Floating Message Icon */}
<button className="chatbot-toggler" onClick={() => setShowChatbot(prev => !prev)}>
  <span className="material-symbols-rounded">mode_comment</span>
</button>
      <div className={`chatbot-popup ${showChatbot ? '' : 'show'}`}>         {/* Chat Header */}
        <div className="chat-header">
           <div className="header-info">
             <ChatbotIcon />
             <h2 className="logo-text">Chatbot</h2>
           </div>
           <button onClick={() => setShowChatbot(prev => !prev)}  className="material-symbols-rounded">keyboard_arrow_down</button>
         </div>

         {/* Chat Body */}
         <div ref={chatBodyRef}className="chat-body">
           <div className="message bot-message">
             <ChatbotIcon />
             <p className="message-text">My hero 👋 How can I help you today?</p>
           </div>
           {chatHistory.map((chat, index) => (
             <ChatMessage key={index} chat={chat} />
           ))}
         </div>

        {/* Chat Footer */}
         <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
             generateResponse={generateResponse}
           />
         </div>
       </div>
     </div>
   );
 }


