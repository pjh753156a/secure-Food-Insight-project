package com.project.back.dto.request.board.noticeboard;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
public class PostNoticeBoardRequestDto 
{
    @NotBlank
    private String noticeTitle;
    @NotBlank
    private String noticeContents;
    private String noticeFile;
    private String noticeFileName;
}
/*분석 완료*/
