// description: 로그인 Request Body DTO
export interface SignInRequestDto 
{
    userEmailId: string;
    password: string;
}

// description: 관리자 로그인 Request Body DTO
export interface AdminSignInRequestDto 
{
    userEmailId: string;
    password: string;
}

// description: 전화번호 인증 번호 전송 Request Body DTO
export interface TelNumberAuthRequestDto 
{
    userTelNumber: string;
}

// description: 전화번호 인증 번호 확인 Request Body DTO
export interface CheckTelNumberAuthRequestDto 
{
    userTelNumber: string;
    authNumber: string;
}

// description: 인증 번호 확인 Request Body DTO
export interface CheckAuthNumberRequestDto 
{
    userTelNumber: string;
    authNumber: string;
}

// description: 이메일 찾기 Request Body DTO
export interface FindEmailRequestDto 
{
    userName: string;
    userTelNumber: string;
}

// description: 중복된 이메일 확인 Request Body DTO
export interface CheckEmailRequestDto 
{
    userEmailId: string;
}

// description: 중복된 닉네임 확인 Request Body DTO
export interface CheckNicknameDto 
{
    nickname: string;
}

// description: 비밀번호 재설정 링크 전송 Request Body DTO
export interface PasswordResetRequestDto 
{
    userEmailId: string;
    userTelNumber: string;
}

// description: 새로운 비밀번호 설정 Request Body DTO
export interface NewPasswordRequestDto 
{
    password: string;
    // linkCode: string;
}
{/* 3차 프로젝트 분석완료 */}

// description: 사업자등록 번호 Request Body DTO
export interface businessRegistrationNumberRequestDto 
{
    businessRegistrationNumber: string;
}

/* 3차 프로젝트 분석시작 */
// description: 회원가입 Request Body DTO
export interface SignUpRequestDto 
{
    userEmailId: string;
    password: string;
    nickname: string;
    userName: string;
    userTelNumber: string;
    authNumber: string;
    userAddress: string;
    joinPath: string;
    snsId: string | null;
    businessRegistrationNumber: string;
}
/* 3차 프로젝트 분석완료 */