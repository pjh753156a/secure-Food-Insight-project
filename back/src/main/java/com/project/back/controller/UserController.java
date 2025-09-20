package com.project.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.project.back.service.UserService;
import com.project.back.dto.request.user.DeleteUserRequestDto;
import com.project.back.dto.request.user.MFARequestDto;
import com.project.back.dto.request.user.PatchUserInfoRequestDto;
import com.project.back.dto.response.ResponseDto;
import com.project.back.dto.response.user.GetMyInfoResponseDto;
import com.project.back.dto.response.user.GetUserInfoResponseDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController 
{
    private final UserService userService;
    /* 3차 프로젝트 분석완료 */

    @GetMapping("/")
    public ResponseEntity<? super GetUserInfoResponseDto> GetSignInUser(
            @AuthenticationPrincipal String userEmailId) 
    {
        ResponseEntity<? super GetUserInfoResponseDto> response = userService.GetSignInUser(userEmailId);
        return response;
    }

    @PatchMapping("/info-update/{userEmailId}")
    public ResponseEntity<ResponseDto> patchUserInfo(
            @RequestBody @Valid PatchUserInfoRequestDto requestBody,
            @PathVariable("userEmailId") String userEmailId) 
    {
        ResponseEntity<ResponseDto> response = userService.patchUserInfo(requestBody, userEmailId);
        return response;
    }

    /* 3차 프로젝트 분석시작 */
    @PostMapping("/info-delete/{userEmailId}")
    public ResponseEntity<ResponseDto> deleteUser(
            @RequestBody @Valid DeleteUserRequestDto requestBody,
            @PathVariable("userEmailId") String userEmailId) 
    {
        ResponseEntity<ResponseDto> response = userService.deleteUser(requestBody, userEmailId);
        return response;
    }
    /* 3차 프로젝트 분석완료 */

    @PostMapping("/mfa")
    public ResponseEntity<ResponseDto> mfa(
        @RequestBody @Valid MFARequestDto requestBody,
        @AuthenticationPrincipal String userId)
    {
        ResponseEntity<ResponseDto> response = userService.mfa(requestBody,userId);
        return response;
    }
    
    // 3차 프로젝트 분석 시작
    @GetMapping("/information")
    public ResponseEntity<? super GetMyInfoResponseDto> getMyInfo(
            @AuthenticationPrincipal String userEmailId) 
    {
        ResponseEntity<? super GetMyInfoResponseDto> response = userService.getMyInfo(userEmailId);
        return response;
    }
}
// 3차 프로젝트 분석 완료