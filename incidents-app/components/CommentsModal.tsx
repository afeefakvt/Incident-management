"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useComments, useAddComment } from "@/lib/queries/comments"

export function CommentsModal({ incidentId, open, onClose }: { incidentId: number, open: boolean, onClose: () => void }) {
  const { data: comments = [], isLoading } = useComments(incidentId)
  const addComment = useAddComment(incidentId)
  const [message, setMessage] = useState("")

  const handleSubmit = () => {
    if (!message.trim()) return
    addComment.mutate(
      { userId:1, message },
      { onSuccess: () => setMessage("") }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {isLoading ? (
            <p>Loading…</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          ) : (
            comments.map((c: any) => (
              <div key={c.id} className="border-b pb-2">
                <p className="text-sm font-medium">{c.user?.name ?? "Unknown"}</p>
                <p className="text-sm">{c.message}</p>
                <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2 pt-2">
          <Input
            placeholder="Write a comment..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={handleSubmit}>Send</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
