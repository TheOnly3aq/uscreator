/**
 * Footer component displaying creator information and links
 * @returns {JSX.Element} The footer component
 */
export const Footer = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-black/40 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-5 py-6">
        <div className="flex flex-col items-center justify-center gap-2 text-center text-[13px] text-[#a1a1a6]">
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3">
            <span className="font-medium text-[#f5f5f7] transition-colors hover:text-white">
              Made by KT
            </span>
            <span className="hidden text-[#424245] sm:inline" aria-hidden>
              •
            </span>
            <span>© Copyright 2026</span>
            <span className="hidden text-[#424245] sm:inline" aria-hidden>
              •
            </span>
            <span className="text-[12px] text-[#6e6e73]">v1.3.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
