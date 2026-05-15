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

  const sampleMatches = [
    { id: '1', name: 'Vikram Sharma', initials: 'VS', color: 'bg-red-50 text-red-500', lastMsg: 'Hey! Are you still looking?', time: '2m ago', unread: 2 },
    { id: '2', name: 'Priya Rao', initials: 'PR', color: 'bg-blue-50 text-blue-500', lastMsg: 'The room is available from June', time: '1h ago', unread: 0 },
    { id: '3', name: 'Arjun Mehta', initials: 'AM', color: 'bg-green-50 text-green-500', lastMsg: 'Sounds great! Let\'s meet', time: '3h ago', unread: 1 },
  ]

  const sampleMessages = [
    { id: 1, sender_id: 'other', content: 'Hey! I saw your profile and I think we could be great roommates!', created_at: '10:30 AM' },
    { id: 2, sender_id: 'me', content: 'Hi! Yes I checked your profile too. Looks like we have similar schedules!', created_at: '10:32 AM' },
    { id: 3, sender_id: 'other', content: 'Exactly! I am also a non-smoker and early bird. Are you still looking for a place?', created_at: '10:33 AM' },
    { id: 4, sender_id: 'me', content: 'Yes I am! What is your budget range?', created_at: '10:35 AM' },
    { id: 5, sender_id: 'other', content: 'Around ₹10,000 to ₹15,000 per month. I found a great 2BHK in Koramangala!', created_at: '10:36 AM' },
  ]

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/matches/my-matches`, { headers })
      .then(res => setMyMatches(res.data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedMatch) return
    axios.get(`${process.env.REACT_APP_API_URL}/api/messages/${selectedMatch.id}`, { headers })
      .then(res => setMessages(res.data))
      .catch(() => {})

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
    if (!selectedMatch?.id || selectedMatch.id === '1' || selectedMatch.id === '2' || selectedMatch.id === '3') {
      setMessages(prev => [...prev, {
        id: Date.now(), sender_id: 'me',
        content: newMessage, created_at: 'Just now'
      }])
      setNewMessage('')
      return
    }
    await axios.post(`${process.env.REACT_APP_API_URL}/api/messages`,
      { match_id: selectedMatch.id, content: newMessage }, { headers })
    setNewMessage('')
  }

  const displayMatches = myMatches.length > 0 ? myMatches : sampleMatches
  const displayMessages = messages.length > 0 ? messages : (selectedMatch ? sampleMessages : [])

  return (
    <div className="flex bg-gray-50" style={{ height: 'calc(100vh - 60px)' }}>

      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900">Messages 💬</h2>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Your matched conversations</p>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2 gap-2 border-2 border-gray-100">
            <span className="text-gray-400 text-sm">🔍</span>
            <input placeholder="Search conversations..."
              className="border-none outline-none text-xs text-gray-700 bg-transparent flex-1 font-medium" />
          </div>
        </div>

        {/* Match List */}
        <div className="flex-1 overflow-y-auto">
          {displayMatches.map(match => (
            <div key={match.id}
              onClick={() => setSelectedMatch(match)}
              className={`flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition border-b border-gray-50 ${selectedMatch?.id === match.id ? 'bg-red-50 border-l-4 border-l-red-500' : ''}`}>
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black flex-shrink-0 ${match.color || 'bg-red-50 text-red-500'}`}>
                {match.initials || match.id?.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-black text-gray-900 truncate">
                    {match.name || `Match #${match.id?.slice(0, 6)}`}
                  </div>
                  <div className="text-xs text-gray-400 font-semibold flex-shrink-0 ml-2">
                    {match.time || ''}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <div className="text-xs text-gray-400 truncate font-medium">
                    {match.lastMsg || 'Click to start chatting'}
                  </div>
                  {match.unread > 0 && (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                      <span className="text-white text-xs font-black">{match.unread}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedMatch ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${selectedMatch.color || 'bg-red-50 text-red-500'}`}>
                {selectedMatch.initials || selectedMatch.id?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-black text-gray-900">
                  {selectedMatch.name || `Match #${selectedMatch.id?.slice(0, 6)}`}
                </div>
                <div className="text-xs text-green-500 font-bold">● Online</div>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-sm border-2 border-gray-100 hover:bg-gray-100 transition">
                  📞
                </button>
                <button className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-sm border-2 border-gray-100 hover:bg-gray-100 transition">
                  🏠
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {displayMessages.map(msg => (
                <div key={msg.id}
                  className={`flex ${msg.sender_id === user?.id || msg.sender_id === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm font-medium ${
                    msg.sender_id === user?.id || msg.sender_id === 'me'
                      ? 'bg-red-500 text-white rounded-br-sm'
                      : 'bg-white border-2 border-gray-100 text-gray-700 rounded-bl-sm'
                  }`}>
                    <div>{msg.content}</div>
                    <div className={`text-xs mt-1 ${msg.sender_id === user?.id || msg.sender_id === 'me' ? 'text-red-200' : 'text-gray-300'}`}>
                      {msg.created_at}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-100 p-4 flex gap-3 items-center">
              <button className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-lg border-2 border-gray-100 flex-shrink-0">
                📎
              </button>
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-sm text-gray-700 font-medium transition"
              />
              <button onClick={sendMessage}
                className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-xl flex items-center justify-center text-white transition flex-shrink-0">
                ➤
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-sm text-gray-400 font-medium">Choose a match from the left to start chatting</p>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default Chat