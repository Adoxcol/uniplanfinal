
"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface NotesPanelProps {
  notes: string[];
  newNote: string;
  onNoteChange: (value: string) => void;
  onNoteAdd: () => void;
  onNoteDelete: (index: number) => void;
}

export function NotesPanel({ notes, newNote, onNoteChange, onNoteAdd, onNoteDelete }: NotesPanelProps) {
  return (
    <div className="h-full border-l">
      <div className="p-4 border-b">
        <h3 className="font-semibold mb-1">Notes & Resources</h3>
        <p className="text-sm text-muted-foreground">Write and organize your notes</p>
      </div>
      <ScrollArea className="h-[calc(100%-5rem)] p-4">
        <Textarea
          placeholder="Type your note and press Enter..."
          value={newNote}
          onChange={(e) => onNoteChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newNote.trim()) {
              e.preventDefault();
              onNoteAdd();
            }
          }}
          className="min-h-[100px] resize-none"
        />
        <div className="mt-6 space-y-4">
          {notes.map((note, index) => (
            <Card key={index} className="p-4 relative">
              <p className="text-sm">{note}</p>
              <button
                onClick={() => onNoteDelete(index)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
              >
                ×
              </button>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}