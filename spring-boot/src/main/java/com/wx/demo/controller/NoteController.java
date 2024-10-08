package com.wx.demo.controller;

import com.wx.demo.entity.Note;
import com.wx.demo.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    // Create a new note
    @PostMapping
    public Note createNote(@RequestParam Long userId,
            @RequestParam String title,
            @RequestParam String content) {
        return noteService.createNote(userId, title, content);
    }

    // Get all notes for a user
    @GetMapping("/user/{userId}")
    public List<Note> getNotesByUserId(@PathVariable Long userId) {
        return noteService.getNotesByUserId(userId);
    }

    // Get a note by ID
    @GetMapping("/{noteId}")
    public Note getNoteById(@PathVariable Integer noteId) {
        return noteService.getNoteById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));
    }

    // Update a note
    @PutMapping("/{noteId}")
    public Note updateNote(@PathVariable Integer noteId,
            @RequestParam String title,
            @RequestParam String content) {
        return noteService.updateNote(noteId, title, content);
    }

    // Delete a note
    @DeleteMapping("/{noteId}")
    public void deleteNote(@PathVariable Integer noteId) {
        noteService.deleteNote(noteId);
    }

    // Search notes by title or content
    @GetMapping("/search")
    public List<Note> searchNotes(@RequestParam String keyword) {
        return noteService.searchNotesByKeyword(keyword);
    }
}
