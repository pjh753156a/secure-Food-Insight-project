package com.project.back.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public  class AdminSignInRequestDto
{
    @NotBlank
    private String password;
    @NotBlank
    private String userEmailId;
}
/* 3차 프로젝트 분석완료 */

//@Pattern(regexp=PatternType.patternType1)
//@Pattern(regexp=PatternType.patternType2)