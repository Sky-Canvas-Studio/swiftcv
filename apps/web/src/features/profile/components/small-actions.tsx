import { ArrowDown, ArrowUp, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function EntryMenu(props: {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <MoreVertical className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={props.onEdit}>
          <Pencil className="size-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!props.canMoveUp} onClick={props.onMoveUp}>
          <ArrowUp className="size-4" /> Move up
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!props.canMoveDown} onClick={props.onMoveDown}>
          <ArrowDown className="size-4" /> Move down
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={props.onDelete}>
          <Trash2 className="size-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
