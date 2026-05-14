"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function TrackPage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed) {
      router.push(`/track/${trimmed}`);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Track your parcel</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Enter your 16-character tracking code to see the latest status.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. LD4X9QR2MNKB7YAZ"
          className="flex-1 h-12 text-base uppercase placeholder:normal-case"
          maxLength={20}
          autoComplete="off"
          autoFocus
        />
        <Button type="submit" size="lg" className="h-12" disabled={!code.trim()}>
          <Search className="h-4 w-4 mr-2" />
          Track
        </Button>
      </form>
      <p className="mt-4 text-sm text-center text-[var(--muted-foreground)]">
        Your tracking code is on your booking confirmation or receipt.
      </p>
    </div>
  );
}
