package com.project.back.dto.request.restaurant.review;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PostReviewRequestDto 
{
    @NotNull
    private double rating;
    private String reviewImage;
    private String reviewContents;
}
/* 3차 프로젝트 분석 완료 */
