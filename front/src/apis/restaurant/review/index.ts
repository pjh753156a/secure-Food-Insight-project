import ResponseDto from 'src/apis/response.dto';
import { PatchReviewRequestDto, PostReviewRequestDto } from 'src/apis/restaurant/review/dto/request';
import { GetReviewListResponseDto, GetReviewResponseDto } from 'src/apis/restaurant/review/dto/response';

import axios from 'axios';
import { bearerAuthorization, requestErrorHandler, requestHandler } from 'src/apis';

import { DELETE_REVIEW_REQUEST_URL, GET_REVIEW_DETAILS_LIST_URL, GET_REVIEW_DETAIL_URL, PATCH_REVIEW_REQUEST_URL, POST_REVIEW_REQUEST_URL } from 'src/constant';

{/* 3차 프로젝트 분석 시작 */}
// function : 식당 리뷰 작성 API 함수 
export const PostReviewRequest = async (restaurantId: number|string, requestBody: PostReviewRequestDto, accessToken: string) => 
{
    const result = await axios.post(POST_REVIEW_REQUEST_URL(restaurantId), requestBody, bearerAuthorization(accessToken))
    .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler)
    return result;
}
{/* 3차 프로젝트 분석 완료 */}

// function : 식당 리뷰 수정 API 함수 
export const PatchReviewRequest = async (reviewNumber: number|string, requestBody: PatchReviewRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_REVIEW_REQUEST_URL(reviewNumber), requestBody, bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler)
    return result;
}

// function : 식당 리뷰 삭제 API 함수 
export const DeleteReviewRequest = async (reviewNumber: number|string, accessToken: string) => 
{
    const result = await axios.delete(DELETE_REVIEW_REQUEST_URL(reviewNumber), bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler)
    return result;
} 

// function : 식당 리뷰 내역 목록 확인 API 함수
export const GetReviewDetailsRequest = async (accessToken: string) => 
{
    const result = await axios.get(GET_REVIEW_DETAILS_LIST_URL, bearerAuthorization(accessToken))
        .then(requestHandler<GetReviewListResponseDto>)
        .catch(requestErrorHandler)
    return result;
} 

// function : 식당 리뷰 내역 확인 API 함수
export const GetReviewDetailRequest  = async (reviewNumber: number|string, accessToken: string) => 
{
    const result = await axios.get(GET_REVIEW_DETAIL_URL(reviewNumber), bearerAuthorization(accessToken))
        .then(requestHandler<GetReviewResponseDto>)
        .catch(requestErrorHandler)
    return result;
} 
/* /분석 완료/ */