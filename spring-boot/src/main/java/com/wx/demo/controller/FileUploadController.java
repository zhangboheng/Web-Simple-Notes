package com.wx.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.wx.demo.exception.CustomException;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/files")
public class FileUploadController {

    private final String UPLOAD_DIR = "/Users/bohengzhang/Downloads/pdf"; // Upload directory

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            // return new ResponseEntity<>("The file is empty", HttpStatus.BAD_REQUEST);
            throw new CustomException(400, "The file is empty");
        }

        try {
            // Create the upload directory if it doesn't exist
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdir();
            }

            // Save the file to the upload directory
            File destFile = new File(uploadDir, file.getOriginalFilename());
            file.transferTo(destFile);

            return new ResponseEntity<>("The file is uploaded successfully: " + destFile.getAbsolutePath(), HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>("The file is uploaded failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
