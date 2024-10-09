package com.wx.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.wx.demo.entity.NoteHistory;
import java.util.List;

public interface NoteHistoryRepository extends JpaRepository<NoteHistory, Integer> {
    List<NoteHistory> findByNoteIdOrderByUpdatedAtDesc(Integer noteId);
}
