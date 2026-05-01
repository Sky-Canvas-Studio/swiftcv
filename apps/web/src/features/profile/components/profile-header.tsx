import { Camera, Pencil, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { PersonalInfo } from "../lib/types";

export function ProfileHeader(props: {
  personal: PersonalInfo;
  photoUrl: string | null;
  onEdit: () => void;
}) {
  const initials = props.personal.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "CV";

  return (
    <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="grid gap-5 p-5 md:grid-cols-[auto_1fr_auto] md:items-center md:p-6">
        <div className="grid justify-items-center gap-2">
          <Avatar className="size-24" size="lg">
            {props.photoUrl && <AvatarImage src={props.photoUrl} alt="" />}
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="sm" onClick={props.onEdit}>
            <Camera className="size-4" />
            Edit
          </Button>
        </div>
        <div className="min-w-0 space-y-2 text-center md:text-left">
          <h1 className="truncate text-2xl font-semibold tracking-normal">
            {props.personal.fullName || "Create your profile"}
          </h1>
          <p className="text-sm font-medium text-primary">
            {props.personal.headline || "Add your professional headline"}
          </p>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {props.personal.summary || "Build one structured profile first. Later, every CV can reuse this information."}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:justify-end">
          <Button variant="outline" size="sm" onClick={props.onEdit}>
            <Pencil className="size-4" />
            Edit profile
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Share2 className="size-4" />
            Share later
          </Button>
        </div>
      </div>
    </section>
  );
}
