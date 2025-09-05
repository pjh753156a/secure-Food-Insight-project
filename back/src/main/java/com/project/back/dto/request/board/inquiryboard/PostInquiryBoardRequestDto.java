package com.project.back.dto.request.board.inquiryboard;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
public class PostInquiryBoardRequestDto 
{
    @NotBlank
    private String inquiryTitle;
    @NotNull
    private Boolean inquiryPublic;
    @NotBlank
    private String inquiryContents;
    private String inquiryFile;
    private String inquiryFileName;
}
/*분석 완료*/
