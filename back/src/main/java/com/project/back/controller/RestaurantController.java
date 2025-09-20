package com.project.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.project.back.dto.response.ResponseDto;
import com.project.back.service.RestaurantService;
import com.project.back.dto.request.restaurant.review.PostReviewRequestDto;
import com.project.back.dto.request.restaurant.PostRestaurantInfoRequestDto;
import com.project.back.dto.request.restaurant.review.PatchReviewRequestDto;
import com.project.back.dto.request.restaurant.PatchRestaurantInfoRequestDto;
import com.project.back.dto.request.restaurant.reservation.PostReservationRequestDto;
import com.project.back.dto.response.restaurant.GetRestaurantIdResponseDto;
import com.project.back.dto.response.restaurant.review.GetReviewResponseDto;
import com.project.back.dto.response.restaurant.GetRestaurantInfoResponseDto;
import com.project.back.dto.response.restaurant.GetRestaurantListResponseDto;
import com.project.back.dto.response.restaurant.review.GetReviewListResponseDto;
import com.project.back.dto.response.restaurant.favorite.GetFavoriteCheckResponseDto;
import com.project.back.dto.response.restaurant.reservation.GetReservationListResponseDto;
import com.project.back.dto.response.restaurant.reservation.GetReservationCheckResponseDto;
import com.project.back.dto.response.restaurant.favorite.GetFavoriteRestaurantListResponseDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/restaurant")
public class RestaurantController 
{
    private final RestaurantService restaurantService;
    
    @GetMapping("/search")
    public ResponseEntity<? super GetRestaurantListResponseDto> getRestaurantList(
        @RequestParam("word") String word
    ){
        ResponseEntity<? super GetRestaurantListResponseDto> response = restaurantService.getRestaurantList(word);
        return response;
    }
    /* 3차 프로젝트 분석 완료 */

    @GetMapping("/{restaurantId}")
    public ResponseEntity<? super GetRestaurantInfoResponseDto> getRestaurantInfo(
        @PathVariable("restaurantId") int restaurantId
    ){
        ResponseEntity<? super GetRestaurantInfoResponseDto>  response = restaurantService.getRestaurantInfo(restaurantId);
        return response;
    }
    
    @PostMapping("/info-upload")
    public ResponseEntity<ResponseDto> postRestaurantInfo(
        @RequestBody @Valid PostRestaurantInfoRequestDto requestBody,
        @AuthenticationPrincipal String userEmailId 
    ) 
    {
        ResponseEntity<ResponseDto> response = restaurantService.postRestaurantInfo(requestBody, userEmailId);
        return response;
    };


    @GetMapping("/restaurantId")  
    public ResponseEntity<? super GetRestaurantIdResponseDto> getRestaurantId(
        @AuthenticationPrincipal String userEmailId 
    )
    {
        ResponseEntity<? super GetRestaurantIdResponseDto> response = restaurantService.getRestaurantId(userEmailId);
        return response;
    }
    
    @PatchMapping("/{restaurantId}/info-update")
    public ResponseEntity<ResponseDto> patchRestaurantInfo(
        @RequestBody @Valid PatchRestaurantInfoRequestDto requestBody,
        @PathVariable("restaurantId") int restaurantId,
        @AuthenticationPrincipal String userEmailId
    ) {
        ResponseEntity<ResponseDto> response = restaurantService.patchRestaurantInfo(requestBody, restaurantId, userEmailId);
        return response;
    }

    @DeleteMapping("/{restaurantId}/info-delete")
    public ResponseEntity<ResponseDto> deleteRestaurantInfo(
        @PathVariable("restaurantId") int restaurantId,
        @AuthenticationPrincipal String userEmailId
    ) {
        ResponseEntity<ResponseDto> response = restaurantService.deleteRestaurantInfo(restaurantId, userEmailId);
        return response;
    }
    
    @GetMapping("/reservation/list")
    public ResponseEntity<? super GetReservationListResponseDto> getUserReservationList(
        @AuthenticationPrincipal String userEmailId
    ) {
        ResponseEntity<? super GetReservationListResponseDto> response = restaurantService.getUserReservationList(userEmailId);
        return response;
    }

    @GetMapping("/reservation/ceo-list")
    public ResponseEntity<? super GetReservationListResponseDto> getCeoReservationList(
        @AuthenticationPrincipal String userEmailId
    ) {
        ResponseEntity<? super GetReservationListResponseDto> response = restaurantService.getCeoReservationList(userEmailId);
        return response;
    }
    
