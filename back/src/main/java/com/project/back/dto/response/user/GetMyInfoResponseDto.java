package com.project.back.dto.response.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.project.back.dto.response.ResponseCode;
import com.project.back.dto.response.ResponseDto;
import com.project.back.dto.response.ResponseMessage;
import com.project.back.entity.UserEntity;

import lombok.Getter;

@Getter
public class GetMyInfoResponseDto extends ResponseDto 
{
    private String userEmailId;
    private String nickname;
    private String userName;
    private String userTelNumber;
    private String userAddress;
    private String businessRegistrationNumber;
    private String userRole;
    private String joinPath;
    private String password;

    private GetMyInfoResponseDto(UserEntity userEntity) 
    {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.nickname=userEntity.getNickname();
        this.userName=userEntity.getUserName();
        this.userRole=userEntity.getUserRole();
        this.joinPath=userEntity.getJoinPath();
        this.userEmailId=userEntity.getUserEmailId();
        this.userAddress=userEntity.getUserAddress();
        this.userTelNumber=userEntity.getUserTelNumber();
        this.businessRegistrationNumber=userEntity.getBusinessRegistrationNumber();
        this.password=userEntity.getPassword();
    }
    
    public static ResponseEntity<GetMyInfoResponseDto> success(UserEntity userEntity) 
    {
        GetMyInfoResponseDto responseBody = new GetMyInfoResponseDto(userEntity);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
/* 분석 완료 */