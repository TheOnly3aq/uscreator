/**
 * Footer component displaying creator information and links
 */
export function Footer() {
  return (
    <footer>
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col items-center justify-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 text-center">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <a
              href="https://astrode.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 dark:text-zinc-100 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors font-medium"
            >
              Astrode.Dev
            </a>
            <span className="hidden sm:inline">•</span>
            <span>© Copyright 2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
