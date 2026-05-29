import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Target, Heart, Users, DollarSign } from 'lucide-react'

interface DashboardStatsProps {
  stats: {
    totalCampaigns: number
    totalRaised: number
    totalDonations: number
    totalDonors: number
    platformRevenue?: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Active Campaigns',
      value: stats.totalCampaigns,
      icon: Target,
      color: 'bg-blue-50 ring-1 ring-blue-100 shadow-sm shadow-blue-950/5 dark:bg-blue-500/10 dark:ring-blue-500/20',
      textColor: 'text-blue-600 dark:text-blue-300',
    },
    {
      title: 'Total Raised',
      value: `MAD ${stats.totalRaised.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-emerald-50 ring-1 ring-emerald-100 shadow-sm shadow-emerald-950/5 dark:bg-emerald-500/10 dark:ring-emerald-500/20',
      textColor: 'text-emerald-600 dark:text-emerald-300',
    },
    {
      title: 'Total Donations',
      value: stats.totalDonations,
      icon: Heart,
      color: 'bg-red-50 ring-1 ring-red-100 shadow-sm shadow-red-950/5 dark:bg-red-500/10 dark:ring-red-500/20',
      textColor: 'text-red-600 dark:text-red-300',
    },
    {
      title: 'Unique Donors',
      value: stats.totalDonors,
      icon: Users,
      color: 'bg-violet-50 ring-1 ring-violet-100 shadow-sm shadow-violet-950/5 dark:bg-violet-500/10 dark:ring-violet-500/20',
      textColor: 'text-purple-600 dark:text-purple-300',
    },
  ]

  const platformStat = stats.platformRevenue !== undefined ? {
    title: 'Platform Revenue',
    value: `MAD ${stats.platformRevenue.toLocaleString()}`,
    icon: DollarSign,
    color: 'bg-amber-50 ring-1 ring-amber-100 shadow-sm shadow-amber-950/5 dark:bg-amber-500/10 dark:ring-amber-500/20',
    textColor: 'text-amber-600 dark:text-amber-300',
  } : null

  const displayStats = platformStat ? [...statCards, platformStat] : statCards

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {displayStats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="transition-shadow hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.24)]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-xl p-2.5 ${stat.color}`}>
                  <Icon className={`w-4 h-4 ${stat.textColor}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
