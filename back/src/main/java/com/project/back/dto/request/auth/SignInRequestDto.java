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
public class SignInRequestDto 
{
    @NotBlank
    private String password;
    @NotBlank
    private String userEmailId;
}
/* 3차 프로젝트 분석완료 */

//@Pattern(regexp=PatternType.patternType1)
//@Pattern(regexp=PatternType.patternType2)