package com.wx.demo.controller;

import com.wx.demo.entity.ManagerUser;
import com.wx.demo.service.ManagerUserService;
import com.wx.demo.util.JwtUtil;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class LoginController {

    @Autowired
    private ManagerUserService managerUserService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestParam String loginNum, @RequestParam String loginPwd) {
        boolean success = managerUserService.login(loginNum, loginPwd);
        ManagerUser user = managerUserService.findByLoginNumAndPwd(loginNum, loginPwd);
        Map<String, Object> response = new HashMap<>();
        if (success) {
            String token = jwtUtil.generateToken(loginNum);
            response.put("message", true);
            response.put("token", token);
            response.put("userInfo", Map.of(
                "id", user.getId(),
                "loginName", user.getLoginName(),
                "loginNum", user.getLoginNum(),
                "remarks", user.getRemarks()
            ));
            response.put("showTips", "Login Success");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", false);
            response.put("showTips", "Login Failed");
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestParam String loginName, @RequestParam String loginNum,
            @RequestParam String loginPwd, @RequestParam(required = false) String remarks) {
        
        Map<String, Object> response = new HashMap<>();
        ManagerUser user = new ManagerUser();
        user.setLoginName(loginName);
        user.setLoginNum(loginNum);
        user.setLoginPwd(loginPwd);
        user.setRemarks(remarks);
        boolean success = managerUserService.register(user);
        managerUserService.register(user);
        if (success) {
            response.put("message", true);
            response.put("showTips", "Register Success");
            return ResponseEntity.ok(response);
        }else{
            response.put("message", false);
            response.put("showTips", "Register Failed, LoginNum already exists");
            return ResponseEntity.ok(response);
        }
    }
}
