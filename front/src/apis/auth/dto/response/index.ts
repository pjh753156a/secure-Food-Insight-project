import ResponseDto from "src/apis/response.dto";

// description: 로그인 Response Body DTO
export interface SignInResponseDto extends ResponseDto 
{
  accessToken: string;
  expires: number;
}

// description: 관리자 로그인 Response Body DTO
export interface AdminSignInResponseDto extends ResponseDto 
{
  accessToken: string;
  expires: number;
}

// description: 아이디(이메일) 찾기 Response Body DTO
export interface FindEmailResponseDto extends ResponseDto 
{
  userEmailId: string;
}
{/* 3차 프로젝트 분석완료 */}

// description: 비밀번호 재설정 요청 링크 전송 Response Body DTO
export interface PasswordResetResponseDto extends ResponseDto 
{
  passwordResetLink: string;
}
/* 분석 완료 */