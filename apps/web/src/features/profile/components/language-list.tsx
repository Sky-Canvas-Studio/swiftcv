import type { LanguageSkill } from "../lib/types";
import { EntryMenu } from "./small-actions";

export function LanguageList(props: {
  languages: LanguageSkill[];
  onEdit: (item: LanguageSkill) => void;
  onDelete: (id: string) => void;
  onMove: (from: number, to: number) => void;
}) {
  if (props.languages.length === 0) {
    return <p className="p-5 text-sm text-muted-foreground">Add languages and CEFR levels.</p>;
  }

  return (
    <div className="divide-y">
      {props.languages.map((language, index) => (
        <article key={language.id} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto]">
          <div>
            <h3 className="text-sm font-semibold text-primary">{language.language || "Untitled language"}</h3>
            <p className="text-sm text-muted-foreground">
              {[language.level, language.listening && `Listening ${language.listening}`, language.reading && `Reading ${language.reading}`, language.writing && `Writing ${language.writing}`].filter(Boolean).join(", ")}
            </p>
          </div>
          <EntryMenu
            canMoveUp={index > 0}
            canMoveDown={index < props.languages.length - 1}
            onEdit={() => props.onEdit(language)}
            onDelete={() => props.onDelete(language.id)}
            onMoveUp={() => props.onMove(index, index - 1)}
            onMoveDown={() => props.onMove(index, index + 1)}
          />
        </article>
      ))}
    </div>
  );
}
