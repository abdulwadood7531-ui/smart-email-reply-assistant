'use client'

import * as React from "react"
import { X } from "lucide-react"

type ToastProps = {
  message: string
  onClose: () => void
}

export function Toast({ message, onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 min-w-[300px]">
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = React.useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
  }

  const ToastComponent = toast ? (
    <Toast message={toast} onClose={() => setToast(null)} />
  ) : null

  return { showToast, ToastComponent }
}
