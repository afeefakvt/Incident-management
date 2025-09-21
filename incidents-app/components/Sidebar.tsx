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
    <div>
      {/* Mobile: Hamburger menu */}
      <div className="md:hidden p-2 border-b flex justify-between items-center bg-gray-50 ">
        <Sheet open={open} onOpenChange={setOpen} >
          <SheetTrigger asChild >
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left"   className="w-64 p-0 !bg-gray-50 h-full">
            <NavItems pathname={pathname} onNavigate={() => setOpen(false)}  />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 border-r h-screen p-4 ">
        <div className="text-xl font-bold mb-6">Incident Management</div>
        <NavItems pathname={pathname} />
      </aside>
    </div>
  )
}

function NavItems({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-2 bg-gray-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link key={item.href} href={item.href} onClick={onNavigate}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}
