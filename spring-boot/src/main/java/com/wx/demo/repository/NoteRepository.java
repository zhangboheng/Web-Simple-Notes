package com.wx.demo.repository;

import com.wx.demo.entity.Note;
import com.wx.demo.entity.ManagerUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Integer> {
    List<Note> findByUser(ManagerUser user);    
    List<Note> findByUserId(Long userId);
    List<Note> findByTitleContainingOrContentContaining(String titleKeyword, String contentKeyword);
}
