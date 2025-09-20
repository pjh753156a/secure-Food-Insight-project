package com.project.back.entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.Id;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.Table;
import jakarta.persistence.Entity;

import com.project.back.dto.request.auth.SignUpRequestDto;
import com.project.back.dto.request.user.PatchUserInfoRequestDto;

@Entity(name = "user")
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity 
{
    @Id
    private String userEmailId;
    private String snsId;
    private String joinPath;
    private String userRole;
    private String userName;
    private String nickname;
    private String password;
    private String userAddress;
    private String userTelNumber;
    private String businessRegistrationNumber;

    public UserEntity(SignUpRequestDto dto, String userRole) 
    {
        this.joinPath = "HOME";
        this.userRole = userRole;

        this.snsId = dto.getSnsId();
        this.userName = dto.getUserName();
        this.password = dto.getPassword();
        this.nickname = dto.getNickname();
        this.userAddress = dto.getUserAddress();
        this.userEmailId = dto.getUserEmailId();
        this.userTelNumber = dto.getUserTelNumber();
        this.businessRegistrationNumber = dto.getBusinessRegistrationNumber();
    }
    /* 3차 프로젝트 분석완료 */

    public void update(PatchUserInfoRequestDto dto) 
    {
        this.nickname = dto.getNickname();
        this.userAddress = dto.getUserAddress();
        this.password = dto.getPassword();
    }
}
/* 분석 완료 */