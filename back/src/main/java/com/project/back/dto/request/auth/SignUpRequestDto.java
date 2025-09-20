package com.project.back.dto.request.auth;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;

import com.project.back.constant.PatternType;

@Getter
@Setter
@NoArgsConstructor
public class SignUpRequestDto 
{
    private String snsId;
    @Pattern(regexp=PatternType.patternType2)
    private String userEmailId;
    @NotNull
    @Pattern(regexp=PatternType.patternType1)
    private String password;
    @NotBlank
    private String nickname;
    @NotBlank
    private String userName;
    @NotBlank
    private String authNumber;
    @NotBlank
    private String userAddress;
    @NotBlank
    private String userTelNumber;
    @NotBlank
    private String joinPath;
    private String businessRegistrationNumber;
}
/* 3차 프로젝트 분석완료 */