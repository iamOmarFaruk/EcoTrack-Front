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
    joinChallenge(id)
    toast.success('Joined challenge!')
    navigate('/my-activities', { replace: true })
  }, [id, joinChallenge, navigate])

  return null
}


