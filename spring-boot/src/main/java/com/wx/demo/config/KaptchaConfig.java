package com.wx.demo.config;

import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.google.code.kaptcha.util.Config;
import org.springframework.context.annotation.*;

import java.util.Properties;

@Configuration
public class KaptchaConfig {
    @Bean
    public DefaultKaptcha producer() {
        Properties properties = new Properties();

        properties.put("kaptcha.border", "no");
        properties.put("kaptcha.textproducer.font.color", "black");
        properties.put("kaptcha.textproducer.char.space", "5");
        properties.put("kaptcha.image.width", "160");
        properties.put("kaptcha.image.height", "60");
        properties.put("kaptcha.textproducer.font.size", "40");

        properties.put("kaptcha.obscurificator.impl", "com.google.code.kaptcha.impl.WaterRipple");

        properties.put("kaptcha.noise.impl", "com.google.code.kaptcha.impl.DefaultNoise");

        properties.put("kaptcha.textproducer.font.names", "Arial,Courier");

        Config config = new Config(properties);
        DefaultKaptcha defaultKaptcha = new DefaultKaptcha();
        defaultKaptcha.setConfig(config);
        return defaultKaptcha;
    }
}
