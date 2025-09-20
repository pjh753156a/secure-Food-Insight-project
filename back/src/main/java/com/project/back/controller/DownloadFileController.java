package com.project.back.controller;

import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;

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
        // [SECURE] 1차 입력값 검증 : null, 공백, 과도한 길이
        if (file == null || file.isBlank() || file.length() > 255) 
        {
            return ResponseEntity.status(400).build();   // 내부 정보 없이 일반화된 메시지
        }
        // [SECURE] 2차 : URL 디코딩 여러 번 → Path Traversal 우회 패턴 차단
        String decoded = file;
        for (int i = 0; i < 3; i++) 
        {   // 최대 3회까지 퍼센트 디코딩
            try 
            {
                String tmp = java.net.URLDecoder.decode(decoded, StandardCharsets.UTF_8);
                if (tmp.equals(decoded)) break;
                decoded = tmp;
            } 
            catch (IllegalArgumentException e) 
            {
            break;
            }
        }
        String lowered = decoded.toLowerCase();
        // [SECURE] 3차 : 상대경로, 절대경로, 혼합슬래시 차단
        if (lowered.contains("../") || lowered.contains("..\\") ||
            lowered.contains("%2e%2e") || lowered.contains("..%2f") ||
            lowered.contains("%2f..") ||
            lowered.startsWith("/") || lowered.matches("^[a-z]:[\\\\/].*"))
        {
            return ResponseEntity.status(403).build();   // 접근 거부
        }
        // [SECURE] 4차기준 디렉터리 고정 + 절대경로/정규화 경로 결합 및 정규화 
        // → 기준 디렉터리 하위인지 확인
        Path baseDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path filePath = baseDir.resolve(decoded).normalize();
        if (!filePath.startsWith(baseDir)) 
        {
            return ResponseEntity.status(403).build();
        }
        // [SECURE] 5차 : 확장자 화이트리스트
        String name = filePath.getFileName().toString();
        int dot = name.lastIndexOf('.');
        String ext = (dot > 0 && dot < name.length() - 1) ? 
        name.substring(dot + 1).toLowerCase() : "";
        Set<String> allowExt = 
        Set.of("hwp", "pdf", "jpg", "jpeg", "png");
        if (!allowExt.contains(ext))
        {
            return ResponseEntity.status(403).build();
        }
        // 파일 리소스 객체 생성
        Resource resource = new UrlResource(filePath.toUri());
        // 파일이 존재하지 않거나 읽기 불가하면 404 반환
        if (!resource.exists() || !resource.isReadable()) 
        {
            return ResponseEntity.notFound().build();
        }
        // 파일명 UTF-8 인코딩 (브라우저 호환성 확보)
        String encodedFileName = URLEncoder
        .encode(resource.getFilename(), StandardCharsets.UTF_8)
        .replaceAll("\\+", "%20");
        // Content-Disposition 설정 (파일명 깨짐 방지용)
        String contentDisposition = "attachment; filename=\"" + encodedFileName + 
        "\"; filename*=UTF-8''" + encodedFileName;
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
            // [SECURE] 6차
            .header("X-Content-Type-Options", "nosniff")
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
