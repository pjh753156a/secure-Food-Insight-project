package com.project.back.dto.request.user;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
public class PatchUserInfoRequestDto 
{
    @NotBlank
    private String nickname;
    @NotBlank
    private String userAddress;
    @NotBlank
    private String password;
}
/* /분석 완료/ */