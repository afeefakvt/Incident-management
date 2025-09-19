"use client"

import { Bell } from "lucide-react"
import { useNotifications,useMarkNotificationRead } from "@/lib/queries/notifications"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function NotificationBell() {
  const { data: notifications = [], isLoading } = useNotifications()
  const markRead = useMarkNotificationRead()

  const unreadCount = notifications.filter((n: any) => !n.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        {isLoading ? (
          <DropdownMenuItem>Loading...</DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem>No notifications</DropdownMenuItem>
        ) : (
          notifications.map((n: any) => (
            <DropdownMenuItem
              key={n.id}
              className={`flex flex-col items-start ${!n.read ? "bg-gray-100" : ""}`}
              onClick={() => markRead.mutate(n.id)}
            >
              <span className="font-medium text-sm">{n.message}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
