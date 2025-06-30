// modules/note.js

let idCounter = 0;

export class Note {
  constructor(title, content) {
    this.id = ++idCounter;
    this.title = title;
    this.content = content;
    this.createdAt = new Date();
  }

  get summary() {
    return `${this.title.slice(0, 10)}...`;
  }

  toHTML() {
    return `
      <div class="note" data-id="${this.id}">
        <div class="note-title">${this.title}</div>
        <div class="note-content">${this.content}</div>
        <small>${this.createdAt.toLocaleString()}</small>
      </div>
    `;
  }
}

export class PinnedNote extends Note {
  constructor(title, content) {
    super(title, content);
    this.pinned = true;
  }

  toHTML() {
    return `
      <div class="note pinned" data-id="${this.id}">
        <div class="note-title">📌 ${this.title}</div>
        <div class="note-content">${this.content}</div>
        <small>${this.createdAt.toLocaleString()} - pinned</small>
      </div>
    `;
  }
}
