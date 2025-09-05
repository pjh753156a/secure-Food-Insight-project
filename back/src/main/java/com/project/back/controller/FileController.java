package com.project.back.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping("/board")
public class FileController 
{

    private static final String INQUIRY_FILE_DIR = "C:/board/inquiry/uploads";
    private static final String NOTICE_FILE_DIR = "C:/board/notice/uploads";

    @GetMapping("/inquiry/uploads")
    public String InquirylistFiles(Model model) 
    {
        File dir = new File(INQUIRY_FILE_DIR);
        File[] files = dir.listFiles();

        List<String> fileList = (files != null)
            ? Arrays.stream(files).map(File::getName).toList()
            : List.of();

        model.addAttribute("files", fileList);
        return "inquiry-uploads";
    }

    @GetMapping("/notice/uploads")
    public String NoticelistFiles(Model model) 
    {
        File dir = new File(NOTICE_FILE_DIR);
        File[] files = dir.listFiles();

        List<String> fileList = (files != null)
            ? Arrays.stream(files).map(File::getName).toList()
            : List.of();

        model.addAttribute("files", fileList);
        return "notice-uploads";
    }

    /* @GetMapping("/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) throws MalformedURLException 
    {
        Path filePath = Paths.get(FILE_DIR).resolve(filename);
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists()) 
        {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    } */
}