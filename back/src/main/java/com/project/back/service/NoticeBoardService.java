package com.project.back.service;

import org.springframework.http.ResponseEntity;

import com.project.back.dto.request.board.noticeboard.PostNoticeBoardRequestDto;
import com.project.back.dto.request.board.noticeboard.PatchNoticeBoardRequestDto;

import com.project.back.dto.response.ResponseDto;
import com.project.back.dto.response.board.noticeboard.GetNoticeBoardResponseDto;
import com.project.back.dto.response.board.noticeboard.GetNoticeBoardListResponseDto;
import com.project.back.dto.response.board.noticeboard.GetSearchNoticeBoardResponseDto;

public interface NoticeBoardService 
{
    ResponseEntity<ResponseDto> postBoard(PostNoticeBoardRequestDto dto, String userEmailId);
    /* 3차 프로젝트 분석완료 */

    ResponseEntity<? super GetNoticeBoardListResponseDto> getNoticeBoardList();
    ResponseEntity<? super GetNoticeBoardResponseDto> getNoticeBoard(int noticeNumber);
    ResponseEntity<? super GetSearchNoticeBoardResponseDto> getSearchNoticeBoardList(String searchWord);

    /* 3차 프로젝트 분석시작 */
    ResponseEntity<ResponseDto> patchNoticeBoard(PatchNoticeBoardRequestDto dto, int noticeNumber, String userEmailId);
    /* 3차 프로젝트 분석완료 */
    ResponseEntity<ResponseDto> increaseViewCount(int noticeNumber);

    /* 3차 프로젝트 분석시작 */
    ResponseEntity<ResponseDto> deleteNoticeBoard(int noticeNumber, String userEmailId);
}
/* 3차 프로젝트 분석완료 */
/*분석 완료*/
