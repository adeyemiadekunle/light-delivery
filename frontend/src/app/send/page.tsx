"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Package, MapPin, CreditCard, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "details" | "service" | "payment" | "confirm";

const steps: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: "details", label: "Parcel details", icon: Package },
  { key: "service", label: "Service", icon: MapPin },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "confirm", label: "Confirm", icon: CheckCircle2 },
];

const SERVICES = [
  {
    id: "standard",
    name: "Standard",
    delivery: "2–3 business days",
    price: "₦2,500",
    description: "Reliable delivery across Nigeria",
    popular: false,
  },
  {
    id: "express",
    name: "Express",
    delivery: "Next business day",
    price: "₦4,500",
    description: "Priority handling through our hub network",
    popular: true,
  },
  {
    id: "sameday",
    name: "Same Day",
    delivery: "Same day within city",
    price: "₦6,000",
    description: "Available in Lagos, Abuja & Port Harcourt",
    popular: false,
  },
];

export default function SendPage() {
  const [step, setStep] = useState<Step>("details");
  const [selectedService, setSelectedService] = useState("express");

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Send a parcel</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">
          Get an instant quote and print your label in minutes.
        </p>
      </div>

      {/* Progress stepper */}
      <div className="flex items-center mb-10 overflow-x-auto">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const done = idx < currentStepIndex;
          const active = s.key === step;
          return (
            <div key={s.key} className="flex items-center flex-shrink-0">
              <button
                onClick={() => done && setStep(s.key)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  active && "bg-[var(--primary)] text-white",
                  done && "text-[var(--primary)] cursor-pointer hover:bg-[var(--secondary)]",
                  !active && !done && "text-[var(--muted-foreground)] cursor-default"
                )}
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {idx < steps.length - 1 && (
                <ChevronRight className="h-4 w-4 mx-1 text-[var(--muted-foreground)] flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step: Parcel details */}
      {step === "details" && (
        <Card>
          <CardHeader>
            <CardTitle>Parcel & addresses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Sender name</label>
                <Input placeholder="Your full name" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Sender phone</label>
                <Input placeholder="08030000000" type="tel" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Sender address</label>
              <Input placeholder="Street address, city, state" />
            </div>

            <div className="border-t border-[var(--border)] pt-4">
              <h3 className="text-sm font-semibold mb-3">Receiver details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Receiver name</label>
                  <Input placeholder="Receiver's full name" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Receiver phone</label>
                  <Input placeholder="08030000000" type="tel" />
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                <label className="text-sm font-medium">Delivery address</label>
                <Input placeholder="Street address, city, state" />
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-4">
              <h3 className="text-sm font-semibold mb-3">Parcel dimensions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {["Weight (kg)", "Length (cm)", "Width (cm)", "Height (cm)"].map((label) => (
                  <div key={label} className="space-y-1.5">
                    <label className="text-sm font-medium">{label}</label>
                    <Input placeholder="0" type="number" min="0" step="0.1" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button size="lg" onClick={() => setStep("service")}>
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Service selection */}
      {step === "service" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Choose your service</h2>
          {SERVICES.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={cn(
                "w-full text-left rounded-xl border-2 p-5 transition-colors",
                selectedService === service.id
                  ? "border-[var(--primary)] bg-[var(--secondary)]"
                  : "border-[var(--border)] bg-white hover:border-purple-300"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{service.name}</span>
                    {service.popular && (
                      <Badge variant="default" className="text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">{service.description}</p>
                  <p className="text-sm text-[var(--primary)] font-medium mt-1">{service.delivery}</p>
                </div>
                <div className="text-xl font-bold text-[var(--primary)] flex-shrink-0">
                  {service.price}
                </div>
              </div>
            </button>
          ))}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep("details")}>
              Back
            </Button>
            <Button size="lg" onClick={() => setStep("payment")}>
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step: Payment */}
      {step === "payment" && (
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-[var(--secondary)] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Selected service</p>
                <p className="font-semibold capitalize">{selectedService}</p>
              </div>
              <div className="text-xl font-bold text-[var(--primary)]">
                {SERVICES.find((s) => s.id === selectedService)?.price}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Card number</label>
                <Input placeholder="0000 0000 0000 0000" maxLength={19} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Expiry date</label>
                  <Input placeholder="MM / YY" maxLength={7} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">CVV</label>
                  <Input placeholder="123" maxLength={4} type="password" />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep("service")}>
                Back
              </Button>
              <Button size="lg" onClick={() => setStep("confirm")}>
                Pay &amp; confirm <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Confirmation */}
      {step === "confirm" && (
        <div className="text-center space-y-6 py-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-700">Booking confirmed!</h2>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Your parcel has been booked. Here&rsquo;s your tracking code:
            </p>
          </div>
          <div className="bg-[var(--secondary)] rounded-xl py-4 px-8 inline-block">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
              Tracking code
            </p>
            <p className="text-2xl font-bold font-mono tracking-widest text-[var(--primary)]">
              LD4X9QR2MNKB7YAZ
            </p>
          </div>
          <p className="text-sm text-[var(--muted-foreground)] max-w-sm mx-auto">
            A confirmation with your label has been sent to your email.
            Drop off your parcel at any partner shop within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <a href="/track/LD4X9QR2MNKB7YAZ">Track this parcel</a>
            </Button>
            <Button size="lg" variant="outline" onClick={() => setStep("details")}>
              Send another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
