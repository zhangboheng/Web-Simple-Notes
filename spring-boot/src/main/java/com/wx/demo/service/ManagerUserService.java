package com.wx.demo.service;

import com.wx.demo.entity.ManagerUser;
import com.wx.demo.repository.ManagerUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class ManagerUserService {

    @Autowired
    private ManagerUserRepository managerUserRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public boolean login(String loginNum, String loginPwd) {
        ManagerUser user = managerUserRepository.findByLoginNum(loginNum);
        if (user != null) {
            return passwordEncoder.matches(loginPwd, user.getLoginPwd());
        }
        return false;
    }

    public boolean register(ManagerUser user) {
        if (managerUserRepository.existsByLoginNum(user.getLoginNum())) {
            return false;
        }
        user.setLoginPwd(passwordEncoder.encode(user.getLoginPwd()));
        managerUserRepository.save(user);
        return true;
    }
    
    public ManagerUser findByLoginNumAndPwd(String loginNum, String loginPwd) {
        ManagerUser user = managerUserRepository.findByLoginNum(loginNum);
        if (user != null && passwordEncoder.matches(loginPwd, user.getLoginPwd())) {
            return user;
        }
        return null;
    }
}
