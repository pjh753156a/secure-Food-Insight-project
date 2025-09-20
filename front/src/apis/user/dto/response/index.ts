import ResponseDto from "src/apis/response.dto";

// description: 로그인 유저 정보 반환 Response Body DTO
export interface GetUserInfoResponseDto extends ResponseDto 
{
  userEmailId: string;
  userRole: string;
  businessRegistrationNumber: string;
}

// 3차 프로젝트 분석 시작
// description: 내 정보 불러오기 Response Body DTO
export interface GetMyInfoResponseDto extends ResponseDto
{
  userEmailId: string;
  nickname: string;
  userName: string;
  userTelNumber: string;
  userAddress: string;
  businessRegistrationNumber: string;
  userRole: string;
  joinPath: String;
  password: string;
}
// 3차 프로젝트 분석 완료

// description: 내 정보 수정하기 Response Body DTO
export interface PatchUserInfoResponseDto extends ResponseDto
{
  nickname: string;
  userEmailId: string;
  userName: string;
  userTelNumber: string;
  userAddress: string;
  userRole: string;
  joinPath: String;
}
/* 분석 완료 */