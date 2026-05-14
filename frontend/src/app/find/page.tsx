"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Clock,
  Printer,
  Package,
  RotateCcw,
  Phone,
  Navigation,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PartnerShop = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  distance: string;
  phone: string;
  hours: string;
  open: boolean;
  capabilities: {
    dropOff: boolean;
    pickup: boolean;
    returns: boolean;
    print: boolean;
  };
};

const MOCK_SHOPS: PartnerShop[] = [
  {
    id: "PSH-001",
    name: "Ikeja Business Centre",
    address: "12 Allen Avenue",
    city: "Ikeja",
    state: "Lagos",
    distance: "0.3 km",
    phone: "08030000001",
    hours: "8am – 8pm",
    open: true,
    capabilities: { dropOff: true, pickup: true, returns: true, print: true },
  },
  {
    id: "PSH-002",
    name: "Surulere Express Point",
    address: "45 Adeniran Ogunsanya Street",
    city: "Surulere",
    state: "Lagos",
    distance: "1.2 km",
    phone: "08030000002",
    hours: "9am – 7pm",
    open: true,
    capabilities: { dropOff: true, pickup: true, returns: false, print: false },
  },
  {
    id: "PSH-003",
    name: "Lekki Phase 1 Hub",
    address: "7 Freedom Way",
    city: "Lekki",
    state: "Lagos",
    distance: "4.5 km",
    phone: "08030000003",
    hours: "8am – 9pm",
    open: false,
    capabilities: { dropOff: true, pickup: true, returns: true, print: true },
  },
  {
    id: "PSH-004",
    name: "Victoria Island Drop-off",
    address: "22 Adeola Odeku Street",
    city: "Victoria Island",
    state: "Lagos",
    distance: "6.1 km",
    phone: "08030000004",
    hours: "9am – 6pm",
    open: false,
    capabilities: { dropOff: true, pickup: false, returns: false, print: false },
  },
];

const capabilityIcons = {
  dropOff: { icon: Package, label: "Drop-off" },
  pickup: { icon: Package, label: "Collection" },
  returns: { icon: RotateCcw, label: "Returns" },
  print: { icon: Printer, label: "Print label" },
};

export default function FindPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(MOCK_SHOPS[0].id);

  const filtered = MOCK_SHOPS.filter(
    (s) =>
      !query ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.city.toLowerCase().includes(query.toLowerCase()) ||
      s.state.toLowerCase().includes(query.toLowerCase()) ||
      s.address.toLowerCase().includes(query.toLowerCase())
  );

  const selectedShop = MOCK_SHOPS.find((s) => s.id === selected);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top bar */}
      <div className="bg-white border-b border-[var(--border)] px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold mb-3">Find a drop-off point</h1>
          <div className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by area, city or address"
                className="pl-9 h-10"
              />
            </div>
            <Button className="h-10">Search</Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Results list */}
        <div className="w-full md:w-96 flex-shrink-0 overflow-y-auto border-r border-[var(--border)] bg-white">
          <div className="p-3 border-b border-[var(--border)] bg-[var(--muted)]">
            <p className="text-sm text-[var(--muted-foreground)]">
              {filtered.length} location{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {filtered.map((shop) => (
              <button
                key={shop.id}
                onClick={() => setSelected(shop.id)}
                className={cn(
                  "w-full text-left p-4 hover:bg-[var(--secondary)] transition-colors",
                  selected === shop.id && "bg-[var(--secondary)] border-l-2 border-l-[var(--primary)]"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{shop.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5 truncate">
                      {shop.address}, {shop.city}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge
                        variant={shop.open ? "success" : "secondary"}
                        className="text-xs px-1.5 py-0"
                      >
                        {shop.open ? "Open now" : "Closed"}
                      </Badge>
                      <span className="text-xs text-[var(--muted-foreground)]">{shop.hours}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-medium text-[var(--primary)]">{shop.distance}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map placeholder + detail panel */}
        <div className="flex-1 hidden md:flex flex-col">
          {/* Map placeholder */}
          <div className="flex-1 bg-gradient-to-br from-purple-50 to-violet-100 relative flex items-center justify-center">
            <div className="text-center text-[var(--muted-foreground)]">
              <MapPin className="h-12 w-12 mx-auto mb-2 text-[var(--primary)] opacity-50" />
              <p className="text-sm font-medium">Map integration</p>
              <p className="text-xs">Google Maps or similar will render here</p>
            </div>
            {/* Pin markers (decorative) */}
            {MOCK_SHOPS.map((shop, i) => (
              <button
                key={shop.id}
                onClick={() => setSelected(shop.id)}
                className={cn(
                  "absolute flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold shadow-md transition-all",
                  selected === shop.id
                    ? "bg-[var(--primary)] text-white scale-110"
                    : "bg-white text-[var(--primary)] border border-[var(--primary)]"
                )}
                style={{
                  top: `${25 + i * 14}%`,
                  left: `${20 + i * 15}%`,
                }}
              >
                <MapPin className="h-3 w-3" />
                {shop.distance}
              </button>
            ))}
          </div>

          {/* Shop detail panel */}
          {selectedShop && (
            <div className="bg-white border-t border-[var(--border)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">{selectedShop.name}</h2>
                  <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
                    {selectedShop.address}, {selectedShop.city}, {selectedShop.state}
                  </p>
                </div>
                <Badge variant={selectedShop.open ? "success" : "secondary"}>
                  {selectedShop.open ? "Open" : "Closed"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-[var(--muted-foreground)]" />
                  <span>{selectedShop.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-[var(--muted-foreground)]" />
                  <span>{selectedShop.phone}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {(Object.entries(selectedShop.capabilities) as [keyof typeof selectedShop.capabilities, boolean][]).map(
                  ([cap, supported]) => {
                    const { label } = capabilityIcons[cap];
                    return (
                      <Badge
                        key={cap}
                        variant={supported ? "secondary" : "outline"}
                        className={cn(!supported && "opacity-40")}
                      >
                        {label}
                      </Badge>
                    );
                  }
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <Button className="flex-1" asChild>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      `${selectedShop.address}, ${selectedShop.city}, Nigeria`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Get directions
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/send">Send here</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
