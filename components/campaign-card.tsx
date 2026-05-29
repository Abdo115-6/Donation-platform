import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/progress-bar'
import { Heart } from 'lucide-react'

interface CampaignCardProps {
  id: string
  title: string
  description: string
  goalAmount: number
  currentAmount: number
  imageUrl?: string
  category: string
  donorCount: number
}

export function CampaignCard({
  id,
  title,
  description,
  goalAmount,
  currentAmount,
  imageUrl,
  category,
  donorCount,
}: CampaignCardProps) {
  const progress = (currentAmount / goalAmount) * 100

  return (
    <Link href={`/campaigns/${id}`} className="group block h-full">
      <Card className="h-full cursor-pointer overflow-hidden border-border/60 transition-all duration-200 hover:-translate-y-1 hover:border-red-200/80 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:hover:border-red-500/30 dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.24)]">
        {imageUrl && (
          <div className="relative h-48 w-full overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent" />
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
              <p className="mt-2 inline-flex rounded-full border border-red-200/70 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 shadow-sm shadow-red-950/5 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-100">
                {category}
              </p>
            </div>
            <Heart className="w-5 h-5 text-red-300 flex-shrink-0 transition-colors group-hover:fill-red-500 group-hover:text-red-500" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          <div className="space-y-2">
            <ProgressBar value={Math.min(progress, 100)} />
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-foreground">MAD {currentAmount.toLocaleString()}</span>
              <span className="text-muted-foreground">MAD {goalAmount.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground">{donorCount} donors</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full shadow-sm shadow-red-950/10 transition-transform group-hover:-translate-y-0.5" size="sm">
            Donate Now
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
