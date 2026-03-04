"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search feedback...",
}: SearchBarProps) {
  const [local, setLocal] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value changes
  useEffect(() => {
    setLocal(value);
  }, [value]);

  const handleChange = (newVal: string) => {
    setLocal(newVal);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(newVal);
    }, 300);
  };

  const handleClear = () => {
    setLocal("");
    onChange("");
  };

  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={local}
        onChange={(e) => handleChange(e.target.value)}
        className="h-11 rounded-xl pl-10 pr-10"
        aria-label="Search feedback"
      />
      {local && (
        <button
          onClick={handleClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
