"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function TrackForm() {
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
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter tracking code"
        className="flex-1 h-11 uppercase placeholder:normal-case"
        maxLength={20}
        autoComplete="off"
      />
      <Button type="submit" size="default" className="h-11 px-4" disabled={!code.trim()}>
        <Search className="h-4 w-4" />
        <span className="sr-only">Track</span>
      </Button>
    </form>
  );
}
