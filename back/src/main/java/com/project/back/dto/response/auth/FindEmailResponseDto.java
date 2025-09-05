package com.project.back.dto.response.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.project.back.dto.response.ResponseDto;
import com.project.back.dto.response.ResponseCode;
import com.project.back.dto.response.ResponseMessage;

import lombok.Getter;

@Getter 
public class FindEmailResponseDto extends ResponseDto
{
    private String userEmailId;

    private FindEmailResponseDto(String userEmailId) 
    {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.userEmailId = userEmailId;
    }

    public static ResponseEntity<FindEmailResponseDto> success(String userEmailId) 
    {
        FindEmailResponseDto responseBody = new FindEmailResponseDto(userEmailId);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
/* 3차 프로젝트 분석완료 */