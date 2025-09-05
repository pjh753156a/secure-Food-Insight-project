// description: 비밀번호 재확인 Request Body DTO
export interface PasswordRecheckRequestDto {
    password: string;
}

{/*분석 시작*/}
// description: 회원정보 수정 Request Body DTO
export interface PatchUserInfoRequestDto 
{
    nickname: string;
    userAddress: string;
    password: string;
}

// description: 회원 탈퇴 Request Body DTO
export interface DeleteUserRequestDto 
{
    password: string;
}
{/*분석 완료*/}
