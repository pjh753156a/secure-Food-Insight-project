package com.project.back.dto.response.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.project.back.dto.response.ResponseDto;
import com.project.back.dto.response.ResponseCode;
import com.project.back.dto.response.ResponseMessage;

import lombok.Getter;

@Getter
public class PasswordResetResponseDto extends ResponseDto
{
    private String tempAccessToken;

    private PasswordResetResponseDto(String tempAccessToken) 
    {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.tempAccessToken = tempAccessToken;
    }

    public static ResponseEntity<PasswordResetResponseDto> success(String tempAccessToken) 
    {
        PasswordResetResponseDto responseBody = new PasswordResetResponseDto(tempAccessToken);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
/* 3차 프로젝트 분석완료 */