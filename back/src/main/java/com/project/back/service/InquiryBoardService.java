package com.project.back.service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.project.back.dto.request.board.inquiryboard.PostCommentRequestDto;
import com.project.back.dto.request.board.inquiryboard.PostInquiryBoardRequestDto;
import com.project.back.dto.request.board.inquiryboard.PatchInquiryBoardRequestDto;

import com.project.back.dto.response.ResponseDto;
import com.project.back.dto.response.board.inquiryboard.GetInquiryBoardResponseDto;
import com.project.back.dto.response.board.inquiryboard.GetInquiryBoardListResponseDto;
import com.project.back.dto.response.board.inquiryboard.GetSearchInquiryBoardListResponseDto;

public interface InquiryBoardService 
{
  ResponseEntity<ResponseDto> postBoard(PostInquiryBoardRequestDto dto, String userEmailId);
  ResponseEntity<ResponseDto> postComment(PostCommentRequestDto dto, int inquiryNumber);
  ResponseEntity<? super GetInquiryBoardListResponseDto> getInquiryBoardList();
  ResponseEntity<? super GetSearchInquiryBoardListResponseDto> getSearchInquiryBoardList(String searchWord);
  ResponseEntity<? super GetInquiryBoardResponseDto> getInquiryBoard(int inquiryNumber);
  ResponseEntity<ResponseDto> patchInquiryBoard(PatchInquiryBoardRequestDto dto, int inquiryNumber, String userEmailId);
  ResponseEntity<ResponseDto> deleteInquiryBoard(int inquiryNumber, String userEmailId);
}
/* /분석 완료/ */