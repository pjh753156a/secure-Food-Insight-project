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

import jakarta.servlet.http.HttpServletResponse;

import com.project.back.dto.response.auth.AdminSignInResponseDto;
import com.project.back.dto.response.auth.FindEmailResponseDto;
import com.project.back.dto.response.auth.PasswordResetResponseDto;

public interface AuthService 
{
  ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto, HttpServletResponse res);
  ResponseEntity<? super AdminSignInResponseDto> AdminSignIn(AdminSignInRequestDto dto);
  ResponseEntity<ResponseDto> signUp(SignUpRequestDto dto);
  ResponseEntity<ResponseDto> emailIdCheck(CheckEmailIdRequestDto dto);
  ResponseEntity<ResponseDto> nicknameCheck(CheckNicknameRequestDto dto);
  ResponseEntity<ResponseDto> telNumberAuth(TelNumberAuthRequestDto dto);
  ResponseEntity<ResponseDto> telNumberAuthCheck(CheckTelNumberAuthRequestDto dto);
  /* 3차 프로젝트 분석완료 */
  ResponseEntity<ResponseDto> businessRegistrationCheck(CheckBusinessRegistrationRequestDto dto);
  /* 3차 프로젝트 분석시작 */
  ResponseEntity<? super FindEmailResponseDto> findEmail(FindEmailRequestDto dto);
  ResponseEntity<? super PasswordResetResponseDto> passwordReset(PasswordResetRequestDto dto);
  ResponseEntity<ResponseDto> newPassword(NewPasswordRequestDto dto, String userEmailId);
}
/* 3차 프로젝트 분석완료 */