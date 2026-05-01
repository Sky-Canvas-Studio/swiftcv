import { Link } from "@tanstack/react-router";
import { BriefcaseBusiness, ExternalLink, Globe, MessageCircle } from "lucide-react";

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Matching", href: "#matching" },
  { label: "Pricing", href: "#pricing" },
];

const resourceLinks = [
  { label: "FAQ", href: "#faq" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

export const Footer = () => {
  return (
    <footer className="border-t bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BriefcaseBusiness className="size-5" />
              </span>
              <span>
                Swift<span className="text-primary">CV</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm leading-7 text-muted-foreground">
              AI-assisted job matching, resume tailoring, and interview prep
              for tech candidates applying worldwide.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Globe, MessageCircle, ExternalLink].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex size-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="SwiftCV social link"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold">Product</h4>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-primary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold">Resources</h4>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-primary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold">For tech candidates</h4>
            <p className="mt-5 leading-7 text-muted-foreground">
              Use SwiftCV to move from a generic resume to targeted
              applications with clearer fit signals and better preparation.
            </p>
            <Link to="/login" className="mt-5 inline-flex text-sm font-bold text-primary">
              Start matching jobs
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} SwiftCV. All rights reserved.</p>
          <p>Built for worldwide software and technology careers.</p>
        </div>
      </div>
    </footer>
  );
};
