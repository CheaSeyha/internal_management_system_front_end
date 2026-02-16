import React from 'react'
import ChatWindow from './Chat/ChatWindow'

function Chat({ onPickText }) {
    return <ChatWindow onPickText={onPickText} />
}

export default Chat