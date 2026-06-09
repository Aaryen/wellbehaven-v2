import Nav from '@/components/layout/Nav'
import CrisisBar from '@/components/layout/CrisisBar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-14 sm:pt-16 pb-[calc(3rem+env(safe-area-inset-bottom))]">{children}</main>
      <CrisisBar />
    </>
  )
}
