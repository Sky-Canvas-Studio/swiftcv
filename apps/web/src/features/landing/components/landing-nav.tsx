import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { BriefcaseBusiness, Menu, Moon, Sun, X } from "lucide-react";
import UserMenu from "@/components/core/user-menu";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Matching", href: "#matching" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const LandingNav = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="h-16">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/88 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="flex items-center gap-2 text-xl font-bold"
                onClick={closeMenu}
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BriefcaseBusiness className="size-5" />
                </span>
                <span>
                  Swift<span className="text-primary">CV</span>
                </span>
              </Link>
              <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </Button>
              <div className="hidden sm:flex sm:items-center sm:gap-2">
                <UserMenu />
              </div>
              <Button
                variant="outline"
                size="icon-sm"
                className="lg:hidden"
                onClick={() => setIsOpen((value) => !value)}
                aria-label="Toggle navigation"
              >
                {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "border-t bg-background/96 lg:hidden",
            isOpen ? "block" : "hidden"
          )}
        >
          <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
              <Link to="/login" onClick={closeMenu}>
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link to="/login" onClick={closeMenu}>
                <Button className="w-full">Get started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
