package com.project.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.project.back.dto.response.ResponseDto;
import com.project.back.service.NoticeBoardService;
import com.project.back.dto.request.board.noticeboard.PostNoticeBoardRequestDto;
import com.project.back.dto.request.board.noticeboard.PatchNoticeBoardRequestDto;
import com.project.back.dto.response.board.noticeboard.GetNoticeBoardResponseDto;
import com.project.back.dto.response.board.noticeboard.GetNoticeBoardListResponseDto;
import com.project.back.dto.response.board.noticeboard.GetSearchNoticeBoardResponseDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notice-board")
public class NoticeBoardController 
{
    private final NoticeBoardService noticeBoardService;

    @PostMapping("/")
    public ResponseEntity<ResponseDto> postNoticeBoard(
        @RequestBody @Valid PostNoticeBoardRequestDto requestBody,
        @AuthenticationPrincipal String userEmailId
    ) 
    {
        ResponseEntity<ResponseDto> response = noticeBoardService.postBoard(requestBody, userEmailId);
        return response;
    }
    /* 3차 프로젝트 분석완료 */

    @GetMapping("/list")
    public ResponseEntity<? super GetNoticeBoardListResponseDto> getNoticeBoardList() 
    {
        ResponseEntity<? super GetNoticeBoardListResponseDto> response = noticeBoardService.getNoticeBoardList();
        return response;
    }

    @GetMapping("/list/search")
    public ResponseEntity<? super GetSearchNoticeBoardResponseDto> getSearchNoticeBoardList(
        @RequestParam("searchWord") String searchWord
    ) 
    {
        ResponseEntity<? super GetSearchNoticeBoardResponseDto> response = noticeBoardService.getSearchNoticeBoardList(searchWord);
        return response;
    }

    @GetMapping("{noticeNumber}")
    public ResponseEntity<? super GetNoticeBoardResponseDto> getNoticeBoard(
    @PathVariable("noticeNumber") int noticeNumber
    ) 
    {
        ResponseEntity<? super GetNoticeBoardResponseDto> response = noticeBoardService.getNoticeBoard(noticeNumber);
        return response;
    }

    /* 3차 프로젝트 분석시작 */
    @PatchMapping("/update/{noticeNumber}")
    public ResponseEntity<ResponseDto> patchNoticeBoard(
    @RequestBody @Valid PatchNoticeBoardRequestDto requestBody,
    @PathVariable("noticeNumber") int noticeNumber,
    @AuthenticationPrincipal String userEmailId
    ) 
    {
        ResponseEntity<ResponseDto> response = noticeBoardService.patchNoticeBoard(requestBody, noticeNumber, userEmailId);
        return response;
    }
    /* 3차 프로젝트 분석완료 */
    
    @PatchMapping("/{noticeNumber}/increase-view-count")
    public ResponseEntity<ResponseDto> increaseViewCount(
    @PathVariable("noticeNumber") int noticeNumber
    ) 
    {
        ResponseEntity<ResponseDto> response = noticeBoardService.increaseViewCount(noticeNumber);
        return response;
    }

    /* 3차 프로젝트 분석시작 */
    @DeleteMapping("/{noticeNumber}")
    public ResponseEntity<ResponseDto> deleteNoticeBoard(
        @PathVariable("noticeNumber") int noticeNumber,
        @AuthenticationPrincipal String userEmailId
    ) 
    {
        ResponseEntity<ResponseDto> response = noticeBoardService.deleteNoticeBoard(noticeNumber, userEmailId);
        return response;
    }
}
/* 3차 프로젝트 분석완료 */
/*분석 완료*/
