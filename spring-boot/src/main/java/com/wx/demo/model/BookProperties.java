package com.wx.demo.model;

import lombok.*;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "book")
@Getter
@Setter
public class BookProperties {
    private String name;
    private String author;
    private int price;
}
