const addBtn = document.getElementById("add");
const notesContainer = document.getElementById("notesContainer");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const noteTitle = document.getElementById("noteTitle");
const noteText = document.getElementById("noteText");
const previewArea = document.getElementById("previewArea");
const wordCount = document.getElementById("wordCount");
const saveBtn = document.getElementById("saveNote");
const colorPicker = document.getElementById("colorPicker");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const themeToggle = document.getElementById("themeToggle");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importInput = document.getElementById("importInput");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editingIndex = null;

// Render Notes
function renderNotes() {
  notesContainer.innerHTML = "";
  let filtered = [...notes];

  // Search
  const query = searchInput.value.toLowerCase();
  if (query) {
    filtered = filtered.filter(
      n => n.title.toLowerCase().includes(query) || n.text.toLowerCase().includes(query)
    );
  }

  // Sort
  if (sortSelect.value === "newest") {
    filtered.sort((a, b) => b.date - a.date);
  } else if (sortSelect.value === "oldest") {
    filtered.sort((a, b) => a.date - b.date);
  } else if (sortSelect.value === "alpha") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  filtered.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note";
    div.style.background = note.color;
    div.innerHTML = `
      <div class="tools">
        <button onclick="editNote(${index})"><i class="fas fa-edit"></i></button>
        <button onclick="deleteNote(${index})"><i class="fas fa-trash"></i></button>
        <button onclick="pinNote(${index})"><i class="fas fa-thumbtack"></i></button>
      </div>
      <h3>${note.title}</h3>
      <p>${marked(note.text)}</p>
    `;
    notesContainer.appendChild(div);
  });
}

// Add Note
addBtn.onclick = () => {
  editingIndex = null;
  noteTitle.value = "";
  noteText.value = "";
  colorPicker.value = "#ffffff";
  previewArea.innerHTML = "";
  wordCount.textContent = "0 words";
  modal.classList.remove("hidden");
};

// Save Note
saveBtn.onclick = () => {
  const title = noteTitle.value || "Untitled";
  const text = noteText.value;
  const color = colorPicker.value;
  const noteObj = { title, text, color, date: Date.now(), pinned: false };

  if (editingIndex !== null) {
    notes[editingIndex] = noteObj;
  } else {
    notes.push(noteObj);
  }

  localStorage.setItem("notes", JSON.stringify(notes));
  modal.classList.add("hidden");
  renderNotes();
};

// Edit Note
window.editNote = (i) => {
  editingIndex = i;
  const note = notes[i];
  noteTitle.value = note.title;
  noteText.value = note.text;
  colorPicker.value = note.color;
  previewArea.innerHTML = marked(note.text);
  wordCount.textContent = `${note.text.split(/\s+/).filter(Boolean).length} words`;
  modal.classList.remove("hidden");
};

// Delete Note
window.deleteNote = (i) => {
  if (confirm("Delete this note?")) {
    notes.splice(i, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
  }
};

// Pin Note
window.pinNote = (i) => {
  notes[i].pinned = !notes[i].pinned;
  notes.sort((a, b) => b.pinned - a.pinned);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
};

// Close Modal
closeModal.onclick = () => modal.classList.add("hidden");

// Live Preview
noteText.addEventListener("input", () => {
  previewArea.innerHTML = marked(noteText.value);
  const wc = noteText.value.split(/\s+/).filter(Boolean).length;
  wordCount.textContent = `${wc} words`;
});

// Theme Toggle
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀ Light Mode" : "🌙 Dark Mode";
};

// Export Notes
exportBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(notes)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "notes.json";
  a.click();
};

// Import Notes
importBtn.onclick = () => importInput.click();
importInput.onchange = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      notes = JSON.parse(event.target.result);
      localStorage.setItem("notes", JSON.stringify(notes));
      renderNotes();
    } catch {
      alert("Invalid file");
    }
  };
  reader.readAsText(file);
};

// Initial Render
renderNotes();
