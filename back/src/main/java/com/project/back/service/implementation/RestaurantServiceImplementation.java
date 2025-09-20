package com.project.back.service.implementation;

import java.util.List;

import com.project.back.entity.UserEntity;
import com.project.back.entity.ReviewEntity;
import com.project.back.entity.RestaurantEntity;
import com.project.back.entity.ReservationEntity;
import com.project.back.entity.FavoriteRestaurantEntity;

import com.project.back.service.RestaurantService;
import com.project.back.repository.UserRepository;
import com.project.back.repository.ReviewRepository;
import com.project.back.repository.RestaurantRepository;
import com.project.back.repository.ReservationRepository;
import com.project.back.repository.FavoriteRestaurantRepository;
import com.project.back.repository.resultSet.GetRestaurantFavoriteItemResultSet;
import com.project.back.repository.resultSet.GetRestaurantReviewListItemResultSet;

import com.project.back.dto.request.restaurant.review.PatchReviewRequestDto;
import com.project.back.dto.request.restaurant.review.PostReviewRequestDto;
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

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImplementation implements RestaurantService 
{
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;
    private final ReservationRepository reservationRepository;
    private final FavoriteRestaurantRepository favoriteRestaurantRepository;

    @Override
    public ResponseEntity<? super GetRestaurantListResponseDto> getRestaurantList(String searchWord) 
    {
        try 
        {
            String safeSearchWord = searchWord == null ? null
            : searchWord
                .replaceAll("(?is)<\\s*script.*?>.*?<\\s*/\\s*script\\s*>", "") // <script>…</script> 제거
                .replaceAll("[<>]", ""); // <, > 제거

            List<RestaurantEntity> restaurantEntities = restaurantRepository.findByRestaurantNameContainingOrderByRestaurantIdDesc(safeSearchWord);

            return GetRestaurantListResponseDto.success(restaurantEntities);
        } 
        catch(Exception exception)
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }
    /* 3차프로젝트 분석완료 */

    @Override
    public ResponseEntity<? super GetRestaurantInfoResponseDto> getRestaurantInfo(int restaurantId) 
    {
        try 
        {
            RestaurantEntity restaurantEntity = restaurantRepository.findByRestaurantId(restaurantId);

            List<GetRestaurantReviewListItemResultSet> reviewEntities = reviewRepository.findReviewsByRestaurantId(restaurantId);
            if (restaurantEntity == null) return ResponseDto.noExistRestaurant();

            return GetRestaurantInfoResponseDto.success(restaurantEntity, reviewEntities);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }

    @Override
    public ResponseEntity<? super GetRestaurantIdResponseDto> getRestaurantId(String userEmailId) 
    {
        try
        {
            RestaurantEntity restaurantEntity = restaurantRepository.findByRestaurantWriterId(userEmailId);
            if (restaurantEntity == null) return ResponseDto.authorizationFailed();
            return GetRestaurantIdResponseDto.success(restaurantEntity);
        }
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }
    
    @Override
    public ResponseEntity<ResponseDto> postRestaurantInfo(PostRestaurantInfoRequestDto dto, String userEmailId) 
    {
        try 
        {
            boolean isExistUser = userRepository.existsByUserEmailId(userEmailId);
            if (!isExistUser) return ResponseDto.authenticationFailed();

            isExistUser = restaurantRepository.existsByRestaurantWriterId(userEmailId);
            if(isExistUser) return ResponseDto.duplicatedEmailId();

            UserEntity userEntity = userRepository.findByUserEmailId(userEmailId);

            RestaurantEntity restaurantEntity = new RestaurantEntity(dto, userEmailId, userEntity);

            restaurantRepository.save(restaurantEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }

    @Override
    public ResponseEntity<ResponseDto> patchRestaurantInfo(PatchRestaurantInfoRequestDto dto, int restaurantId, String userEmailId) 
    {
        try 
        {
            RestaurantEntity restaurantEntity = restaurantRepository.findByRestaurantId(restaurantId);
            if (restaurantEntity == null) return ResponseDto.noExistRestaurant();

            String writerId = restaurantEntity.getRestaurantWriterId();
            boolean isWriter = userEmailId.equals(writerId);
            if (!isWriter) return ResponseDto.authorizationFailed();

            restaurantEntity.updateRestaurantInfo(dto);
            restaurantRepository.save(restaurantEntity);
        }
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }

    @Override
    public ResponseEntity<ResponseDto> deleteRestaurantInfo(int restaurantId, String userEmailId) 
    {
        try 
        {
            boolean isExistUser = userRepository.existsByUserEmailId(userEmailId);
            if(!isExistUser) return ResponseDto.noExistUser();

            boolean isExistRestaurant = restaurantRepository.existsByRestaurantId(restaurantId);
            if (!isExistRestaurant) return ResponseDto.noExistRestaurant();

            RestaurantEntity restaurantEntity = restaurantRepository.findByRestaurantWriterIdAndRestaurantId(userEmailId, restaurantId);
            if (restaurantEntity == null) return ResponseDto.authorizationFailed();

            restaurantRepository.delete(restaurantEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }

    @Override
    public ResponseEntity<? super GetReservationListResponseDto> getUserReservationList(String userEmailId) 
    {
        try 
        {
            List<ReservationEntity> reservationEntities = reservationRepository.findByReservationUserIdOrderByReservationNumberDesc(userEmailId);
            return GetReservationListResponseDto.success(reservationEntities);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }
    
    @Override
    public ResponseEntity<? super GetReservationListResponseDto> getCeoReservationList(String userEmailId) 
    {
        try 
        {
            RestaurantEntity restaurantEntity = restaurantRepository.getRestaurantIdByRestaurantWriterId(userEmailId);
            if(restaurantEntity == null) return ResponseDto.authorizationFailed();

            Integer restaurantId = restaurantEntity.getRestaurantId();

            List<ReservationEntity> reservationEntities = reservationRepository.findByReservationRestaurantIdOrderByReservationNumberDesc(restaurantId);

            return GetReservationListResponseDto.success(reservationEntities);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }
    
    @Override
    public ResponseEntity<ResponseDto> postReservation(PostReservationRequestDto dto, String userEmailId, int restaurantId)
    {
        try 
        {
            boolean isExistUser = userRepository.existsByUserEmailId(userEmailId);
            if (!isExistUser) return ResponseDto.noExistUser();

            UserEntity userEntity = userRepository.findByUserEmailId(userEmailId);

            boolean isExistRestaurant = restaurantRepository.existsByRestaurantId(restaurantId);
            if (!isExistRestaurant) return ResponseDto.noExistReservation();

            RestaurantEntity restaurantEntity = restaurantRepository.findByRestaurantId(restaurantId);

            ReservationEntity reservationEntity = new ReservationEntity(dto, userEmailId, restaurantId, userEntity, restaurantEntity);
            reservationRepository.save(reservationEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }
    
    @Override
    public ResponseEntity<? super GetReservationCheckResponseDto> getReservationCheck(String userEmailId, int restaurantId) 
    {
        try 
        {
            boolean isReservationStatus = reservationRepository.existsByReservationUserIdAndReservationRestaurantId(userEmailId,restaurantId);
            if (!isReservationStatus) return ResponseDto.noExistUser();

            ReservationEntity reservationEntity = reservationRepository.findByReservationUserIdAndReservationRestaurantId(userEmailId,restaurantId);

            return GetReservationCheckResponseDto.success(reservationEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }

    @Override
    public ResponseEntity<ResponseDto> deleteReservation(String userEmailId, int restaurantId) 
    {
        try 
        {
            boolean isExistUser = userRepository.existsByUserEmailId(userEmailId);
            if (!isExistUser) return ResponseDto.noExistUser();

            boolean isExistRestaurant = restaurantRepository.existsByRestaurantId(restaurantId);
            if (!isExistRestaurant) return ResponseDto.noExistRestaurant();

            ReservationEntity reservationEntity = reservationRepository.findByReservationUserIdAndReservationRestaurantId(userEmailId, restaurantId);
            if (reservationEntity == null) return ResponseDto.authorizationFailed();

            reservationRepository.delete(reservationEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }

    @Override
    public ResponseEntity<? super GetReviewResponseDto> getReview(int reviewNumber) 
    {
        try 
        {
            ReviewEntity reviewEntity = reviewRepository.findByReviewNumber(reviewNumber);
            if (reviewEntity == null) return ResponseDto.noExistReview();

            return GetReviewResponseDto.success(reviewEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }
    
    /* 3차 프로젝트 분석 시작 */
    @Override
    public ResponseEntity<ResponseDto> postReview(PostReviewRequestDto dto, int restaurantId, String userEmailId) 
    {
        try 
        {
            boolean isExistUser = userRepository.existsByUserEmailId(userEmailId);
            if (!isExistUser) return ResponseDto.authorizationFailed();

            isExistUser = reviewRepository.existsByReviewWriterIdAndReviewRestaurantId(userEmailId,restaurantId);
            if(isExistUser) return ResponseDto.duplicatedEmailId();

            UserEntity userEntity = userRepository.findByUserEmailId(userEmailId);

            boolean isExistRestaurantId = restaurantRepository.existsByRestaurantId(restaurantId);
            if(!isExistRestaurantId) return ResponseDto.noExistRestaurant();

            RestaurantEntity restaurantEntity = restaurantRepository.findByRestaurantId(restaurantId);        

            ReviewEntity reviewEntity = new ReviewEntity(dto, userEmailId, restaurantId, userEntity, restaurantEntity);
            reviewRepository.save(reviewEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }
    /* 3차 프로젝트 분석 완료 */

    @Override
    public ResponseEntity<ResponseDto> patchReview(PatchReviewRequestDto dto, int reviewNumber, String userEmailId) 
    {
        try 
        {
            ReviewEntity reviewEntity = reviewRepository.findByReviewNumber(reviewNumber);
            if (reviewEntity == null) return ResponseDto.noExistReview();

            String writerId = reviewEntity.getReviewWriterId();
            boolean isWriter = userEmailId.equals(writerId);
            if (!isWriter) return ResponseDto.authorizationFailed();

            reviewEntity.updateReview(dto);
            reviewRepository.save(reviewEntity);
        }
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }

    @Override
    public ResponseEntity<ResponseDto> deleteReview(int reviewNumber, String userEmailId) 
    {
        try 
        {
            ReviewEntity reviewEntity = reviewRepository.findByReviewNumber(reviewNumber);
            UserEntity userEntity = userRepository.findByUserEmailId(userEmailId);
            String userRole = userEntity.getUserRole();
            if (reviewEntity == null) return ResponseDto.noExistReview();

            String writerId = reviewEntity.getReviewWriterId();
            boolean isWriter = userEmailId.equals(writerId);
            boolean isAdmin = userRole.equals("ROLE_ADMIN");
            if (!isWriter && !isAdmin) return ResponseDto.authorizationFailed();

            reviewRepository.delete(reviewEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }
    
    @Override
    public ResponseEntity<? super GetReviewListResponseDto> getMyReviewList(String userEmailId) 
    {
        try 
        {
            List<GetRestaurantReviewListItemResultSet> resultSets = reviewRepository.findByOrderByMyReviewListDesc(userEmailId);
            return GetReviewListResponseDto.success(resultSets);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }
    
    @Override
    public ResponseEntity<ResponseDto> postFavorite(String userEmailId, int restaurantId) 
    {
        try 
        {
            boolean isExistUser = userRepository.existsByUserEmailId(userEmailId);
            if (!isExistUser) return ResponseDto.noExistUser();

            boolean isExistRestaurant = restaurantRepository.existsByRestaurantId(restaurantId);
            if (!isExistRestaurant) return ResponseDto.noExistRestaurant();

            FavoriteRestaurantEntity favoriteRestaurantEntity = new FavoriteRestaurantEntity(userEmailId,restaurantId);
            favoriteRestaurantRepository.save(favoriteRestaurantEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }

    @Override
    public ResponseEntity<ResponseDto> deleteFavorite(String userEmailId, int restaurantId) 
    {
        try 
        {
            boolean isExistUser = userRepository.existsByUserEmailId(userEmailId);
            if (!isExistUser) return ResponseDto.noExistUser();

            boolean isExistRestaurant = restaurantRepository.existsByRestaurantId(restaurantId);
            if (!isExistRestaurant) return ResponseDto.noExistRestaurant();

            FavoriteRestaurantEntity favoriteRestaurantEntity = favoriteRestaurantRepository.findByFavoriteUserIdAndFavoriteRestaurantId(userEmailId, restaurantId);
            if (favoriteRestaurantEntity == null) return ResponseDto.authorizationFailed();

            favoriteRestaurantRepository.delete(favoriteRestaurantEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }
    
    @Override
    public ResponseEntity<? super GetFavoriteRestaurantListResponseDto> getFavoriteList(String userEmailId) 
    {
        try 
        {
            List<GetRestaurantFavoriteItemResultSet> resultSets = restaurantRepository.getFavoriteList(userEmailId);

            return GetFavoriteRestaurantListResponseDto.success(resultSets);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }
    
    @Override
    public ResponseEntity<? super GetFavoriteCheckResponseDto> getFavoriteCheck(String userEmailId, int restaurantId) 
    {
        try 
        {
            boolean isFavoriteStatus = favoriteRestaurantRepository.existsByFavoriteUserIdAndFavoriteRestaurantId(userEmailId,restaurantId);
            if(!isFavoriteStatus) return ResponseDto.noExistUser();

            FavoriteRestaurantEntity favoriteRestaurantEntity = favoriteRestaurantRepository.findByFavoriteUserIdAndFavoriteRestaurantId(userEmailId, restaurantId);

            return GetFavoriteCheckResponseDto.success(favoriteRestaurantEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }
}
/* 분석 완료 */