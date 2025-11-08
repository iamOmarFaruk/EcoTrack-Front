import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

export default function JoinChallenge() {
  const { id } = useParams()
  const { joinChallenge } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    joinChallenge(id)
    toast.success('Joined challenge!')
    navigate('/my-activities', { replace: true })
  }, [id, joinChallenge, navigate])

  return null
}


