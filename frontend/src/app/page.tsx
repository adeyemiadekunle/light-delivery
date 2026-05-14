import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  MapPin,
  Search,
  ShieldCheck,
  Truck,
  Clock,
  Store,
  ArrowRight,
} from "lucide-react";
import { TrackForm } from "@/components/home/track-form";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#3b0764] via-[#5b21b6] to-[#7c3aed] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium">
                <ShieldCheck className="h-4 w-4" />
                Nigeria&rsquo;s trusted delivery network
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Send parcels anywhere in Nigeria
              </h1>
              <p className="text-lg text-purple-200 max-w-md">
                Drop off at thousands of partner shops, track every step, and get
                proof of delivery. No vans to hire. No hassle.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="xl" className="bg-white text-[#5b21b6] hover:bg-purple-50" asChild>
                  <Link href="/send">Send a parcel</Link>
                </Button>
                <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="/find">Find a drop-off</Link>
                </Button>
              </div>
            </div>

            {/* Quick track widget */}
            <div className="bg-white rounded-2xl p-6 text-[var(--foreground)] shadow-2xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-[var(--primary)]" />
                Track your parcel
              </h2>
              <TrackForm />
              <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                Enter your 16-character tracking code (e.g. LD4X9QR2MNKB7YAZ)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[var(--secondary)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "36+", label: "States covered" },
              { value: "774", label: "LGAs in network" },
              { value: "2,000+", label: "Drop-off points" },
              { value: "24 hrs", label: "Average delivery" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-[var(--primary)]">{stat.value}</div>
                <div className="text-sm text-[var(--muted-foreground)] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--foreground)]">How it works</h2>
          <p className="mt-3 text-[var(--muted-foreground)] max-w-xl mx-auto">
            Send a parcel in three simple steps — no van, no fuss.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Package,
              step: "1",
              title: "Book online",
              desc: "Enter your parcel details, pick a service, and get an instant price. Print your label or use a QR code.",
            },
            {
              icon: Store,
              step: "2",
              title: "Drop off nearby",
              desc: "Find your nearest partner shop and drop off your parcel. Thousands of locations across Nigeria.",
            },
            {
              icon: Truck,
              step: "3",
              title: "We handle the rest",
              desc: "Your parcel moves through our hub network. The receiver gets a tracking link and real-time updates.",
            },
          ].map(({ icon: Icon, step, title, desc }) => (
            <Card key={step} className="relative overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-[var(--secondary)] flex items-center justify-center">
                    <Icon className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">
                      Step {step}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button size="lg" asChild>
            <Link href="/send">
              Get started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[var(--muted)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why choose Rands?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: "Find drop-offs by map",
                desc: "GPS-powered partner shop finder — see opening hours, capabilities, and directions.",
              },
              {
                icon: Search,
                title: "End-to-end tracking",
                desc: "16-character tracking codes give you a full custody timeline from drop-off to delivery.",
              },
              {
                icon: Clock,
                title: "Real-time notifications",
                desc: "SMS, WhatsApp, and email updates keep senders and receivers in the loop at every step.",
              },
              {
                icon: ShieldCheck,
                title: "Proof of delivery",
                desc: "OTP pickup, digital signatures, and photo evidence protect every handover.",
              },
              {
                icon: Package,
                title: "Returns made easy",
                desc: "Customers can initiate returns online. Drop back at any partner shop.",
              },
              {
                icon: Truck,
                title: "Business accounts",
                desc: "Bulk booking, wallet credit, merchant invoicing, and volume pricing for businesses.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 bg-white rounded-xl p-5 border border-[var(--border)]">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-[var(--secondary)] flex items-center justify-center">
                  <Icon className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find drop-off CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-[#5b21b6] to-[#7c3aed] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold">Find your nearest drop-off</h2>
            <p className="text-purple-200 max-w-md">
              Over 2,000 partner shops across Nigeria, open 7 days a week. Find one near you in seconds.
            </p>
          </div>
          <Button
            size="xl"
            className="bg-white text-[#5b21b6] hover:bg-purple-50 flex-shrink-0"
            asChild
          >
            <Link href="/find">
              <MapPin className="mr-2 h-5 w-5" />
              Find drop-off points
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
