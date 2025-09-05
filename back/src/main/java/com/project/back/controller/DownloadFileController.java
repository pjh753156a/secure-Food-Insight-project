package com.project.back.controller;

import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/download")
public class DownloadFileController 
{
    @GetMapping("/board/notice")
    @ResponseBody
    public ResponseEntity<Resource> downloadNoticeFile(@RequestParam String file) throws MalformedURLException
    {
        // 저장 디렉터리 경로
        String uploadDir = "C:/board/notice/uploads";

        // 요청된 파일명을 기준으로 경로 조합
        Path filePath = Paths.get(uploadDir).resolve(file).normalize();

        // 파일 리소스 객체 생성
        Resource resource = new UrlResource(filePath.toUri());

        // 파일이 존재하지 않거나 읽기 불가하면 404 반환
        if (!resource.exists() || !resource.isReadable()) 
        {
            return ResponseEntity.notFound().build();
        }

        // 파일명 UTF-8 인코딩 (브라우저 호환성 확보)
        String encodedFileName = URLEncoder.encode(resource.getFilename(), StandardCharsets.UTF_8).replaceAll("\\+", "%20");

        // Content-Disposition 설정 (파일명 깨짐 방지용)
        String contentDisposition = "attachment; filename=\"" + encodedFileName + "\"; filename*=UTF-8''" + encodedFileName;

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
            .body(resource);
    }

    @GetMapping("/board/inquiry")
    @ResponseBody
    public ResponseEntity<Resource> downloadInquiryFile(@RequestParam String file) throws MalformedURLException
    {
        // 저장 디렉터리 경로
        String uploadDir = "C:/board/inquiry/uploads";

        // 요청된 파일명을 기준으로 경로 조합
        Path filePath = Paths.get(uploadDir).resolve(file).normalize();

        // 파일 리소스 객체 생성
        Resource resource = new UrlResource(filePath.toUri());

        // 파일이 존재하지 않거나 읽기 불가하면 404 반환
        if (!resource.exists() || !resource.isReadable()) 
        {
            return ResponseEntity.notFound().build();
        }

        // 파일명 UTF-8 인코딩 (브라우저 호환성 확보)
        String encodedFileName = URLEncoder.encode(resource.getFilename(), StandardCharsets.UTF_8).replaceAll("\\+", "%20");

        // Content-Disposition 설정 (파일명 깨짐 방지용)
        String contentDisposition = "attachment; filename=\"" + encodedFileName + "\"; filename*=UTF-8''" + encodedFileName;

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
            .body(resource);
    }
}
