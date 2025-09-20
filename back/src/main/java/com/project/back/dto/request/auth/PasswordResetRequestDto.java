package com.project.back.dto.request.auth;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;

import com.project.back.constant.PatternType;

@Getter
@Setter
@NoArgsConstructor
public class PasswordResetRequestDto 
{
    @NotBlank
    @Pattern(regexp=PatternType.patternType2)
    private String userEmailId;
    @NotBlank
    private String userTelNumber;
}
/* 3차 프로젝트 분석완료 */