"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

export type StoryKind = "story" | "bug";

const OPTIONS: { value: StoryKind; label: string }[] = [
  { value: "story", label: "Story" },
  { value: "bug", label: "Bug" },
];

type StoryTypeSelectProps = {
  value: StoryKind;
  onChange: (next: StoryKind) => void | Promise<void>;
  disabled?: boolean;
  id?: string;
  listboxLabelledBy?: string;
};

export const StoryTypeSelect = ({
  value,
  onChange,
  disabled = false,
  id,
  listboxLabelledBy,
}: StoryTypeSelectProps) => {
  const reactId = useId();
  const triggerId = id ?? `story-type-${reactId}`;
  const listboxId = `${triggerId}-listbox`;
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const initialIdx = OPTIONS.findIndex((o) => o.value === value);
  const [highlightIndex, setHighlightIndex] = useState(
    initialIdx >= 0 ? initialIdx : 0
  );

  const selectedLabel =
    OPTIONS.find((o) => o.value === value)?.label ?? "Story";

  const commit = useCallback(
    async (next: StoryKind) => {
      if (disabled) {
        return;
      }
      setOpen(false);
      triggerRef.current?.focus();
      if (next === value) {
        return;
      }
      await Promise.resolve(onChange(next));
    },
    [disabled, onChange, value]
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    const handlePointerDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      listboxRef.current?.focus();
    }
  }, [open]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) {
      return;
    }
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlightIndex(
        OPTIONS.findIndex((o) => o.value === value) >= 0
          ? OPTIONS.findIndex((o) => o.value === value)
          : 0
      );
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      const idx = OPTIONS.findIndex((o) => o.value === value);
      setHighlightIndex(idx >= 0 ? idx : 0);
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % OPTIONS.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i - 1 + OPTIONS.length) % OPTIONS.length);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const opt = OPTIONS[highlightIndex];
      if (opt) {
        void commit(opt.value);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => {
          if (disabled) {
            return;
          }
          setOpen((prev) => {
            const next = !prev;
            if (next) {
              const idx = OPTIONS.findIndex((o) => o.value === value);
              setHighlightIndex(idx >= 0 ? idx : 0);
            }
            return next;
          });
        }}
        onKeyDown={handleTriggerKeyDown}
        className="uscreator-field flex w-full items-center justify-between gap-3 text-left disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="truncate">{selectedLabel}</span>
        <span
          className={`shrink-0 text-[#a1a1a6] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          <svg
            className="h-4 w-4 opacity-90"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            />
          </svg>
        </span>
      </button>

      {open && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          tabIndex={0}
          aria-labelledby={listboxLabelledBy}
          onKeyDown={handleListKeyDown}
          className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-white/[0.14] bg-[#1c1c1e] py-1 shadow-[0_16px_48px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.06]"
        >
          {OPTIONS.map((opt, index) => {
            const isActive = opt.value === value;
            const isHi = index === highlightIndex;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isActive}
                className={`cursor-pointer px-4 py-2.5 text-[15px] transition-colors ${
                  isHi ? "bg-white/[0.08]" : "bg-transparent"
                } ${
                  isActive ? "font-semibold text-[#f5f5f7]" : "text-[#d1d1d6]"
                }`}
                onMouseEnter={() => setHighlightIndex(index)}
                onClick={() => void commit(opt.value)}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
