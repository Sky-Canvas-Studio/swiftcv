import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sectionLabels } from "../lib/defaults";
import type { SectionId } from "../lib/types";

export function SectionNavigator(props: {
  order: SectionId[];
  onMove: (from: number, to: number) => void;
}) {
  return (
    <Card className="sticky top-20">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-sm">Profile order</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <nav className="grid gap-1">
          {props.order.map((section, index) => (
            <div key={section} className="grid grid-cols-[1fr_auto] items-center gap-1 rounded-md px-2 py-1.5 hover:bg-muted">
              <a className="truncate text-sm" href={`#profile-${section}`}>
                {sectionLabels[section]}
              </a>
              <div className="flex">
                <Button size="icon-sm" variant="ghost" disabled={index === 0} onClick={() => props.onMove(index, index - 1)}>
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button size="icon-sm" variant="ghost" disabled={index === props.order.length - 1} onClick={() => props.onMove(index, index + 1)}>
                  <ArrowDown className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}
