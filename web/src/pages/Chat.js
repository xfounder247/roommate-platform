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
    { id: 3, sender_id: 'other', content: 'Exactly! Are you still looking for a place?', created_at: '10:33 AM' },
    { id: 4, sender_id: 'me', content: 'Yes I am! What is your budget range?', created_at: '10:35 AM' },
    { id: 5, sender_id: 'other', content: 'Around ₹10,000 to ₹15,000 per month. I found a great 2BHK!', created_at: '10:36 AM' },
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
    if (!selectedMatch?.id || ['1', '2', '3'].includes(selectedMatch.id)) {
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

  // Show chat window if match selected
  if (selectedMatch) {
    return (
      <div className="flex flex-col bg-white pb-20" style={{ height: '100vh' }}>

        {/* Chat Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setSelectedMatch(null)}
            className="text-gray-400 font-black text-lg">
            ←
          </button>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${selectedMatch.color || 'bg-red-50 text-red-500'}`}>
            {selectedMatch.initials || selectedMatch.id?.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-sm font-black text-gray-900">
              {selectedMatch.name || `Match #${selectedMatch.id?.slice(0, 6)}`}
            </div>
            <div className="text-xs text-green-500 font-bold">● Online</div>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-sm">📞</button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {displayMessages.map(msg => (
            <div key={msg.id}
              className={`flex ${msg.sender_id === user?.id || msg.sender_id === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm font-medium ${
                msg.sender_id === user?.id || msg.sender_id === 'me'
                  ? 'bg-red-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-700 rounded-bl-sm'
              }`}>
                <div>{msg.content}</div>
                <div className={`text-xs mt-0.5 ${msg.sender_id === user?.id || msg.sender_id === 'me' ? 'text-red-200' : 'text-gray-400'}`}>
                  {msg.created_at}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-100 px-4 py-3 flex gap-2 items-center flex-shrink-0">
          <input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-red-400 text-sm text-gray-700 transition"
          />
          <button onClick={sendMessage}
            className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-xl flex items-center justify-center text-white transition flex-shrink-0">
            ➤
          </button>
        </div>

      </div>
    )
  }

  // Show matches list
  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl font-black text-gray-900">Messages 💬</h1>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Your matched conversations</p>
      </div>

      {/* Search */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2.5 gap-2 border-2 border-gray-100">
          <span className="text-gray-400">🔍</span>
          <input placeholder="Search conversations..."
            className="border-none outline-none text-sm text-gray-700 bg-transparent flex-1" />
        </div>
      </div>

      {/* Match List */}
      <div className="bg-white">
        {displayMatches.map(match => (
          <div key={match.id}
            onClick={() => setSelectedMatch(match)}
            className="flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-gray-50 transition border-b border-gray-50">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black flex-shrink-0 ${match.color || 'bg-red-50 text-red-500'}`}>
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
                  {match.lastMsg || 'Tap to start chatting'}
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

      {myMatches.length === 0 && (
        <p className="text-center text-xs text-gray-400 font-semibold mt-6">
          No matches yet — go like someone! ❤️
        </p>
      )}

    </div>
  )
}

export default Chat
