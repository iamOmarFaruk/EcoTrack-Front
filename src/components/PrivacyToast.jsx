import { useEffect, useRef, useState } from 'react'
import Button from './ui/Button.jsx'

const COOKIE_NAME = 'eco_privacy_accepted'

function getCookieValue(name) {
  const cookies = document.cookie ? document.cookie.split('; ') : []
  for (const cookie of cookies) {
    const [cookieName, ...rest] = cookie.split('=')
    if (decodeURIComponent(cookieName) === name) {
      return decodeURIComponent(rest.join('='))
    }
  }
  return null
}

function setSessionCookie(name, value) {
  // Session cookie: no Expires/Max-Age so it clears on browser close
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; SameSite=Lax`
}

export default function PrivacyToast() {
  const [visible, setVisible] = useState(false)
  const timerIdRef = useRef(null)
  const interactedRef = useRef(false)

  useEffect(() => {
    const accepted = getCookieValue(COOKIE_NAME)
    if (accepted) return

    const onFirstInteraction = () => {
      if (interactedRef.current) return
      interactedRef.current = true
      detach()
      timerIdRef.current = window.setTimeout(() => {
        setVisible(true)
      }, 3000) // show 3s after first interaction
    }

    const passive = { passive: true }
    const attach = () => {
      window.addEventListener('click', onFirstInteraction, passive)
      window.addEventListener('scroll', onFirstInteraction, passive)
      window.addEventListener('mousemove', onFirstInteraction, passive)
      window.addEventListener('touchstart', onFirstInteraction, passive)
      window.addEventListener('keydown', onFirstInteraction)
    }
    const detach = () => {
      window.removeEventListener('click', onFirstInteraction, passive)
      window.removeEventListener('scroll', onFirstInteraction, passive)
      window.removeEventListener('mousemove', onFirstInteraction, passive)
      window.removeEventListener('touchstart', onFirstInteraction, passive)
      window.removeEventListener('keydown', onFirstInteraction)
    }

    attach()
    return () => {
      detach()
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
        timerIdRef.current = null
      }
    }
  }, [])

  function onAccept() {
    setSessionCookie(COOKIE_NAME, '1')
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current)
      timerIdRef.current = null
    }
    setVisible(false)
  }

  return (
    <div
      aria-live="polite"
      role="region"
      aria-label="Privacy notice"
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-50 transform-gpu transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="container px-3 sm:px-4 pb-4">
        <div className="pointer-events-auto mx-auto max-w-5xl rounded-2xl border border-emerald-600/60 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700 text-emerald-50 shadow-2xl">
          <div className="p-4 md:p-5">
            <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-wide text-emerald-100/90">
                  Privacy & Cookies - session-only consent. It resets when you close your browser.
                </p>
                <p id="privacy-toast-desc" className="text-sm leading-relaxed">
                  We use essential cookies to keep EcoTrack working and improve your experience.
                  No personal data is stored. By continuing, you agree to this use.
                </p>
              </div>
              <div className="flex w-full justify-end gap-3 md:w-auto">
                <Button
                  variant="secondary"
                  aria-describedby="privacy-toast-desc"
                  onClick={onAccept}
                  className="px-6 whitespace-nowrap"
                >
                  Accept & close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


