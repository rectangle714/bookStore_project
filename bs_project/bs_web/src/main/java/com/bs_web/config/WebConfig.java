package com.bs_web.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .exposedHeaders("Authorization")
                .exposedHeaders("RefreshToken")
                .allowCredentials(true)
                .allowedOrigins(
                        "http://localhost:3000",
                        "http://54.178.130.1:3000",
                        "http://localhost:3001",
                        "http://192.168.30.10:3001"
                )
                .allowedMethods("OPTIONS", "GET", "POST", "PUT", "DELETE");
    }

}
