import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import toast from 'react-hot-toast'

export default function JoinChallenge() {
  useDocumentTitle('Joining Challenge')
  const { id } = useParams()
  const { joinChallenge } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleJoinChallenge = async () => {
      try {
        await joinChallenge(id)
        toast.success('Successfully joined the challenge!')
        navigate('/my-activities', { replace: true })
      } catch (error) {
        console.error('Error joining challenge:', error)
        toast.error(error.message || 'Failed to join challenge. Please try again.')
        navigate('/challenges', { replace: true })
      }
    }

    handleJoinChallenge()
  }, [id, joinChallenge, navigate])

  return null
}


