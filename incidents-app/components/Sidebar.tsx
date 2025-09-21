"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Menu,
  X,
} from "lucide-react"

const navItems = [
  { href: "/fleetmanager/incidents/stats", label: "Dashboard", icon: LayoutDashboard },
  { href: "/fleetmanager/incidents", label: "Incidents", icon: FileText },
  { href: "/fleetmanager/incidents/new", label: "Report Incident", icon: AlertTriangle },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Incident Management</h2>
                </div>
                <div className="flex-1 p-4">
                  <NavItems pathname={pathname} onNavigate={() => setOpen(false)} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold text-gray-900">Incidents</h1>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Incident Management</h2>
          </div>
          <div className="flex-1 p-4">
            <NavItems pathname={pathname} />
          </div>
        </div>
      </aside>
    </>
  )
}

function NavItems({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link key={item.href} href={item.href} onClick={onNavigate}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-3 h-11 px-4 ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}