import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { CalendarDays, Heart, MessageSquare, Shield, UserCircle2 } from 'lucide-react'

import Navbar from '@/components/navbar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { hasSupabaseEnv } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

interface ProfileRow {
  full_name: string | null
  avatar_url: string | null
  created_at: string | null
}

interface DonationRow {
  id: string
  campaign_id: string
  amount: string
  donor_name: string | null
  message: string | null
  anonymous: boolean
  created_at: string
}

export default async function ProfilePage() {
  if (!hasSupabaseEnv()) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile</h1>
            <p className="text-muted-foreground mb-8">
              Connect Supabase to load your profile and donation history.
            </p>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
                  to `.env.local`, then restart the dev server.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: donations }] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, avatar_url, created_at')
      .eq('id', user.id)
      .maybeSingle<ProfileRow>(),
    supabase
      .from('donations')
      .select('id, campaign_id, amount, donor_name, message, anonymous, created_at')
      .eq('donor_id', user.id)
      .order('created_at', { ascending: false })
      .returns<DonationRow[]>(),
  ])

  const donationRows = donations || []
  const campaignIds = [...new Set(donationRows.map((donation) => donation.campaign_id))]

  const { data: campaigns } =
    campaignIds.length === 0
      ? { data: [] as { id: string; title: string | null }[] }
      : await supabase.from('campaigns').select('id, title').in('id', campaignIds)

  const campaignMap = new Map(
    (campaigns || []).map((campaign) => [campaign.id, campaign.title || 'Unknown campaign']),
  )
  const totalDonated = donationRows.reduce(
    (sum, donation) => sum + parseFloat(donation.amount || '0'),
    0,
  )
  const anonymousCount = donationRows.filter((donation) => donation.anonymous).length
  const commentedCount = donationRows.filter((donation) =>
    Boolean(donation.message?.trim()),
  ).length
  const displayName =
    profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const publicDonorName =
    profile?.full_name || user.user_metadata?.full_name || donationRows[0]?.donor_name || 'Not set'
  const joinedAt = profile?.created_at
    ? format(new Date(profile.created_at), 'MMM d, yyyy')
    : 'Unknown'
  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase())
      .join('') || 'U'

  const stats = [
    {
      title: 'Total Donations',
      value: donationRows.length,
      icon: Heart,
      iconClassName: 'text-rose-600 dark:text-rose-300',
      badgeClassName: 'bg-rose-500/12 ring-1 ring-rose-500/20',
    },
    {
      title: 'Total Donated',
      value: `MAD ${totalDonated.toLocaleString()}`,
      icon: UserCircle2,
      iconClassName: 'text-emerald-600 dark:text-emerald-300',
      badgeClassName: 'bg-emerald-500/12 ring-1 ring-emerald-500/20',
    },
    {
      title: 'Anonymous Donations',
      value: anonymousCount,
      icon: Shield,
      iconClassName: 'text-amber-600 dark:text-amber-300',
      badgeClassName: 'bg-amber-500/12 ring-1 ring-amber-500/20',
    },
    {
      title: 'Comments Left',
      value: commentedCount,
      icon: MessageSquare,
      iconClassName: 'text-sky-600 dark:text-sky-300',
      badgeClassName: 'bg-sky-500/12 ring-1 ring-sky-500/20',
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.08),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.08),_transparent_28%),linear-gradient(to_bottom,_transparent,_rgba(15,23,42,0.03))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <Card className="overflow-hidden border-border/60 shadow-sm">
            <CardContent className="relative p-0">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.14),transparent_38%,rgba(59,130,246,0.14))]" />
              <div className="relative grid gap-8 px-6 py-8 md:px-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                  <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                    Donor profile
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.75rem] bg-foreground text-background shadow-lg shadow-foreground/10">
                      <span className="text-2xl font-semibold">{initials}</span>
                    </div>
                    <div className="min-w-0 space-y-2">
                      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                        {displayName}
                      </h1>
                      <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                        A clean view of your account identity, donation activity, and
                        comment history across campaigns.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                          {user.email}
                        </Badge>
                        <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                          Joined {joinedAt}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-3xl border border-border/60 bg-background/80 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Public donor name
                    </p>
                    <p className="mt-2 text-lg font-semibold">{publicDonorName}</p>
                  </div>
                  <div className="rounded-3xl border border-border/60 bg-background/80 p-4 backdrop-blur">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <p className="text-xs uppercase tracking-[0.2em]">Membership</p>
                    </div>
                    <p className="mt-2 text-lg font-semibold">{joinedAt}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <Card
                  key={stat.title}
                  className="border-border/60 shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
                      </div>
                      <div className={`rounded-2xl p-3 ${stat.badgeClassName}`}>
                        <Icon className={`h-5 w-5 ${stat.iconClassName}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="flex flex-col gap-2 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle className="text-2xl tracking-tight">Donation History</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Every contribution you have made, with comments and anonymity status.
                </p>
              </div>
              <div className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-sm text-muted-foreground">
                {donationRows.length} {donationRows.length === 1 ? 'donation' : 'donations'}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {donationRows.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border/70 bg-muted/30 py-14 text-center">
                  <p className="text-base font-medium">No donations yet</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Once you support a campaign, the history will appear here.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 md:hidden">
                    {donationRows.map((donation) => (
                      <div
                        key={donation.id}
                        className="rounded-3xl border border-border/60 bg-background p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm text-muted-foreground">Campaign</p>
                            <p className="truncate font-semibold">
                              {campaignMap.get(donation.campaign_id) || 'Unknown campaign'}
                            </p>
                          </div>
                          <p className="shrink-0 text-base font-semibold text-emerald-600">
                            MAD {parseFloat(donation.amount || '0').toLocaleString()}
                          </p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Badge
                            variant={donation.anonymous ? 'secondary' : 'outline'}
                            className="rounded-full"
                          >
                            {donation.anonymous ? 'Anonymous' : 'Public'}
                          </Badge>
                          <Badge variant="outline" className="rounded-full">
                            {format(new Date(donation.created_at), 'MMM d, yyyy')}
                          </Badge>
                        </div>
                        <div className="mt-4 rounded-2xl bg-muted/40 p-3 text-sm text-muted-foreground">
                          {donation.message?.trim()
                            ? `"${donation.message.trim()}"`
                            : 'No comment left.'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden overflow-hidden rounded-3xl border border-border/60 md:block">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead>Campaign</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Comment</TableHead>
                          <TableHead>Visibility</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {donationRows.map((donation) => (
                          <TableRow key={donation.id} className="align-top">
                            <TableCell className="max-w-[220px] font-medium">
                              {campaignMap.get(donation.campaign_id) || 'Unknown campaign'}
                            </TableCell>
                            <TableCell className="font-semibold text-emerald-600">
                              MAD {parseFloat(donation.amount || '0').toLocaleString()}
                            </TableCell>
                            <TableCell className="max-w-[320px] text-muted-foreground">
                              {donation.message?.trim() ? `"${donation.message.trim()}"` : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={donation.anonymous ? 'secondary' : 'outline'}
                                className="rounded-full"
                              >
                                {donation.anonymous ? 'Anonymous' : 'Public'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(new Date(donation.created_at), 'MMM d, yyyy | HH:mm')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