    @PostMapping("/reservation/{restaurantId}")
    public ResponseEntity<ResponseDto> postReservation(
        @RequestBody @Valid PostReservationRequestDto requestBody,
        @AuthenticationPrincipal String userEmailId,
        @PathVariable("restaurantId") int restaurantId
    ) {
        ResponseEntity<ResponseDto> response = restaurantService.postReservation(requestBody, userEmailId, restaurantId);
        return response;
    }

    @GetMapping("/reservation/{restaurantId}")
    public ResponseEntity<? super GetReservationCheckResponseDto> getReservationCheck(
        @AuthenticationPrincipal String userEmailId,
        @PathVariable("restaurantId") int restaurantId
    ) {
        ResponseEntity<? super GetReservationCheckResponseDto> response = restaurantService.getReservationCheck(userEmailId, restaurantId);
        return response;
    };

    @DeleteMapping("/reservation/{restaurantId}")
    public ResponseEntity<ResponseDto> deleteReservation(
        @PathVariable("restaurantId") int restaurantId, 
        @AuthenticationPrincipal String userEmailId
    ){
        ResponseEntity<ResponseDto> response = restaurantService.deleteReservation(userEmailId, restaurantId);
        return response;
    }

    @GetMapping("/review/{reviewNumber}")
    public ResponseEntity<? super GetReviewResponseDto> getReview(
        @PathVariable("reviewNumber") int reviewNumber
    ) {
        ResponseEntity<? super GetReviewResponseDto> response = restaurantService.getReview(reviewNumber);
        return response;
    }
    
    /* 3차 프로젝트 분석 시작 */
    @PostMapping("/review/write/{restaurantId}")
    public ResponseEntity<ResponseDto> postReview(
        @RequestBody @Valid PostReviewRequestDto requestBody, 
        @PathVariable("restaurantId") int restaurantId,
        @AuthenticationPrincipal String userEmailId
    ) 
    {
        ResponseEntity<ResponseDto> response = restaurantService.postReview(requestBody, restaurantId, userEmailId);
        return response;
    }
    /* 3차 프로젝트 분석 완료 */

    @PatchMapping("/review/update/{reviewNumber}")
    public ResponseEntity<ResponseDto> patchReview(
        @RequestBody @Valid PatchReviewRequestDto requestBody,
        @PathVariable("reviewNumber") int reviewNumber,
        @AuthenticationPrincipal String userEmailId
    ){
        ResponseEntity<ResponseDto> response = restaurantService.patchReview(requestBody, reviewNumber, userEmailId);
        return response;
    }

    @DeleteMapping("/review/delete/{reviewNumber}")
    public ResponseEntity<ResponseDto> deleteReview(
        @PathVariable("reviewNumber") int reviewNumber,
        @AuthenticationPrincipal String userEmailId
    ){
        ResponseEntity<ResponseDto> response = restaurantService.deleteReview(reviewNumber, userEmailId);
        return response;
    }
    
    @GetMapping("/review/list")
    public ResponseEntity<? super GetReviewListResponseDto> getMyReviewList(
        @AuthenticationPrincipal String userEmailId
    ) 
    {
        ResponseEntity<? super GetReviewListResponseDto> response = restaurantService.getMyReviewList(userEmailId);
        return response;
    }
    
    @PostMapping("/favorite/{restaurantId}")
    public ResponseEntity<ResponseDto> postFavorite(
        @PathVariable("restaurantId") int restaurantId,
        @AuthenticationPrincipal String userEmailId
    ) {
        ResponseEntity<ResponseDto> response = restaurantService.postFavorite(userEmailId, restaurantId);
        return response;
    }

    @DeleteMapping("/favorite/{restaurantId}")
    public ResponseEntity<ResponseDto> deleteFavorite(
        @PathVariable("restaurantId") int restaurantId,
        @AuthenticationPrincipal String userEmailId
    ) 
    {
        ResponseEntity<ResponseDto> response = restaurantService.deleteFavorite(userEmailId, restaurantId);
        return response;
    }
    
    @GetMapping("/favorite/{restaurantId}")
    public ResponseEntity<? super GetFavoriteCheckResponseDto> getFavoriteCheck(
        @PathVariable("restaurantId") int restaurantId,
        @AuthenticationPrincipal String userEmailId
    ) {
        ResponseEntity<? super GetFavoriteCheckResponseDto> response = restaurantService.getFavoriteCheck(userEmailId, restaurantId);
        return response;
    }
    
    @GetMapping("/favorite/list")
    public ResponseEntity<? super GetFavoriteRestaurantListResponseDto> getFavoriteList(
        @AuthenticationPrincipal String userEmailId
    ) {
        ResponseEntity<? super GetFavoriteRestaurantListResponseDto> response = restaurantService.getFavoriteList(userEmailId);
        return response;
    }
}
/* 분석 완료 */