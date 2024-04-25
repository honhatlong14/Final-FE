import React from "react";
import { userStatus } from "../../utility/chatHelper";
import "./Friend.css";
import { useSelector } from "react-redux";
const Friend = ({ chat, click, ...props }) => {
  const currentChat = useSelector((state) => state.chat.currentChat);

  const isChatOpened = () => {
    return currentChat.id === chat.id ? "opened" : "";
  };

  const lastMessage = () => {
    if (chat.messages === null || chat.messages.length === 0) return "";

    const message = chat.messages[chat.messages.length - 1];
    return message.type === "image" ? "image uploaded" : message.message;
  };

  return (
    <div onClick={click} className={`friend-list ${isChatOpened()}`} {...props}>
      <div>
        <img
          style={{ borderRadius: '50%' }}
          width="40"
          height="40"
          src={chat.users[0].avatar ? chat.users[0].avatar : "https://i.pinimg.com/originals/ff/a0/9a/ffa09aec412db3f54deadf1b3781de2a.png"}
          alt="User avatar"
        />
        <div className="friend-info">
          <h4 className="m-0" style={{fontSize:'15px', fontWeight: 'bold'}}>
            {chat.users[0].fullName}
          </h4>
          <h5 className="m-0" style={{fontSize:'13px'}}>{lastMessage()}</h5>
        </div>
      </div>
      <div className="friend-status">
        <span className={`online-status ${userStatus(chat.users[0])}`}></span>
      </div>
    </div>
  );
};

export default Friend;
