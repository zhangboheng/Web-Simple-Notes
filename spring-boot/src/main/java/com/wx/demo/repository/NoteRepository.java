package com.wx.demo.repository;

import com.wx.demo.entity.Note;
import com.wx.demo.entity.ManagerUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Integer> {
    List<Note> findByUserOrderByUpdatedAtDesc(ManagerUser user);    
    List<Note> findByUserIdOrderByUpdatedAtDesc(Long userId);
    List<Note> findByUserIdAndTitleContainingOrUserIdAndContentContainingOrderByUpdatedAtDesc(Long userId1, String titleKeyword, Long userId2, String contentKeyword);
}
