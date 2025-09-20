package com.project.back.dto.response.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.project.back.dto.response.ResponseDto;
import com.project.back.dto.response.ResponseCode;
import com.project.back.dto.response.ResponseMessage;

import lombok.Getter;

@Getter
public class SignInResponseDto extends ResponseDto
{
    private String accessToken;
    private String csrfToken;
    private int expires;

    private SignInResponseDto(String accessToken, String csrfToken) 
    {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.accessToken = accessToken;
        this.csrfToken = csrfToken;
        this.expires = 60 * 60;
    }
    
    public static ResponseEntity<SignInResponseDto> success(String accessToken, String csrfToken) 
    {
        SignInResponseDto responseBody = new SignInResponseDto(accessToken, csrfToken);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
/* 3차 프로젝트 분석완료 */
