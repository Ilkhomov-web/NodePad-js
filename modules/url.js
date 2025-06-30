

export function encodeNoteToURL(noteContent) {
    const encoded = encodeURIComponent(noteContent);
    const url = new URL(window.location.href);
    url.searchParams.set("note", encoded);
    return url.toString();
  }

  export function decodeNoteFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const encoded = urlParams.get("note");
  
    if (encoded) {
      try {
        return decodeURIComponent(encoded);
      } catch (err) {
        console.error("URL decode error:", err);
      }
    }
  
    return null;
  }
  