import Link from "next/link";

interface HeaderProps {
  showStatus?: boolean;
  userName?: string;
  userRole?: string;
  title?: string;
  subtitle?: string;
}

export function Header({
  showStatus = true,
  userName = "K. Miller",
  userRole = "Opérateur",
  title,
  subtitle,
}: HeaderProps) {
  return (
    <header className="w-full bg-white/90 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="px-6 md:px-12 py-6 flex items-center justify-between max-w-5xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-4 text-black hover:opacity-70 transition-opacity"
          >
            <div className="text-black opacity-80">
              <span className="material-symbols-outlined text-2xl font-light">
                hub
              </span>
            </div>
            <h2 className="text-base font-medium tracking-wide font-serif text-black italic">
              Uprising Node
            </h2>
          </Link>

          {/* Page Title */}
          {title && (
            <div className="hidden md:block pl-8 border-l border-gray-100">
              <h1 className="text-lg font-serif font-medium text-black">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-8">
          {/* Status Indicator */}
          {showStatus && (
            <div className="hidden md:flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/80 animate-pulse" />
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                En ligne
              </span>
            </div>
          )}

          {/* User Info */}
          <div className="flex items-center gap-4 pl-8 border-l border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] font-semibold uppercase text-gray-400 tracking-widest mb-0.5">
                {userRole}
              </p>
              <p className="text-sm font-medium leading-none text-black font-serif">
                {userName}
              </p>
            </div>
            <div className="bg-center bg-no-repeat bg-cover grayscale opacity-90 size-8 rounded-full border border-gray-100 ring-2 ring-white bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDMflAqpGYir9XOgJftZNEspNP4YhL4rOPhdqw0jK_aScxv1hEB3L_lzTmM9Yhh7p9Bx-zR8FPI8BGHUHUllrAJDb-KhtUBsqU-ow4gz1n2Xk6fA8mW9g47-WRYmuNS0QAW_9o-jagO5g5z8bKdLzEnz2LlxLpmlbixX3D_b0WsSTorkGrwc3J7RGALpmKOBVUrUK7iA48qG0b4tWxQnQOXK_S9JVfjK6tVa4xwe4PR4q82uVCiUq2Ob5fW4_0YZ9Smp0LT32pSxHGh')]" />
          </div>
        </div>
      </div>
    </header>
  );
}
