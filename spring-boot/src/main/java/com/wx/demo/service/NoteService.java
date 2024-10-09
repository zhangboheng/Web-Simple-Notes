package com.wx.demo.service;

import com.wx.demo.entity.Note;
import com.wx.demo.entity.NoteHistory;
import com.wx.demo.entity.ManagerUser;
import com.wx.demo.repository.NoteRepository;
import com.wx.demo.repository.ManagerUserRepository;
import com.wx.demo.repository.NoteHistoryRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final NoteHistoryRepository noteHistoryRepository;
    private final ManagerUserRepository managerUserRepository;

    public NoteService(NoteRepository noteRepository, ManagerUserRepository managerUserRepository, NoteHistoryRepository noteHistoryRepository) {
        this.noteRepository = noteRepository;
        this.managerUserRepository = managerUserRepository;
        this.noteHistoryRepository = noteHistoryRepository;
    }

    // Create a new note
    public Note createNote(Long userId, String title, String content) {
        Optional<ManagerUser> optionalUser = managerUserRepository.findById(userId);
        if (optionalUser.isPresent()) {
            Note note = new Note();
            note.setUser(optionalUser.get());
            note.setTitle(title);
            note.setContent(content);
            return noteRepository.save(note);
        } else {
            throw new IllegalArgumentException("User not found");
        }
    }

    // Get all notes for a specific user
    public List<Note> getNotesByUserId(Long userId) {
        return noteRepository.findByUserId(userId);
    }
    // Get specific note by id
    public Optional<Note> getNoteById(Integer noteId) {
        return noteRepository.findById(noteId);
    }
    // Update a note
    public Note updateNote(Integer noteId, String title, String content) {
        Optional<Note> optionalNote = noteRepository.findById(noteId);
        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();
            note.setTitle(title);
            note.setContent(content);
            NoteHistory noteHistory = new NoteHistory();
            noteHistory.setNoteId(noteId);
            noteHistory.setTitle(title);
            noteHistory.setContent(note.getContent());
            noteHistoryRepository.save(noteHistory);
            List<NoteHistory> histories = noteHistoryRepository.findByNoteIdOrderByUpdatedAtDesc(noteId);
            if (histories.size() > 10) {
                List<NoteHistory> toDelete = histories.subList(10, histories.size());
                noteHistoryRepository.deleteAll(toDelete);
            }
            return noteRepository.save(note);
        } else {
            throw new IllegalArgumentException("No note found");
        }
    }
    // Delete a note
    public void deleteNote(Integer noteId) {
        noteRepository.deleteById(noteId);
    }

    public List<Note> searchNotesByKeyword(String keyword) {
        return noteRepository.findByTitleContainingOrContentContaining(keyword, keyword);
    }
}

