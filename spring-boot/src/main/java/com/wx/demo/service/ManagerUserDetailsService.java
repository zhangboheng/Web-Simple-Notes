package com.wx.demo.service;

import com.wx.demo.entity.ManagerUser;
import com.wx.demo.repository.ManagerUserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ManagerUserDetailsService implements UserDetailsService {

    private final ManagerUserRepository managerUserRepository;
    private final PasswordEncoder passwordEncoder;

    public ManagerUserDetailsService(ManagerUserRepository managerUserRepository, PasswordEncoder passwordEncoder) {
        this.managerUserRepository = managerUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        ManagerUser user = managerUserRepository.findByLoginNum(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return User.withUsername(user.getLoginNum())
                .password(user.getLoginPwd())
                .roles("USER")
                .build();
    }
}
