import React from 'react'
import './Message.css'

const Message = ({ user, chat, index, message }) => {

    const determineMargin = () => {

        if (index + 1 === chat.messages.length) return

        return message.fromUserId === chat.messages[index + 1].fromUserId ? 'mb-2' : 'mb-4'
    }

    return (
        <div className={`message ${determineMargin()} ${message.fromUserId === user.id ? 'creator' : ''}`}>
            <div className={message.fromUserId === user.id ? 'owner' : 'other-person'}>
                {
                    message.fromUserId !== user.id
                        ? <h6 className='m-0' style={{fontWeight:'bold', fontSize:'12px'}}>{message.user.fullName}</h6>
                        : null
                }                {
                    message.type === 'text'
                        ? <p className='m-0'>{message.message}</p>
                        : <img src={message.message} alt='User upload' />
                }
            </div>
        </div>
    )
}

export default Message