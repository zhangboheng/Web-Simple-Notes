package com.wx.demo.repository;

import com.wx.demo.entity.ManagerUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ManagerUserRepository extends JpaRepository<ManagerUser, Long> {
    ManagerUser findByLoginNum(String loginNum);
    boolean existsByLoginNum(String loginNum);
}
