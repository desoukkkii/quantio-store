import { useStore } from '../context/StoreContext'

export default function ToastContainer() {
  const { toasts } = useStore()

  return (
    <div className="fixed bottom-7 right-7 z-[400] flex flex-col gap-2.5 pointer-events-none max-[480px]:left-4 max-[480px]:right-4 max-[480px]:bottom-5" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`bg-ink text-white rounded-md px-5 py-[13px] flex items-center gap-3 text-[0.85rem] font-medium shadow-xl animate-toast-in pointer-events-auto max-w-[340px] max-[480px]:max-w-full`}
          role="status"
        >
          <i className={`fas ${t.icon} ${t.type === 'error' ? 'text-red' : 'text-gold'} text-base shrink-0`} aria-hidden="true"></i>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}
