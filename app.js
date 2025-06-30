// app.js

import { Note, PinnedNote } from "./modules/note.js";
import { memoize, debounce, generateId } from "./modules/utils.js";
import {
    saveNotes,
    loadNotes,
    setLastNoteId,
    getLastNoteId,
  } from "./modules/storage.js";
  import { encodeNoteToURL, decodeNoteFromURL } from "./modules/url.js";

const form = document.getElementById("noteForm");
const titleInput = document.getElementById("noteTitle");
const contentInput = document.getElementById("noteContent");
const notesList = document.getElementById("notesList");
const searchInput = document.getElementById("searchInput");

const notes = loadNotes(Note, PinnedNote);

form.addEventListener("submit", function (e) {
    e.preventDefault();
  
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
  
    if (title && content) {
      const newNote = title.toLowerCase().includes("important")
        ? new PinnedNote(title, content)
        : new Note(title, content);
  
      notes.set(newNote.id, newNote);
  
      saveNotes(notes); 
      setLastNoteId(newNote.id); 
  
      renderNotes();
      form.reset();
    }
  });

  const searchNotes = memoize((term) => {
    const filtered = Array.from(notes.values()).filter((note) =>
      note.title.toLowerCase().includes(term.toLowerCase())
    );
    return filtered;
  });

  searchInput.addEventListener(
    "input",
    debounce(() => {
      const term = searchInput.value;
      const results = searchNotes(term);
  
      notesList.innerHTML = "";
      results.forEach((note) => {
        notesList.innerHTML += note.toHTML();
      });
    }, 300)
  );

searchInput.addEventListener("input", function () {
  const term = searchInput.value.toLowerCase();
  renderNotes(term);
});

function renderNotes(filter = "") {
  notesList.innerHTML = "";

  for (let note of notes.values()) {
    if (
      note.title.toLowerCase().includes(filter) ||
      note.content.toLowerCase().includes(filter)
    ) {
      notesList.innerHTML += note.toHTML();
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
    const fromURL = decodeNoteFromURL();
    if (fromURL) {
      contentInput.value = fromURL;
      alert("URL orqali note yuklandi!");
    }
  
    const lastId = getLastNoteId();
    if (lastId && notes.has(lastId)) {
      const lastNote = notes.get(lastId);
      console.log(`Oxirgi note: "${lastNote.title}"`);
    }
  
    renderNotes();
  });

  const shareBtn = document.createElement("button");
shareBtn.textContent = "🔗 Share via URL";
shareBtn.addEventListener("click", () => {
  const text = contentInput.value.trim();
  if (text) {
    const shareURL = encodeNoteToURL(text);
    navigator.clipboard.writeText(shareURL);
    alert("URL nusxalandi: " + shareURL);
  }
});
form.appendChild(shareBtn);


const bindBtn = document.getElementById("bindBtn");


const noteManager = {
  selectedNoteId: null,
  setSelected(id) {
    this.selectedNoteId = id;
    console.log("✅ Tanlangan note ID:", this.selectedNoteId);
  },
};


function selectNoteCall(noteId) {
  noteManager.setSelected.call(noteManager, noteId);
}


function selectNoteApply(noteId) {
  noteManager.setSelected.apply(noteManager, [noteId]);
}


const boundSelect = noteManager.setSelected.bind(noteManager);

bindBtn.addEventListener("click", () => {
  const lastNote = Array.from(notes.values()).pop();
  if (lastNote) {
    const noteId = lastNote.id;

    console.log("🔹 .call bilan:");
    selectNoteCall(noteId);

    console.log("🔹 .apply bilan:");
    selectNoteApply(noteId);

    console.log("🔹 .bind bilan:");
    boundSelect(noteId);
  } else {
    alert("Hech qanday note mavjud emas!");
  }
});
