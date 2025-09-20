package com.project.back.controller;

import java.util.Arrays;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.project.back.dto.response.ResponseDto;
import com.project.back.service.InquiryBoardService;
import com.project.back.dto.request.board.inquiryboard.PostCommentRequestDto;
import com.project.back.dto.request.board.inquiryboard.PostInquiryBoardRequestDto;
import com.project.back.dto.request.board.inquiryboard.PatchInquiryBoardRequestDto;
import com.project.back.dto.response.board.inquiryboard.GetInquiryBoardResponseDto;
import com.project.back.dto.response.board.inquiryboard.GetInquiryBoardListResponseDto;
import com.project.back.dto.response.board.inquiryboard.GetSearchInquiryBoardListResponseDto;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/inquiry-board")
public class InquiryBoardController 
{
    private final InquiryBoardService inquiryBoardService;

    @PostMapping("/")
    public ResponseEntity<ResponseDto> postInquiryBoard(
        @RequestBody @Valid PostInquiryBoardRequestDto requestBody,
        @AuthenticationPrincipal String userEmailId,
        HttpServletRequest request
    ) 
    {
        String csrfHeader = request.getHeader("X-CSRF-TOKEN");
        String csrfCookie = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
            .filter(c -> "csrfToken".equals(c.getName()))
            .map(Cookie::getValue)
            .findFirst()
            .orElse(null);

        if (csrfHeader == null || csrfCookie == null || !csrfCookie.equals(csrfHeader)) 
        {
            return ResponseDto.authenticationFailed();
        }
        
        ResponseEntity<ResponseDto> response = inquiryBoardService.postBoard(requestBody, userEmailId);
        return response;
    }
    /* 3차 프로젝트 분석완료 */

    @PostMapping("/{inquiryNumber}/comment")
    public ResponseEntity<ResponseDto> postComment(
        @RequestBody @Valid PostCommentRequestDto requestBody,
        @PathVariable("inquiryNumber") int inquiryNumber
    ) 
    {
        ResponseEntity<ResponseDto> response = inquiryBoardService.postComment(requestBody, inquiryNumber);
        return response;
    }
    
    @GetMapping("/list")
    public ResponseEntity<? super GetInquiryBoardListResponseDto> getInquiryBoardList() 
    {
        ResponseEntity<? super GetInquiryBoardListResponseDto> response = inquiryBoardService.getInquiryBoardList();
        return response;
    }

    @GetMapping("/list/search")
    public ResponseEntity<? super GetSearchInquiryBoardListResponseDto> getSearchInquiryBoardList(
        @RequestParam("searchWord") String searchWord
    ) {
        ResponseEntity<? super GetSearchInquiryBoardListResponseDto> response = inquiryBoardService.getSearchInquiryBoardList(searchWord);
        return response;
    }
    
    /* 3차 프로젝트 분석시작 */
    @GetMapping("/{inquiryNumber}")
    public ResponseEntity<? super GetInquiryBoardResponseDto> getInquiryBoard(
        @PathVariable("inquiryNumber") int inquiryNumber,
        @AuthenticationPrincipal String userEmailId
    ) 
    {
        ResponseEntity<? super GetInquiryBoardResponseDto> response = inquiryBoardService.getInquiryBoard(inquiryNumber, userEmailId);
        return response;
    }
    
    @PatchMapping("/update/{inquiryNumber}")
    public ResponseEntity<ResponseDto> patchInquiryBoard(
        @RequestBody @Valid PatchInquiryBoardRequestDto requestBody,
        @PathVariable("inquiryNumber") int inquiryNumber,
        @AuthenticationPrincipal String userEmailId
    ) 
    {
        ResponseEntity<ResponseDto> response = inquiryBoardService.patchInquiryBoard(requestBody, inquiryNumber, userEmailId);
        return response;
    }

    @DeleteMapping("/{inquiryNumber}")
    public ResponseEntity<ResponseDto> deleteInquiryBoard(
        @PathVariable("inquiryNumber") int inquiryNumber,
        @AuthenticationPrincipal String userEmailId
    ) {
        ResponseEntity<ResponseDto> response = inquiryBoardService.deleteInquiryBoard(inquiryNumber, userEmailId);
        return response;
    }
}
/* 3차 프로젝트 분석완료 */