import { createClient } from '@/lib/supabase/server'
import { hasSupabaseEnv } from '@/lib/supabase/config'
import { DEMO_CAMPAIGNS } from '@/lib/demo-data'
import Navbar from '@/components/navbar'
import { CampaignCard } from '@/components/campaign-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, HandHeart, Heart, ShieldCheck, Users } from 'lucide-react'

export default async function HomePage() {
  let campaignsWithDonorCounts: any[] = []
  
  if (hasSupabaseEnv()) {
    const supabase = await createClient()

    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (campaigns && campaigns.length > 0) {
      const donationCounts = await Promise.all(
        campaigns.map(async (campaign) => {
          const { count } = await supabase
            .from('donations')
            .select('*', { count: 'exact', head: true })
            .eq('campaign_id', campaign.id)
          return { campaignId: campaign.id, count: count || 0 }
        })
      )

      campaignsWithDonorCounts = campaigns.map((campaign) => {
        const donorCount = donationCounts.find((dc) => dc.campaignId === campaign.id)?.count || 0
        return { ...campaign, donorCount }
      })
    }
  } else {
    campaignsWithDonorCounts = DEMO_CAMPAIGNS
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section
          className="relative isolate overflow-hidden bg-red-950"
          style={{
            backgroundImage:
              "linear-gradient(105deg, rgba(69, 10, 10, 0.96) 0%, rgba(127, 29, 29, 0.88) 48%, rgba(185, 28, 28, 0.66) 100%), url('/donation.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/95 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="max-w-3xl space-y-8 text-white">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Support Causes That Matter
              </h1>
              <p className="max-w-2xl text-lg md:text-xl leading-8 text-red-50/85">
                DonationFlow makes it easy to create campaigns, donate to causes you care about,
                and make a real impact in your community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/sign-up">
                  <Button size="lg" className="bg-white text-red-950 shadow-lg shadow-red-950/20 hover:bg-red-50">
                    Start a Campaign
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href="#campaigns">
                  <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-red-950">
                    Explore Campaigns
                  </Button>
                </a>
              </div>
              <div className="grid max-w-2xl grid-cols-1 gap-3 pt-4 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <HandHeart className="w-5 h-5 text-red-200" />
                  <span className="text-sm font-medium text-red-50">Fast donations</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <ShieldCheck className="w-5 h-5 text-red-200" />
                  <span className="text-sm font-medium text-red-50">Trusted giving</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <Users className="w-5 h-5 text-red-200" />
                  <span className="text-sm font-medium text-red-50">Community impact</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 bg-card/40 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-background/90 p-5 shadow-sm shadow-slate-950/5 backdrop-blur-sm dark:shadow-black/20">
                <p className="text-sm text-muted-foreground">Total Raised</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  MAD {campaignsWithDonorCounts.reduce((sum, campaign) => sum + parseFloat(campaign.current_amount || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/90 p-5 shadow-sm shadow-slate-950/5 backdrop-blur-sm dark:shadow-black/20">
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {campaignsWithDonorCounts.length}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/90 p-5 shadow-sm shadow-slate-950/5 backdrop-blur-sm dark:shadow-black/20">
                <p className="text-sm text-muted-foreground">Donors</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {campaignsWithDonorCounts.reduce((sum, campaign) => sum + (campaign.donorCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="campaigns" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-700 dark:text-red-300">
                  Campaigns
                </p>
                <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
                  Active Campaigns
                </h2>
              </div>
              <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                Browse the campaigns already live on the platform and support the causes that matter most.
              </p>
            </div>

            {campaignsWithDonorCounts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border/70 bg-muted/30 px-6 py-16 text-center">
                <p className="text-lg font-medium">No campaigns yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Be the first to create a campaign and start collecting donations.
                </p>
                <div className="mt-6">
                  <Link href="/auth/sign-up">
                    <Button>Create Campaign</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {campaignsWithDonorCounts.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    id={campaign.id}
                    title={campaign.title}
                    description={campaign.description || ''}
                    goalAmount={parseFloat(campaign.goal_amount)}
                    currentAmount={parseFloat(campaign.current_amount)}
                    imageUrl={campaign.image_url}
                    category={campaign.category || 'General'}
                    donorCount={campaign.donorCount || 0}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        </main>
      <footer className="border-t border-red-900 bg-red-950 text-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-red-200 text-red-200" />
              <span className="font-semibold">DonationFlow</span>
            </Link>
            <p className="text-sm text-red-100/75">
              Building a transparent way to fund causes that matter.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
