package com.project.back.service;

import org.springframework.http.ResponseEntity;

import com.project.back.dto.request.auth.SignInRequestDto;
import com.project.back.dto.request.auth.SignUpRequestDto;
import com.project.back.dto.request.auth.FindEmailRequestDto;
import com.project.back.dto.request.auth.NewPasswordRequestDto;
import com.project.back.dto.request.auth.CheckEmailIdRequestDto;
import com.project.back.dto.request.auth.CheckNicknameRequestDto;
import com.project.back.dto.request.auth.PasswordResetRequestDto;
import com.project.back.dto.request.auth.TelNumberAuthRequestDto;
import com.project.back.dto.request.auth.CheckTelNumberAuthRequestDto;
import com.project.back.dto.request.auth.AdminSignInRequestDto;
import com.project.back.dto.request.auth.CheckBusinessRegistrationRequestDto;

import com.project.back.dto.response.ResponseDto;
import com.project.back.dto.response.auth.SignInResponseDto;
import com.project.back.dto.response.auth.AdminSignInResponseDto;
import com.project.back.dto.response.auth.FindEmailResponseDto;

public interface AuthService 
{
  ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);
  ResponseEntity<? super AdminSignInResponseDto> AdminSignIn(AdminSignInRequestDto dto);
  /* 3차 프로젝트 분석완료 */
  ResponseEntity<ResponseDto> signUp(SignUpRequestDto dto);
  /* 3차 프로젝트 분석시작 */
  ResponseEntity<ResponseDto> emailIdCheck(CheckEmailIdRequestDto dto);
  ResponseEntity<ResponseDto> nicknameCheck(CheckNicknameRequestDto dto);
  /* 3차 프로젝트 분석완료 */
  ResponseEntity<ResponseDto> telNumberAuth(TelNumberAuthRequestDto dto);
  ResponseEntity<ResponseDto> telNumberAuthCheck(CheckTelNumberAuthRequestDto dto);
  ResponseEntity<ResponseDto> businessRegistrationCheck(CheckBusinessRegistrationRequestDto dto);
  /* 3차 프로젝트 분석시작 */
  ResponseEntity<? super FindEmailResponseDto> findEmail(FindEmailRequestDto dto);
  /* 3차 프로젝트 분석완료 */
  ResponseEntity<ResponseDto> passwordReset(PasswordResetRequestDto dto);
  ResponseEntity<ResponseDto> newPassword(NewPasswordRequestDto dto, String userEmailId);
}
/* 분석 완료 */