import ResponseDto from "src/apis/response.dto";
import { AdminSignInResponseDto, FindEmailResponseDto, PasswordResetResponseDto, SignInResponseDto } from "src/apis/auth/dto/response";
import { CheckEmailRequestDto, CheckNicknameDto, FindEmailRequestDto, NewPasswordRequestDto, PasswordResetRequestDto, SignInRequestDto, SignUpRequestDto, CheckTelNumberAuthRequestDto, TelNumberAuthRequestDto, businessRegistrationNumberRequestDto, AdminSignInRequestDto } from "src/apis/auth/dto/request";

import axios from "axios";
import { requestErrorHandler, requestHandler } from "src/apis/index";

import { ADMIN_SIGN_IN_REQUEST_URL, BUSINESS_REGISTRATION_REQUEST_PATH, EMAIL_CHECK_REQUEST_URL, FIND_EMAIL_REQUEST_URL, NICKNAME_CHECK_REQUEST_URL, PASSWORD_RESET_REQUEST_URL, PASSWORD_UPDATE_REQUEST_URL, SIGN_IN_REQUEST_URL, SIGN_UP_REQUEST_URL, TEL_NUMBER_AUTH_CHECK_REQUEST_URL, TEL_NUMBER_AUTH_REQUEST_URL } from "src/constant";

// function : 로그인 API 함수
export const signInRequest = async (requestBody: SignInRequestDto) => 
{
    const result = await axios
        .post(SIGN_IN_REQUEST_URL, requestBody)
        .then(requestHandler<SignInResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function : 관리자 로그인 API 함수
export const AdminSignInRequest = async (requestBody: AdminSignInRequestDto) => 
{
    const result = await axios
        .post(ADMIN_SIGN_IN_REQUEST_URL, requestBody)
        .then(requestHandler<AdminSignInResponseDto>)
        .catch(requestErrorHandler);
    return result;
};
{/* 3차 프로젝트 분석완료 */}

// function : 전화번호 인증 번호 전송 API 함수
export const telNumberAuthRequest = async (requestBody: TelNumberAuthRequestDto) => 
{
    const result = await axios
        .post(TEL_NUMBER_AUTH_REQUEST_URL, requestBody)
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function : 전화번호 인증 번호 확인 API 함수
export const telNumberAuthCheckRequest = async (requestBody: CheckTelNumberAuthRequestDto) => 
{
    const result = await axios
        .post(TEL_NUMBER_AUTH_CHECK_REQUEST_URL, requestBody)
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

{/* 3차 프로젝트 분석시작 */}
// function : 이메일 찾기 API 함수
export const findEmailRequest = async (requestBody: FindEmailRequestDto) => 
{
    const result = await axios
        .post(FIND_EMAIL_REQUEST_URL, requestBody)
        .then(requestHandler<FindEmailResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function : 중복된 이메일 확인 API 함수
export const emailCheckRequest = async (requestBody: CheckEmailRequestDto) => 
{
    const result = await axios
        .post(EMAIL_CHECK_REQUEST_URL, requestBody)
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function : 중복된 닉네임 확인 API 함수
export const checkNicknameRequest = async (requestBody: CheckNicknameDto) => 
{
    const result = await axios
        .post(NICKNAME_CHECK_REQUEST_URL, requestBody)
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};
{/* 3차 프로젝트 분석완료 */}

// function : 비밀번호 재설정 링크 전송 API 함수
export const passwordResetRequest = async (requestBody: PasswordResetRequestDto) => 
{
    const result = await axios
        .post(PASSWORD_RESET_REQUEST_URL, requestBody)
        .then(requestHandler<PasswordResetResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function : 새로운 비밀번호 설정 API 함수
export const newPasswordRequest = async (userEmailId: string, requestBody: NewPasswordRequestDto) => 
{
    const result = await axios
        .put(PASSWORD_UPDATE_REQUEST_URL(userEmailId), requestBody)
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};

// function: 사업자등록 인증 API 함수 
export const businessRegistrationNumberRequest = async(requestBody: businessRegistrationNumberRequestDto) => 
{
    const result = await axios
        .post(BUSINESS_REGISTRATION_REQUEST_PATH, requestBody)
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
}

// function : 회원가입 API 함수
export const signUpRequest = async (requestBody: SignUpRequestDto) => 
{
    const result = await axios
        .post(SIGN_UP_REQUEST_URL, requestBody)
        .then(requestHandler<ResponseDto>)
        .catch(requestErrorHandler);
    return result;
};
/* 분석 완료 */