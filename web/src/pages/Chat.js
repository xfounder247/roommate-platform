import { useEffect, useState } from 'react'
import axios from 'axios'
import supabase from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

const Chat = () => {
  const { token, user } = useAuth()
  const [myMatches, setMyMatches] = useState([])
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/matches/my-matches`, { headers })
      .then(res => setMyMatches(res.data))
  }, [])

  useEffect(() => {
    if (!selectedMatch) return
    axios.get(`${process.env.REACT_APP_API_URL}/api/messages/${selectedMatch.id}`, { headers })
      .then(res => setMessages(res.data))

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `match_id=eq.${selectedMatch.id}`
      }, payload => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [selectedMatch])

  const sendMessage = async () => {
    if (!newMessage.trim()) return
    await axios.post(`${process.env.REACT_APP_API_URL}/api/messages`,
      { match_id: selectedMatch.id, content: newMessage }, { headers })
    setNewMessage('')
  }

  return (
    <div className="h-screen flex bg-gray-50">

      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Messages 💬</h2>
          <p className="text-sm text-gray-500 mt-1">Your matched conversations</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {myMatches.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-sm text-gray-500">No matches yet. Go like someone!</p>
            </div>
          ) : (
            myMatches.map(match => (
              <div key={match.id}
                onClick={() => setSelectedMatch(match)}
                className={`flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-gray-50 transition border-b border-gray-50 ${selectedMatch?.id === match.id ? 'bg-rose-50' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold flex-shrink-0">
                  #{match.id.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Match #{match.id.slice(0, 6)}</p>
                  <p className="text-xs text-gray-500">Click to open chat</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedMatch ? (
          <>
            <div className="bg-white border-b border-gray-100 px-6 py-4">
              <h3 className="font-bold text-gray-900">Match #{selectedMatch.id.slice(0, 6)}</h3>
              <p className="text-sm text-gray-500">Matched roommate</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {messages.map(msg => (
                <div key={msg.id}
                  className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                    msg.sender_id === user?.id
                      ? 'bg-rose-500 text-white rounded-br-sm'
                      : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">👋</div>
                  <p className="text-gray-500 text-sm">Say hello to your match!</p>
                </div>
              )}
            </div>

            <div className="bg-white border-t border-gray-100 p-4 flex gap-3">
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-400 text-gray-700 text-sm transition"
              />
              <button onClick={sendMessage}
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-medium transition text-sm">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a match from the left to start chatting</p>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default Chat