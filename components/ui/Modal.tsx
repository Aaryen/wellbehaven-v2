'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) dialog.showModal()
    else dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="rounded-xl p-0 shadow-xl backdrop:bg-black/40 w-full max-w-md"
      onClose={onClose}
    >
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        <button onClick={onClose} className="ml-auto rounded p-1 hover:bg-zinc-100">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="px-6 py-4">{children}</div>
    </dialog>
  )
}
