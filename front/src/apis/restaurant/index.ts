import ResponseDto from 'src/apis/response.dto';
import { GetRestaurantIdResponseDto, GetRestaurantInfoResponseDto, GetRestaurantListResponseDto } from 'src/apis/restaurant/dto/response';
import { PatchRestaurantInfoRequestDto, PostRestaurantInfoRequestDto } from 'src/apis/restaurant/dto/request';

import axios from 'axios';
import { bearerAuthorization, requestErrorHandler, requestHandler } from 'src/apis/index';

import { DELETE_RESTAURANT_INFO_DELETE, GET_RESTAURANT_ID_URL, GET_RESTAURANT_URL, GET_SEARCH_RESTAURANT_LIST_URL, PATCH_RESTAURANT_INFO_UPDATE, POST_RESTAURANT_INFO_UPLOAD } from 'src/constant';

// function : 식당 목록 검색 API 함수
export const GetRestaurantListRequest = async (word: string, accessToken: string) => 
{
    const config = {...bearerAuthorization(accessToken), params:{ word:word }};
    const result = await axios.get(GET_SEARCH_RESTAURANT_LIST_URL, config)
        .then(requestHandler<GetRestaurantListResponseDto>)
        .catch(requestErrorHandler);
    return result;
} 
{/* 3차 프로젝트 분석 완료 */}

// function : 특정 식당 정보 검색 API 함수
export const GetRestaurantInfoRequest = async (restaurantId: number|string, accessToken: string) => 
{
    const result = await axios.get(GET_RESTAURANT_URL(restaurantId), bearerAuthorization(accessToken))
        .then(requestHandler<GetRestaurantInfoResponseDto>)
        .catch(requestErrorHandler)
    return result;
} 

// function : 식당 정보 등록 API 함수 
export const PostRestaurantInfoRequest = async (requestBody: PostRestaurantInfoRequestDto, accessToken: string) => 
{
    const result = await axios.post(POST_RESTAURANT_INFO_UPLOAD, requestBody, bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler)
    return result;
} 

// function : 식당 정보 수정 API 함수 
export const PatchRestaurantInfoRequest = async (restaurantId: number|string, requestBody: PatchRestaurantInfoRequestDto, accessToken: string) => 
{
    const result = await axios.patch(PATCH_RESTAURANT_INFO_UPDATE(restaurantId), requestBody, bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler)
    return result;
} 

// function : 식당 정보 삭제 API 함수
export const DeleteRestaurantInfoRequest = async (restaurantId: number|string, accessToken: string) => 
{
    const result = await axios.delete(DELETE_RESTAURANT_INFO_DELETE(restaurantId), bearerAuthorization(accessToken))
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler)
    return result;
}

// function : 식당 아이디 값 불러오기 API 함수
export const getRestaurantIdRequest = async (accessToken: string) => 
{
    const result = await axios.get(GET_RESTAURANT_ID_URL, bearerAuthorization(accessToken))
        .then(requestHandler<GetRestaurantIdResponseDto>)
        .catch(requestErrorHandler)
    return result;
}
/*분석완료*/