package com.wx.demo.entity;

import lombok.Data;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;

@Data
@Entity
@Table(name = "manageruser")
public class ManagerUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "loginame", nullable = false, length = 50)
    private String loginName;

    @Column(name = "loginnum", nullable = false, unique = true, length = 50)
    private String loginNum;

    @Column(name = "loginpwd", nullable = false)
    private String loginPwd;

    @Column(name = "remarks")
    private String remarks;

    @JsonManagedReference
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Note> notes;
}
