import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore/lite";
import { FirebaseDB } from "../firebase/config";
import { loadNotes } from "../helpers/loadNotes";
import { fileUpload } from "../helpers/fileUpload";
import { useAuthStore } from "./auth";

export const useJournalStore = defineStore("journal", () => {
  const isSaving = ref(false);
  const messageSaved = ref("");
  const notes = ref([]);
  const active = ref(null);

  const hasNoteSelected = computed(() => !!active.value);

  // Actions
  const startNewNote = async () => {
    isSaving.value = true;
    const { user } = useAuthStore();

    const newNote = {
      title: "",
      body: "",
      date: new Date().getTime(),
    };

    const newDoc = doc(collection(FirebaseDB, `${user.uid}/journal/notes`));
    await setDoc(newDoc, newNote);

    newNote.id = newDoc.id;
    notes.value.push(newNote);
    active.value = newNote;
    isSaving.value = false;
  };

  const startLoadingNotes = async () => {
    const { user } = useAuthStore();
    notes.value = (await loadNotes(user.uid)).sort((a, b) => b.date - a.date);
  };

  const setActiveNote = (note) => {
    active.value = note;
    messageSaved.value = "";
  };

  const startSavingNote = async () => {
    isSaving.value = true;
    const { user } = useAuthStore();

    const noteToSave = { ...active.value };
    delete noteToSave.id;

    console.log(active.value);
    console.log("asd");
    console.log(noteToSave);

    const noteRef = doc(
      FirebaseDB,
      `${user.uid}/journal/notes/${active.value.id}`
    );
    await setDoc(noteRef, noteToSave, { merge: true });

    // Update notes array
    startLoadingNotes();

    messageSaved.value = `${active.value.title} se ha guardado correctamente`;
    isSaving.value = false;
  };

  const startUploadingFiles = async (files) => {
    try {
      isSaving.value = true;
      console.log(files);
      const uploadPromises = Array.from(files).map((file) => fileUpload(file));
      const imageUrls = await Promise.all(uploadPromises);

      active.value.imageUrls = [
        ...(active.value.imageUrls || []),
        ...imageUrls,
      ];
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      isSaving.value = false;
    }
  };

  const startDeletingNote = async () => {
    isSaving.value = true;
    const { user } = useAuthStore();
    const noteId = active.value.id;

    try {
      await deleteDoc(doc(FirebaseDB, `${user.uid}/journal/notes/${noteId}`));
    } catch (error) {
      console.error("Error deleting note:", error);
      isSaving.value = false;
      return;
    }
    notes.value = notes.value.filter((n) => n.id !== noteId);
    active.value = null;
    isSaving.value = false;
    messageSaved.value = "Nota eliminada correctamente";
  };

  const deleteImg = (img) => {
    console.log(img);
    if (active.value.imageUrls.length === 1) {
      active.value.imageUrls = [];
    } else {
      active.value.imageUrls = active.value.imageUrls.filter(
        (image) => image !== img
      );
    }
  };

  const clearNotesLogout = () => {
    isSaving.value = false;
    messageSaved.value = "";
    notes.value = [];
    active.value = null;
  };

  return {
    // State
    isSaving,
    messageSaved,
    notes,
    active,
    hasNoteSelected,
    startNewNote,
    startLoadingNotes,
    setActiveNote,
    startSavingNote,
    startUploadingFiles,
    startDeletingNote,
    clearNotesLogout,
    deleteImg,
  };
});
