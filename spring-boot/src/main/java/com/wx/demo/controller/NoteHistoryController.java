package com.wx.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.wx.demo.entity.NoteHistory;
import com.wx.demo.repository.NoteHistoryRepository;

import java.util.List;

@RestController
@RequestMapping("/noteHistory")
public class NoteHistoryController {
    @Autowired
    private NoteHistoryRepository noteHistoryRepository;

    @GetMapping("/{noteId}")
    public List<NoteHistory> getNoteHistoryByNoteId(@PathVariable Integer noteId) {
        return noteHistoryRepository.findByNoteIdOrderByUpdatedAtDesc(noteId);
    }
}
