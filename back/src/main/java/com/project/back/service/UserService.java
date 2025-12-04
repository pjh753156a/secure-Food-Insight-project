package com.project.back.service;

import org.springframework.http.ResponseEntity;

import com.project.back.dto.request.user.DeleteUserRequestDto;
import com.project.back.dto.request.user.MFARequestDto;
import com.project.back.dto.request.user.PatchUserInfoRequestDto;

import com.project.back.dto.response.ResponseDto;
import com.project.back.dto.response.user.GetAdminMyInfoResponseDto;
import com.project.back.dto.response.user.GetMyInfoResponseDto;
import com.project.back.dto.response.user.GetUserInfoResponseDto;

public interface UserService 
{
  // 3차 프로젝트 분석 완료
  ResponseEntity<? super GetUserInfoResponseDto> GetSignInUser(String userEmailId);
  // 3차 프로젝트 분석 시작
  ResponseEntity<? super GetMyInfoResponseDto> getMyInfo (String userEmailId);
  ResponseEntity<? super GetAdminMyInfoResponseDto> getAdminMyInfo (String userEmailId);
  // 3차 프로젝트 분석 완료

  ResponseEntity<ResponseDto> patchUserInfo(PatchUserInfoRequestDto dto, String userEmailId);
  /* 3차 프로젝트 분석시작 */
  ResponseEntity<ResponseDto> deleteUser(DeleteUserRequestDto dto, String userEmailId);
  ResponseEntity<ResponseDto> mfa(MFARequestDto dto, String userEmailId);
}
/* 3차 프로젝트 분석완료 */