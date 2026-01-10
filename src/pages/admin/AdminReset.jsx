import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { adminApi } from '../../services/adminApi'

const AdminReset = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const handleReset = async () => {
            try {
                setLoading(true)
                await adminApi.executeReset()

                toast.success('Demo data has been reset successfully!', {
                    duration: 4000,
                    position: 'top-center'
                })

                navigate('/control-panel')
            } catch (err) {
                setError(err.message || 'Failed to reset demo data')
                toast.error('Failed to reset demo data')
            } finally {
                setLoading(false)
            }
        }

        handleReset()
    }, [navigate])

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-heading mb-2">Reset Failed</h2>
                <p className="text-muted text-center max-w-md mb-6">{error}</p>
                <button
                    onClick={() => navigate('/control-panel')}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Return into Dashboard
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
            <div className="w-16 h-16 mb-6 relative">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-heading mb-2">Resetting Demo Data</h2>
            <p className="text-muted text-center max-w-md">
                Please wait while we restore the database to its initial state...
            </p>
        </div>
    )
}

export default AdminReset
