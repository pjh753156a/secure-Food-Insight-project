package com.project.back.dto.request.board.inquiryboard;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
public class PatchInquiryBoardRequestDto 
{
    @NotBlank
    private String inquiryTitle;
    @NotBlank
    private String inquiryContents;
    private String inquiryFile;
    private String inquiryFileName;
}
/* 3차 프로젝트 분석완료 */
