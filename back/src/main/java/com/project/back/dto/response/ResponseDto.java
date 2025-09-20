package com.project.back.dto.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import lombok.Getter;
import lombok.AllArgsConstructor;

@Getter
@AllArgsConstructor
public class ResponseDto
{
    public static Object favoriteRestaurantEntity;
    private String code;
    private String message;

    public static ResponseEntity<ResponseDto> success() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> noExistUser() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.NOT_FOUND_USER,ResponseMessage.NOT_FOUND_USER);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseBody);
    }
    /* 3차 프로젝트 분석완료 */

    public static ResponseEntity<ResponseDto> passwordDiscord() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.PASSWORD_DISCORD,ResponseMessage.PASSWORD_DISCORD);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

    /* 3차 프로젝트 분석시작 */
    public static ResponseEntity<ResponseDto> signInFailed() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.SIGN_IN_FAILED,ResponseMessage.SIGN_IN_FAILED);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
    /* 3차 프로젝트 분석완료 */
    
    public static ResponseEntity<ResponseDto> databaseError() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.DATABASE_ERROR,ResponseMessage.DATABASE_ERROR);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> noExistReview() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.NO_EXIST_REVIEW,ResponseMessage.NO_EXIST_REVIEW);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

    /* 3차 프로젝트 분석시작 */
    public static ResponseEntity<ResponseDto> writtenComment() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.WRITTEN_COMMENT ,ResponseMessage.WRITTEN_COMMENT);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
    /* 3차 프로젝트 분석완료 */

    public static ResponseEntity<ResponseDto> validationFailed() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.VALIDATION_FAILED,ResponseMessage.VALIDATION_FAILED);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
    
    /* 3차 프로젝트 분석시작 */
    public static ResponseEntity<ResponseDto> duplicatedEmailId() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATED_EMAIL_ID,ResponseMessage.DUPLICATED_EMAIL_ID);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> duplicatedNickname() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATED_NICKNAME,ResponseMessage.DUPLICATED_NICKNAME);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
    
    public static ResponseEntity<ResponseDto> noExistRestaurant() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.NO_EXIST_RESTAURANT,ResponseMessage.NO_EXIST_RESTAURANT);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
    
    public static ResponseEntity<ResponseDto> authorizationFailed() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.AUTHORIZATION_FAILED,ResponseMessage.AUTHORIZATION_FAILED);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(responseBody);
    }
    /* 3차 프로젝트 분석완료 */
    
    public static ResponseEntity<ResponseDto> noExistReservation() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.NO_EXIST_RESERVATION,ResponseMessage.NO_EXIST_RESERVATION);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
    
    /* 3차 프로젝트 분석시작 */
    public static ResponseEntity<ResponseDto> authenticationFailed() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.AUTHENTICATION_FAILED,ResponseMessage.AUTHENTICATION_FAILED);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> noExistNoticeBoard() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.NO_EXIST_NOTICE_BOARD,ResponseMessage.NO_EXIST_NOTICE_BOARD);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
    /* 3차 프로젝트 분석완료 */
    
    public static ResponseEntity<ResponseDto> tokenCreationFailed() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.TOKEN_CREATION_FAILED,ResponseMessage.TOKEN_CREATION_FAILED);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    }

    /* 3차 프로젝트 분석시작 */
    public static ResponseEntity<ResponseDto> noExistInquiryBoard() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.NO_EXIST_INQUIRY_BOARD,ResponseMessage.NO_EXIST_INQUIRY_BOARD);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
    /* 3차 프로젝트 분석완료 */

    public static ResponseEntity<ResponseDto> authNumberSendFailed() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.AUTH_NUMBER_SEND_FAILED,ResponseMessage.AUTH_NUMBER_SEND_FAILED);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    }
        
    /* 3차 프로젝트 분석시작 */
    public static ResponseEntity<ResponseDto> duplicatedBusinessRegistrationNumber() 
    {
        ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATED_BUSINESS_REGISTRATION_NUMBER,ResponseMessage.DUPLICATED_BUSINESS_REGISTRATION_NUMBER);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
}
/* 3차 프로젝트 분석완료 */