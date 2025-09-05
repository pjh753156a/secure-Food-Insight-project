package com.project.back.dto.request.auth;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
public class CheckNicknameRequestDto 
{
    @NotBlank
    private String nickname;
}
/* 3차 프로젝트 분석완료 */
