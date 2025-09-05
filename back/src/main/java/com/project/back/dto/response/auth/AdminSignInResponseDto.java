package com.project.back.dto.response.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.project.back.dto.response.ResponseCode;
import com.project.back.dto.response.ResponseDto;
import com.project.back.dto.response.ResponseMessage;

import lombok.Getter;

@Getter
public class AdminSignInResponseDto extends ResponseDto
{
    private String accessToken;
    private int expires;

    private AdminSignInResponseDto(String accessToken) 
    {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.accessToken = accessToken;
        this.expires = 60 * 60;
    }
    
    public static ResponseEntity<AdminSignInResponseDto> success(String accessToken) 
    {
        AdminSignInResponseDto responseBody = new AdminSignInResponseDto(accessToken);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
/* 3차 프로젝트 분석완료 */