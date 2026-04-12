'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import LoginModal from '@/components/LoginModal'

interface LoginModalContextValue {
  openLoginModal: (redirectAfter?: string) => void
}

const LoginModalContext = createContext<LoginModalContextValue>({
  openLoginModal: () => {},
})

export function useLoginModal() {
  return useContext(LoginModalContext)
}

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [redirectAfter, setRedirectAfter] = useState<string | undefined>(undefined)

  const openLoginModal = useCallback((redirect?: string) => {
    setRedirectAfter(redirect)
    setIsOpen(true)
  }, [])

  return (
    <LoginModalContext.Provider value={{ openLoginModal }}>
      {children}
      <LoginModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        redirectAfter={redirectAfter}
      />
    </LoginModalContext.Provider>
  )
}
