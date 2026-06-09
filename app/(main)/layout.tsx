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
      <main className="flex-1 pt-16 pb-12">{children}</main>
      <CrisisBar />
    </>
  )
}
