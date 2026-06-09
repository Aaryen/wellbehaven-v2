export default function CrisisBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-[#162018]/95 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] text-center backdrop-blur-sm">
      <p className="text-xs text-zinc-400">
        If you&apos;re in crisis, please reach out immediately —{' '}
        <a href="tel:988" className="font-semibold text-white underline">
          call or text 988
        </a>{' '}
        or text{' '}
        <a href="sms:741741" className="font-semibold text-white underline">
          HOME to 741741
        </a>
      </p>
    </div>
  )
}
