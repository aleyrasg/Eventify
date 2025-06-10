import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { Navigate } from 'react-router-dom'

const RequireAuth = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (loading) return null
  if (!session) return <Navigate to="/login" replace />

  return children
}

export default RequireAuth
