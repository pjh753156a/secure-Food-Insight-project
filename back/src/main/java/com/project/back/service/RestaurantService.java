package com.project.back.service;

import org.springframework.http.ResponseEntity;

import com.project.back.dto.request.restaurant.review.PostReviewRequestDto;
import com.project.back.dto.request.restaurant.review.PatchReviewRequestDto;
import com.project.back.dto.request.restaurant.PostRestaurantInfoRequestDto;
import com.project.back.dto.request.restaurant.PatchRestaurantInfoRequestDto;
import com.project.back.dto.request.restaurant.reservation.PostReservationRequestDto;

import com.project.back.dto.response.ResponseDto;
import com.project.back.dto.response.restaurant.GetRestaurantIdResponseDto;
import com.project.back.dto.response.restaurant.review.GetReviewResponseDto;
import com.project.back.dto.response.restaurant.GetRestaurantInfoResponseDto;
import com.project.back.dto.response.restaurant.GetRestaurantListResponseDto;
import com.project.back.dto.response.restaurant.review.GetReviewListResponseDto;
import com.project.back.dto.response.restaurant.favorite.GetFavoriteCheckResponseDto;
import com.project.back.dto.response.restaurant.reservation.GetReservationListResponseDto;
import com.project.back.dto.response.restaurant.reservation.GetReservationCheckResponseDto;
import com.project.back.dto.response.restaurant.favorite.GetFavoriteRestaurantListResponseDto;

public interface RestaurantService 
{
    ResponseEntity<ResponseDto> postRestaurantInfo(PostRestaurantInfoRequestDto dto, String userEmailId);
    /* 3차 프로젝트 분석 시작 */
    ResponseEntity<? super GetRestaurantListResponseDto> getRestaurantList(String searchWord);
    /* 3차 프로젝트 분석 완료 */
    ResponseEntity<? super GetRestaurantInfoResponseDto> getRestaurantInfo(int restaurantId);

    ResponseEntity<ResponseDto> patchRestaurantInfo(PatchRestaurantInfoRequestDto dto, int restaurantId, String userEmailId);
    ResponseEntity<ResponseDto> deleteRestaurantInfo(int restaurantId, String userEmailId);
    
    ResponseEntity<ResponseDto> postReservation (PostReservationRequestDto dto, String userEmailId, int restaurantId);

    ResponseEntity<? super GetReservationListResponseDto> getUserReservationList(String userEmailId);
    ResponseEntity<? super GetReservationListResponseDto> getCeoReservationList(String userEmailId);
    
    ResponseEntity<? super GetReservationCheckResponseDto> getReservationCheck(String userEmailId, int restaurantId);

    ResponseEntity<ResponseDto> deleteReservation(String userEmailId, int restaurantId);

    /* 3차 프로젝트 분석 시작 */
    ResponseEntity<ResponseDto> postReview (PostReviewRequestDto dto, int restaurantId, String userEmailId);
    /* 3차 프로젝트 분석 완료 */

    ResponseEntity<? super GetReviewListResponseDto> getMyReviewList (String userEmailId);
    ResponseEntity<? super GetReviewResponseDto> getReview (int reviewNumber);

    ResponseEntity<ResponseDto> patchReview (PatchReviewRequestDto dto, int reviewNumber, String userEmailId);

    ResponseEntity<ResponseDto> deleteReview (int reviewNumber, String userEmailId);
    
    ResponseEntity<ResponseDto> postFavorite(String userEmailId, int restaurantId);

    ResponseEntity<? super GetFavoriteRestaurantListResponseDto> getFavoriteList(String userEmailId);
    ResponseEntity<? super GetFavoriteCheckResponseDto> getFavoriteCheck(String userEmailId, int restaurantId);
    ResponseEntity<? super GetRestaurantIdResponseDto>getRestaurantId(String userEmailId);
    ResponseEntity<ResponseDto> deleteFavorite(String userEmailId,int restaurantId);
}
/* 분석 완료 */