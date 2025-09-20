package com.project.back.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import com.project.back.common.util.ChangeDateFormatUtil;
import com.project.back.dto.request.restaurant.review.PatchReviewRequestDto;
import com.project.back.dto.request.restaurant.review.PostReviewRequestDto;

@Entity(name="review")
@Table(name="review")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewEntity 
{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer reviewNumber;
    private Integer reviewRestaurantId;
    private Double rating;
    private String reviewDate;
    private String reviewImage;
    private String reviewContents;
    private String reviewWriterId;
    private String reviewWriterNickname;
    private String reviewRestaurantName;
    
    public ReviewEntity(PostReviewRequestDto dto, String userEmailId, int restaurantId, UserEntity userEntity, RestaurantEntity restaurantEntity) 
    {
        String dateNow = ChangeDateFormatUtil.nowYYYYMMDD();
        this.reviewDate = dateNow;

        this.reviewWriterId = userEmailId;
        this.reviewRestaurantId = restaurantId;

        this.rating = dto.getRating();
        this.reviewImage = dto.getReviewImage();
        this.reviewContents = dto.getReviewContents();
        this.reviewWriterNickname = userEntity.getNickname();
        this.reviewRestaurantName = restaurantEntity.getRestaurantName();
    }
    /* 3차 프로젝트 분석 완료 */

    public void updateReview(PatchReviewRequestDto dto) 
    {
        this.rating = dto.getRating();
        this.reviewImage = dto.getReviewImage();
        this.reviewContents = dto.getReviewContents();
    }
}
/* /분석 완료/ */