import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  MapPin,
  CheckCircle2,
  Clock,
  Truck,
  Store,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

type TrackingEvent = {
  timestamp: string;
  location: string;
  description: string;
  type: "received" | "in_transit" | "out_for_delivery" | "delivered" | "exception";
};

const mockEvents: TrackingEvent[] = [
  {
    timestamp: "2026-05-14T09:30:00",
    location: "Lagos — Surulere Hub",
    description: "Parcel arrived at destination hub",
    type: "in_transit",
  },
  {
    timestamp: "2026-05-13T22:15:00",
    location: "Abuja — Central Hub",
    description: "Parcel departed linehaul manifest",
    type: "in_transit",
  },
  {
    timestamp: "2026-05-13T16:00:00",
    location: "Abuja — Central Hub",
    description: "Parcel scanned into linehaul manifest",
    type: "in_transit",
  },
  {
    timestamp: "2026-05-13T10:45:00",
    location: "Abuja — Wuse Partner Shop",
    description: "Parcel received at drop-off point",
    type: "received",
  },
];

const statusConfig = {
  received: { icon: Store, color: "text-blue-600", bg: "bg-blue-50", label: "Received" },
  in_transit: { icon: Truck, color: "text-amber-600", bg: "bg-amber-50", label: "In Transit" },
  out_for_delivery: { icon: MapPin, color: "text-violet-600", bg: "bg-violet-50", label: "Out for Delivery" },
  delivered: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "Delivered" },
  exception: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", label: "Exception" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function TrackCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const latestEvent = mockEvents[0];
  const latestStatus = latestEvent.type;
  const config = statusConfig[latestStatus];
  const StatusIcon = config.icon;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link
        href="/track"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Track another parcel
      </Link>

      {/* Status card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className={`h-14 w-14 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
              <StatusIcon className={`h-7 w-7 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="font-mono text-xs">
                  {code}
                </Badge>
                <Badge
                  variant="success"
                  className={`${config.bg} ${config.color} border-0`}
                >
                  {config.label}
                </Badge>
              </div>
              <h1 className="text-xl font-bold mt-2">{latestEvent.description}</h1>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-[var(--muted-foreground)]">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{latestEvent.location}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-sm text-[var(--muted-foreground)]">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>{formatDate(latestEvent.timestamp)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-5 w-5 text-[var(--primary)]" />
            Parcel history
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative border-l border-[var(--border)] ml-3 space-y-6">
            {mockEvents.map((event, idx) => {
              const cfg = statusConfig[event.type];
              const Ico = cfg.icon;
              return (
                <li key={idx} className="pl-6">
                  <span
                    className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ${cfg.bg} ring-4 ring-white`}
                  >
                    <Ico className={`h-3.5 w-3.5 ${cfg.color}`} />
                  </span>
                  <p className="font-medium text-sm">{event.description}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{event.location}</p>
                  <time className="text-xs text-[var(--muted-foreground)]">
                    {formatDate(event.timestamp)}
                  </time>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-[var(--muted-foreground)] mb-3">
          Need help with this delivery?
        </p>
        <Button variant="outline" asChild>
          <Link href="/help">Contact support</Link>
        </Button>
      </div>
    </div>
  );
}
