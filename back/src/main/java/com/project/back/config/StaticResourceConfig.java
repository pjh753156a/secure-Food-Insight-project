package com.project.back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer 
{
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) 
    {
        registry.addResourceHandler("/inquiry-uploads/**", "/notice-uploads/**") // 요청 경로
                .addResourceLocations("file:///C:/board/inquiry/uploads/", "file:///C:/board/notice/uploads/"); // 실제 디렉토리
    }
}

/*  "/inquiry-uploads.html", */