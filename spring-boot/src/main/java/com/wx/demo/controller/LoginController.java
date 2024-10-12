package com.wx.demo.controller;

import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.wx.demo.entity.ManagerUser;
import com.wx.demo.service.ManagerUserService;
import com.wx.demo.util.JwtUtil;

import jakarta.servlet.http.HttpSession;

import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Base64;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;

@RestController
public class LoginController {
    @Autowired
    private DefaultKaptcha captchaProducer;

    @Autowired
    private ManagerUserService managerUserService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestParam String loginNum, @RequestParam String loginPwd,
            @RequestParam String captcha, HttpSession session) {
        String storedCaptcha = (String) session.getAttribute("captcha");
        Map<String, Object> response = new HashMap<>();

        if (storedCaptcha == null) {
            response.put("message", false);
            response.put("showTips", "Captcha expired");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        if (!storedCaptcha.equalsIgnoreCase(captcha)) {
            response.put("message", false);
            response.put("showTips", "Captcha incorrect");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        ManagerUser user = managerUserService.findByLoginNumAndPwd(loginNum, loginPwd);

        if (user != null) {
            String token = jwtUtil.generateToken(loginNum);
            response.put("message", true);
            response.put("token", token);
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("loginName", user.getLoginName());
            userInfo.put("loginNum", user.getLoginNum());
            userInfo.put("remarks", user.getRemarks());

            response.put("userInfo", userInfo);
            response.put("showTips", "Login Success");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", false);
            response.put("showTips", "Account or Password Error");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestParam String loginName, @RequestParam String loginNum,
            @RequestParam String loginPwd, @RequestParam String captcha, HttpSession session,
            @RequestParam(required = false) String remarks) {
        String storedCaptcha = (String) session.getAttribute("captcha");

        Map<String, Object> response = new HashMap<>();
        if (storedCaptcha == null) {
            response.put("message", false);
            response.put("showTips", "Captcha expired");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        if (!storedCaptcha.equalsIgnoreCase(captcha)) {
            response.put("message", false);
            response.put("showTips", "Captcha incorrect");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
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
        } else {
            response.put("message", false);
            response.put("showTips", "Register Failed, LoginNum already exists");
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/captchaImage")
    public ResponseEntity<Map<String, Object>> getCaptchaImage(HttpSession session) {
        String captchaCode = captchaProducer.createText();
        session.setAttribute("captcha", captchaCode);

        try {
            BufferedImage image = captchaProducer.createImage(captchaCode);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "jpg", baos);
            String base64Image = Base64.getEncoder().encodeToString(baos.toByteArray());

            Map<String, Object> response = new HashMap<>();
            response.put("captchaImage", base64Image);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
