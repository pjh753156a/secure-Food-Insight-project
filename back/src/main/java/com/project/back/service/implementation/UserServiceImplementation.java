package com.project.back.service.implementation;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.back.entity.UserEntity;
import com.project.back.service.UserService;
import com.project.back.entity.RestaurantEntity;

import com.project.back.repository.UserRepository;
import com.project.back.repository.ReviewRepository;
import com.project.back.repository.RestaurantRepository;
import com.project.back.repository.ReservationRepository;
import com.project.back.repository.FavoriteRestaurantRepository;

import com.project.back.dto.request.user.DeleteUserRequestDto;
import com.project.back.dto.request.user.MFARequestDto;
import com.project.back.dto.request.user.PatchUserInfoRequestDto;

import com.project.back.dto.response.ResponseDto;
import com.project.back.dto.response.user.GetMyInfoResponseDto;
import com.project.back.dto.response.user.GetUserInfoResponseDto;

import lombok.RequiredArgsConstructor;

import jakarta.transaction.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImplementation implements UserService 
{
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final FavoriteRestaurantRepository favoriteRestaurantRepository;
    private final ReservationRepository reservationRepository;
    private final ReviewRepository reviewRepository;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public ResponseEntity<? super GetUserInfoResponseDto> GetSignInUser(String userEmailId) 
    {
        UserEntity userEntity = null;

        try 
        {
            userEntity = userRepository.findByUserEmailId(userEmailId);
            if (userEntity == null) return ResponseDto.authenticationFailed();
        }
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetUserInfoResponseDto.success(userEntity);
    }

    @Override
    public ResponseEntity<ResponseDto> patchUserInfo(PatchUserInfoRequestDto dto, String userEmailId) 
    {
        try 
        {
            UserEntity userEntity = userRepository.findByUserEmailId(userEmailId);
            if (userEntity == null) return ResponseDto.noExistUser();

            String updateId = userEntity.getUserEmailId();
            boolean isEquals = userEmailId.equals(updateId);
            if (!isEquals) return ResponseDto.authorizationFailed();

            userEntity.update(dto);
            userRepository.save(userEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }

    /* 3차 프로젝트 분석시작 */
    @Override
    @Transactional
    public ResponseEntity<ResponseDto> deleteUser(DeleteUserRequestDto dto, String userEmailId) 
    {
        try 
        {
            UserEntity userEntity = userRepository.findByUserEmailId(userEmailId);

            RestaurantEntity restaurantEntity = restaurantRepository.findByRestaurantWriterId(userEmailId);
            if (userEntity == null) return ResponseDto.noExistUser();

            String deleteId = userEntity.getUserEmailId();
            boolean isEquals = userEmailId.equals(deleteId);
            if (!isEquals) return ResponseDto.authorizationFailed();

            String password = dto.getPassword();
            String encodedPassword = userEntity.getPassword();

            boolean isMatched = passwordEncoder.matches(password, encodedPassword);
            if (!isMatched) return ResponseDto.noExistUser();
            
            String userRole = userEntity.getUserRole();

            if ("ROLE_CEO".equals(userRole)) 
            {
                restaurantRepository.delete(restaurantEntity);
            } 
            else 
            {
                favoriteRestaurantRepository.deleteByFavoriteUserId(userEmailId);
                reservationRepository.deleteByReservationUserId(userEmailId);
                reviewRepository.deleteByReviewWriterId(userEmailId);
            }
            userRepository.delete(userEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }
    /* 3차 프로젝트 분석완료 */


    @Override
    @Transactional
    public ResponseEntity<ResponseDto> mfa(MFARequestDto dto, String userEmailId) 
    {
        try 
        {
            UserEntity userEntity = userRepository.findByUserEmailId(userEmailId);
            if (userEntity == null) return ResponseDto.authenticationFailed();

            String password = dto.getPassword();
            String encodedPassword = userEntity.getPassword();

            boolean isMatched = passwordEncoder.matches(password, encodedPassword);
            if (!isMatched) return ResponseDto.noExistUser();
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }
    
    // 3차 프로젝트 분석 시작
    @Override
    public ResponseEntity<? super GetMyInfoResponseDto> getMyInfo(String userEmailId) 
    {
        UserEntity userEntity = null;
        try 
        {
            userEntity = userRepository.findByUserEmailId(userEmailId);
            if(userEntity == null) return ResponseDto.authenticationFailed();
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetMyInfoResponseDto.success(userEntity);
    }
}
// 3차 프로젝트 분석 완료
//boolean isMatched = userEntity.getUserRole().equals("ROLE_ADMIN");
//if(!isMatched) return ResponseDto.authenticationFailed();
