package com.project.back.dto.request.user;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;

import com.project.back.constant.PatternType;

@Getter
@Setter
@NoArgsConstructor
public class DeleteUserRequestDto 
{
    @NotBlank
    @Pattern(regexp=PatternType.patternType1)
    private String password;
}
/* 3차 프로젝트 분석완료 */