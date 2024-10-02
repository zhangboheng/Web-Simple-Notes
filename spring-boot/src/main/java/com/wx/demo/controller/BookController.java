package com.wx.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wx.demo.model.BookProperties;

@RestController
public class BookController {

    private final BookProperties bookProperties;

    @Autowired
    public BookController(BookProperties bookProperties) {
        this.bookProperties = bookProperties;
    }

    @GetMapping("/book")
    public BookProperties getBookInfo() {
        BookProperties book = new BookProperties();
        book.setName(bookProperties.getName());
        book.setAuthor(bookProperties.getAuthor());
        book.setPrice(19);
        return book;
    }
}