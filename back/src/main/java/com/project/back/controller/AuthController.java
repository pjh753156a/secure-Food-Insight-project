package com.project.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.back.service.AuthService;
import com.project.back.dto.response.ResponseDto;
import com.project.back.dto.response.auth.SignInResponseDto;
import com.project.back.dto.response.auth.AdminSignInResponseDto;
import com.project.back.dto.response.auth.FindEmailResponseDto;
import com.project.back.dto.request.auth.SignInRequestDto;
import com.project.back.dto.request.auth.SignUpRequestDto;
import com.project.back.dto.request.auth.FindEmailRequestDto;
import com.project.back.dto.request.auth.NewPasswordRequestDto;
import com.project.back.dto.request.auth.CheckEmailIdRequestDto;
import com.project.back.dto.request.auth.PasswordResetRequestDto;
import com.project.back.dto.request.auth.CheckNicknameRequestDto;
import com.project.back.dto.request.auth.TelNumberAuthRequestDto;
import com.project.back.dto.request.auth.CheckTelNumberAuthRequestDto;
import com.project.back.dto.request.auth.AdminSignInRequestDto;
import com.project.back.dto.request.auth.CheckBusinessRegistrationRequestDto;

import com.project.back.dto.response.auth.PasswordResetResponseDto;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController 
{
    private final AuthService authService;

    @PostMapping("/sign-in")
    public ResponseEntity<? super SignInResponseDto> signIn(
            @RequestBody @Valid SignInRequestDto requestBody,
            HttpServletResponse res) 
    {
        ResponseEntity<? super SignInResponseDto> response = authService.signIn(requestBody, res );
        return response;
    }

    @PostMapping("/admin-sign-in")
    public ResponseEntity<? super AdminSignInResponseDto> AdminSignIn(
            @RequestBody @Valid AdminSignInRequestDto requestBody)
    {
        ResponseEntity<? super AdminSignInResponseDto> response = authService.AdminSignIn(requestBody);
        return response;
    }
    
    @PostMapping("/email-check")
    public ResponseEntity<ResponseDto> emailIdCheck(
            @RequestBody @Valid CheckEmailIdRequestDto requestBody) 
    {
        ResponseEntity<ResponseDto> response = authService.emailIdCheck(requestBody);
        return response;
    }

    @PostMapping("/nickname-check")
    public ResponseEntity<ResponseDto> nicknameCheck(
            @RequestBody @Valid CheckNicknameRequestDto requestBody) 
    {
        ResponseEntity<ResponseDto> response = authService.nicknameCheck(requestBody);
        return response;
    }

    @PostMapping("/tel-number-auth")
    public ResponseEntity<ResponseDto> telNumberAuth(
            @RequestBody @Valid TelNumberAuthRequestDto requestBody) 
    {
        ResponseEntity<ResponseDto> response = authService.telNumberAuth(requestBody);
        return response;
    }

    @PostMapping("/tel-number-check")
    public ResponseEntity<ResponseDto> telNumberAuthCheck(
            @RequestBody @Valid CheckTelNumberAuthRequestDto requestBody)
    {
        ResponseEntity<ResponseDto> response = authService.telNumberAuthCheck(requestBody);
        return response;
    }
    /* 3차 프로젝트 분석완료 */

    @PostMapping("/business-registration-check")
    public ResponseEntity<ResponseDto> businessRegistrationCheck(
            @RequestBody @Valid CheckBusinessRegistrationRequestDto requestBody)  
    {
        ResponseEntity<ResponseDto> response = authService.businessRegistrationCheck(requestBody);
        return response;
    }

    /* 3차 프로젝트 분석시작 */
    @PostMapping("/sign-up")
    public ResponseEntity<ResponseDto> signUp(
            @RequestBody @Valid SignUpRequestDto requestBody) 
    {
        ResponseEntity<ResponseDto> response = authService.signUp(requestBody);
        return response;
    }
    
    @PostMapping("/find-email")
    public ResponseEntity<? super FindEmailResponseDto> findEmail(
            @RequestBody @Valid FindEmailRequestDto requestBody) 
    {
        ResponseEntity<? super FindEmailResponseDto> response = authService.findEmail(requestBody);
        return response;
    }

    @PostMapping("/password-reset")
    public ResponseEntity<? super PasswordResetResponseDto> passwordReset(
            @RequestBody @Valid PasswordResetRequestDto requestBody) 
    {
        ResponseEntity<? super PasswordResetResponseDto> response = authService.passwordReset(requestBody);
        return response;
    }

    @PutMapping("/password-update")
    public ResponseEntity<ResponseDto> newPassword(
            @RequestBody @Valid NewPasswordRequestDto requestBody,
            @AuthenticationPrincipal String userEmailId) 
    {
        ResponseEntity<ResponseDto> response = authService.newPassword(requestBody, userEmailId);
        return response;
    }
}
/* 3차 프로젝트 분석완료 */