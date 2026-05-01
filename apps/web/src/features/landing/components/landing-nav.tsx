import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { BriefcaseBusiness, Menu, Moon, Sun } from "lucide-react";
import UserMenu from "@/components/core/user-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Matching", href: "#matching" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const LandingNav = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-16">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/88 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="flex items-center gap-2 text-xl font-bold"
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
              <MobileNavDrawer />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

function MobileNavDrawer() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon-sm"
            className="lg:hidden"
            aria-label="Open navigation"
          />
        }
      >
        <Menu className="size-4" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[86vw] max-w-80 border-r bg-background/96 p-0 backdrop-blur-xl sm:max-w-sm lg:hidden"
      >
        <SheetHeader className="border-b p-5">
          <SheetTitle>
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BriefcaseBusiness className="size-5" />
              </span>
              <span>
                Swift<span className="text-primary">CV</span>
              </span>
            </Link>
          </SheetTitle>
          <SheetDescription>
            AI job matching, resume tailoring, and interview prep for tech
            candidates.
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <SheetClose key={item.href}>
              <a
                href={item.href}
                className="flex rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </a>
            </SheetClose>
          ))}
        </nav>

        <SheetFooter className="border-t p-4">
          <SheetClose>
            <Link to="/login">
              <Button variant="outline" className="w-full justify-center">
                Log in
              </Button>
            </Link>
          </SheetClose>
          <SheetClose>
            <Link to="/login">
              <Button className="w-full justify-center">Get started</Button>
            </Link>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
