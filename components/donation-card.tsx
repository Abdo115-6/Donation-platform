import { Card, CardContent } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { Heart } from 'lucide-react'

interface DonationCardProps {
  donorName?: string
  amount: number
  message?: string
  anonymous: boolean
  createdAt: string
}

export function DonationCard({
  donorName,
  amount,
  message,
  anonymous,
  createdAt,
}: DonationCardProps) {
  return (
    <Card className="overflow-hidden border-border/60 bg-card/90">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 ring-1 ring-border/70">
                <Heart className="w-4 h-4 flex-shrink-0 text-primary" />
              </span>
              <p className="font-semibold text-sm">
                {anonymous ? 'Anonymous Donor' : donorName || 'Donor'}
              </p>
            </div>
            {message && <p className="mb-2 text-sm italic text-muted-foreground">"{message}"</p>}
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
          <div className="flex-shrink-0 rounded-2xl border border-emerald-200/70 bg-emerald-50 px-3 py-2 text-right shadow-sm shadow-emerald-950/5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Donation</p>
            <p className="font-bold text-lg text-emerald-700 dark:text-emerald-300">MAD {amount.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
