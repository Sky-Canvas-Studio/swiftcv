import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ProfileSectionCard(props: {
  id: string;
  title: string;
  icon: ReactNode;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  addLabel?: string;
  onAdd?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  children: ReactNode;
}) {
  return (
    <Card id={props.id} className="scroll-mt-24 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b p-4">
        <CardTitle className="flex min-w-0 items-center gap-2 text-sm">
          {props.icon}
          <span className="truncate">{props.title}</span>
        </CardTitle>
        <div className="flex shrink-0 items-center gap-1">
          {props.onAdd && (
            <Button size="sm" variant="outline" onClick={props.onAdd}>
              <Plus className="size-4" />
              <span className="hidden sm:inline">{props.addLabel ?? "Add"}</span>
            </Button>
          )}
          <MoveButton label="Move section up" disabled={!props.canMoveUp} onClick={props.onMoveUp}>
            <ArrowUp className="size-4" />
          </MoveButton>
          <MoveButton label="Move section down" disabled={!props.canMoveDown} onClick={props.onMoveDown}>
            <ArrowDown className="size-4" />
          </MoveButton>
        </div>
      </CardHeader>
      <CardContent className="p-0">{props.children}</CardContent>
    </Card>
  );
}

function MoveButton(props: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size="icon-sm"
            variant="ghost"
            disabled={props.disabled}
            onClick={props.onClick}
          />
        }
      >
        {props.children}
      </TooltipTrigger>
      <TooltipContent>{props.label}</TooltipContent>
    </Tooltip>
  );
}
