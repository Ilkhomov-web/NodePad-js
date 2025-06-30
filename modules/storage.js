

const NOTES_KEY = "my_notes";

export function saveNotes(map) {
  const obj = Object.fromEntries(map);
  localStorage.setItem(NOTES_KEY, JSON.stringify(obj));
}


export function loadNotes(NoteClass, PinnedNoteClass) {
  const raw = localStorage.getItem(NOTES_KEY);
  if (!raw) return new Map();

  const parsed = JSON.parse(raw);
  const result = new Map();

  for (let [id, val] of Object.entries(parsed)) {
    const { title, content, pinned } = val;
    const note = pinned
      ? new PinnedNoteClass(title, content)
      : new NoteClass(title, content);
    note.id = parseInt(id); 
    result.set(note.id, note);
  }

  return result;
}

export function setLastNoteId(id) {
  document.cookie = `lastNoteId=${id}; path=/`;
}


export function getLastNoteId() {
  const matches = document.cookie.match(/lastNoteId=(\d+)/);
  return matches ? parseInt(matches[1]) : null;
}
