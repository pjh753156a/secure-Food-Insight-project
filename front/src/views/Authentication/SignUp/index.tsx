import { useNavigate } from 'react-router';
import { ChangeEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import InputBox from 'src/components/InputBox';

import ResponseDto from 'src/apis/response.dto';
import { CheckEmailRequestDto, CheckNicknameDto, SignUpRequestDto, CheckTelNumberAuthRequestDto, TelNumberAuthRequestDto, businessRegistrationNumberRequestDto } from 'src/apis/auth/dto/request';

import { businessRegistrationNumberRequest, checkNicknameRequest, emailCheckRequest, signUpRequest, telNumberAuthCheckRequest, telNumberAuthRequest } from 'src/apis/auth';

import { SIGN_IN_ABSOLUTE_PATH, emailIdPatternType, passwordPatternType, userTelNumberPatternType } from 'src/constant';

import './style.css';

// component: 회원가입 //
export default function SignUp() 
{
  // state //
  const [searchParam] = useSearchParams();
  const [emailId, setEmailId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [authNumber, setAuthNumber] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [userTelNumber, setUserTelNumber] = useState<string>('');
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState<string>('');
  const [emailIdButtonStatus, setEmailIdButtonStatus] = useState<boolean>(false);
  
  const [nicknameButtonStatus, setNicknameButtonStatus] = useState<boolean>(false);
  const [authNumberButtonStatus, setAuthNumberButtonStatus] = useState<boolean>(false);
  const [userTelNumberButtonStatus, setUserTelNumberButtonStatus] = useState<boolean>(false);
  const [businessRegistrationNumberButtonStatus, setBusinessRegistrationNumberButtonStatus] = useState<boolean>(false);

  const [isEmailIdCheck, setEmailIdCheck] = useState<boolean>(false);
  const [isEqualPassword, setEqualPassword] = useState<boolean>(false);
  const [isNicknameCheck, setNicknameCheck] = useState<boolean>(false);
  const [isEmailIdPattern, setEmailIdPattern] = useState<boolean>(false);
  const [isPasswordPattern, setPasswordPattern] = useState<boolean>(false);
  const [isAuthNumberCheck, setAuthNumberCheck] = useState<boolean>(false);
  const [isUserTelNumberCheck, setUserTelNumberCheck] = useState<boolean>(false);
  const [isUserTelNumberPattern, setUserTelNumberPattern] = useState<boolean>(false);

  const [emailIdMessage, setEmailIdMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [nicknameMessage, setNicknameMessage] = useState<string>('');
  const [UserNameMessage, setUserNameMessage] = useState<string>('');
  const [authNumberMessage, setAuthNumberMessage] = useState<string>('');
  const [userAddressMessage, setUserAddressMessage] = useState<string>('');
  const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
  const [userTelNumberMessage, setUserTelNumberMessage] = useState<string>('');
  const [businessRegistrationNumberMessage, setBusinessRegistrationNumberMessage] = useState<string>('');
  
  const [isEmailIdError, setEmailIdError] = useState<boolean>(false);
  
  const [isNicknameError, setNicknameError] = useState<boolean>(false);
  const [isAuthNumberError, setAuthNumberError] = useState<boolean>(false);
  const [isUserTelNumberError, setUserTelNumberError] = useState<boolean>(false);
  const [isBusinessRegistrationNumberError, setBusinessRegistrationNumberError] = useState<boolean>(false);
  
  const isSignUpActive = isEmailIdCheck && isEmailIdPattern && isEqualPassword && isPasswordPattern && isNicknameCheck && isUserTelNumberCheck && isUserTelNumberPattern && isAuthNumberCheck;
  const signUpButtonClass = `${isSignUpActive ? 'primary' : 'disable'}-button full-width`;

  /* 3차 프로젝트 분석시작 */
  // function //
  const navigation = useNavigate();
  
  const emailCheckResponse = (result: ResponseDto | null) => 
  {
    const emailMessage = 
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'VF' ? '이메일 형식에 맞지 않습니다.' :
      result.code === 'DE' ?  '이미 사용중인 이메일입니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' :
      result.code === 'SU' ? '사용 가능한 이메일입니다.' : '';

    const emailCheck =  result !== null && result.code === 'SU';
    const emailError = !emailCheck;
    setEmailIdMessage(emailMessage);
    setEmailIdCheck(emailCheck);
    setEmailIdError(emailError);
  };

  const nicknameCheckResponse = (result: ResponseDto | null) => 
  {
    const nicknameMessage = 
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'VF' ? '닉네임은 빈 값 혹은 공백으로만 이루어질 수 없습니다.' :
      result.code === 'DN' ?  '이미 사용중인 닉네임입니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' :
      result.code === 'SU' ? '사용 가능한 닉네임입니다.' : '';

    const nicknameError = !(result && result.code === 'SU');
    const nicknameCheck = !nicknameError;
    setNicknameMessage(nicknameMessage);
    setNicknameError(nicknameError);
    setNicknameCheck(nicknameCheck);
  };

  const userTelNumberResponse = (result: ResponseDto | null) => 
  {
    const userTelNumberMessage = 
      !result ? '서버에 문제가 있습니다.' : 
      result.code === 'VF' ? '인증번호를 입력해주세요.' : 
      result.code === 'SF' ? '인증번호 전송이 실패하였습니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' :
      result.code === 'SU' ? '인증번호가 전송되었습니다.' : '';

    const userTelNumberCheck = result !== null && result.code === 'SU';
    const UserTelNumberError = !userTelNumberCheck;
    setUserTelNumberMessage(userTelNumberMessage);
    setUserTelNumberCheck(userTelNumberCheck);
    setUserTelNumberError(UserTelNumberError);
  };

  const userTelNumberCheckResponse = (result: ResponseDto | null) => 
  {
    const authNumberMessage = 
      !result ? '서버에 문제가 있습니다.' : 
      result.code === 'VF' ? '인증번호를 입력해주세요.' : 
      result.code === 'AF' ? '인증번호가 일치하지 않습니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' :
      result.code === 'SU' ? '인증번호가 확인되었습니다.' : '';

    const authNumberCheck = result !== null && result.code === 'SU';
    const authNumberError = !authNumberCheck;
    setAuthNumberMessage(authNumberMessage);
    setAuthNumberCheck(authNumberCheck);
    setAuthNumberError(authNumberError);
  };
  /* 3차 프로젝트 분석완료 */

  const businessRegistrationNumberResponse = (result: ResponseDto | null) => 
  {
    const businessRegistrationNumberMessage = 
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'DR' ? '이미 사용중인 사업자번호 입니다.' :
      result.code === 'AF' ? '권한이 없습니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' :
      result.code === 'SU' ? '사업자번호가 확인되었습니다.' : '' ;

    const businessRegistrationNumberError = !(result && result.code ==='SU');
    setBusinessRegistrationNumberMessage(businessRegistrationNumberMessage);
    setBusinessRegistrationNumberError(businessRegistrationNumberError);
  }
  
  const signUpResponse = (result: ResponseDto | null) => 
  {
    const message = 
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'VF' ? '입력 형식이 맞지 않습니다.' : 
      result.code === 'DE' ? '중복된 이메일입니다.' :
      result.code === 'DN' ? '중복된 닉네임입니다.' :
      result.code === 'SF' ? '인증번호 전송 실패했습니다.' :
      result.code === 'AF' ? '인증번호가 일치하지 않습니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' : '' ;

    const isSuccess = result && result.code === 'SU';
    if (!isSuccess) 
    {
      alert(message);
      return;
    }

    navigation(SIGN_IN_ABSOLUTE_PATH);
  };
  
  {/* 3차 프로젝트 분석시작 */}
  // event handler // 
  const onEmailIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const {value} = event.target;
    setEmailId(value);
    setEmailIdButtonStatus(value !== '');
    setEmailIdCheck(false);
    setEmailIdMessage('');
  };
  
  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const {value} = event.target;
    setPassword(value);

    const passwordPattern = passwordPatternType;
    const isPasswordPattern = passwordPattern.test(value);
    setPasswordPattern(isPasswordPattern);

    const passwordMessage = 
      isPasswordPattern ? '' : 
      value ? '8글자 이상 영문+숫자+특수문자로 입력해 주세요.' : '';
    setPasswordMessage(passwordMessage);

    const isEqualPassword = passwordCheck === value;
      setEqualPassword(isEqualPassword);

    const passwordCheckMessage = 
      isEqualPassword ? '' : 
      passwordCheck ? '비밀번호가 일치하지 않습니다.' : '';
    setPasswordCheckMessage(passwordCheckMessage);
  };
  {/* 3차 프로젝트 분석완료 */}

  const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const {value} = event.target;
    setPasswordCheck(value);

    const isEqualPassword = password === value;
    setEqualPassword(isEqualPassword);

    const passwordCheckMessage = 
      isEqualPassword ? '' : 
      value ? '비밀번호가 일치하지 않습니다.' : '';
    setPasswordCheckMessage(passwordCheckMessage);
  };

  {/* 3차 프로젝트 분석시작 */}
  const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const { value } = event.target;
    setNickname(value);
    setNicknameButtonStatus(value !== '');
    setNicknameCheck(false);
    setNicknameMessage('');
  };
  {/* 3차 프로젝트 분석완료 */}

  const onUserNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const { value } = event.target;
    setUserName(value);
    setUserNameMessage('');
  };

  const onUserTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const { value } = event.target;
    setUserTelNumber(value);
    setUserTelNumberButtonStatus(value !== '');
    setUserTelNumberCheck(false);
    setAuthNumberCheck(false);
    setUserTelNumberMessage('');
  };

  const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const { value } = event.target;
    setAuthNumber(value);
    setAuthNumberButtonStatus(value !== '');
    setAuthNumberCheck(false);
    setAuthNumberMessage('');
  };
  
  const onUserAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const { value } = event.target;
    setUserAddress(value);
    setUserAddressMessage('');
  };

  const onBusinessRegistrationNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const {value} = event.target;
    setBusinessRegistrationNumber(value);
    setBusinessRegistrationNumberButtonStatus(value !== '');
    setBusinessRegistrationNumberMessage('');
  };
  
  {/* 3차 프로젝트 분석시작 */}
  const onEmailIdButtonClickHandler = () => 
  {
    if(!emailIdButtonStatus) return;

    const emailIdPattern = emailIdPatternType;
    const isEmailIdPattern = emailIdPattern.test(emailId);
    setEmailIdPattern(isEmailIdPattern);

    if (!isEmailIdPattern) 
    {
      setEmailIdMessage('이메일 형식이 아닙니다.');
      setEmailIdError(true);
      setEmailIdCheck(false);
      return;
    }

    const requestBody: CheckEmailRequestDto = { userEmailId: emailId };
    emailCheckRequest(requestBody).then(emailCheckResponse);
  };

  const onNicknameButtonClickHandler = () => 
  {
    if(!nicknameButtonStatus) return;
    if(!nickname || !nickname.trim()) return;

    const requestBody: CheckNicknameDto = { nickname: nickname };
    checkNicknameRequest(requestBody).then(nicknameCheckResponse);
  };

  const onUserTelNumberButtonClickHandler = () => 
  {
    if(!userTelNumberButtonStatus) return;

    const userTelNumberPattern = userTelNumberPatternType;
    const isUserTelNumberPattern = userTelNumberPattern.test(userTelNumber);
    setUserTelNumberPattern(isUserTelNumberPattern);

    if (!isUserTelNumberPattern) 
    {
      setUserTelNumberMessage('전화번호 형식이 아닙니다.');
      setUserTelNumberError(true);
      setUserTelNumberCheck(false);
      return;
    }

    const requestBody: TelNumberAuthRequestDto = { userTelNumber: userTelNumber };
    telNumberAuthRequest(requestBody).then(userTelNumberResponse);
  };
  
  const onAuthNumberButtonClickHandler = () => 
  {
    if(!authNumber) return;

    const requestBody: CheckTelNumberAuthRequestDto = 
    {
      userTelNumber: userTelNumber,
      authNumber
    };
    telNumberAuthCheckRequest(requestBody).then(userTelNumberCheckResponse);
  };
  {/* 3차 프로젝트 분석완료 */}

  const onBusinessRegistrationButtonClickHandler = () => 
  {
    if (!businessRegistrationNumberButtonStatus) return;
    const requestBody: businessRegistrationNumberRequestDto = {businessRegistrationNumber : businessRegistrationNumber};
    businessRegistrationNumberRequest(requestBody).then(businessRegistrationNumberResponse);
  };

  /* 3차 프로젝트 분석 시작 */
  const onSignUpButtonClickHandler = () => 
  {
    if(!isSignUpActive) return;
    if(!emailId || !password || !passwordCheck || !nickname || !userName || !userTelNumber ||!authNumber || !userAddress) 
    {
      alert('모든 내용을 입력해주세요.');
      return;
    }
  
    let joinPath = searchParam.get('joinPath');
    joinPath = joinPath === null ? 'HOME' : joinPath;
    const snsId = searchParam.get('snsId');

    const requestBody: SignUpRequestDto = 
    {
      userEmailId: emailId,
      password: password,
      nickname: nickname,
      userName: userName,
      userTelNumber: userTelNumber,
      authNumber: authNumber,
      userAddress: userAddress,
      businessRegistrationNumber: businessRegistrationNumber,
      joinPath,
      snsId
    }

    signUpRequest(requestBody).then(signUpResponse);
  };
  {/* 3차 프로젝트 분석완료 */}
  
  //   render   //
  return(
    <div id='sign-up-wrapper'>
      <div className="sign-up-contents-box">
        <div className="sign-up-title">회원가입</div>
        <div className="sign-up-container">
          <div className="sign-up-input-container">
              {/* 3차 프로젝트 분석시작 */}
              <InputBox type="text" value={emailId} placeholder="이메일을 입력해주세요" onChangeHandler={onEmailIdChangeHandler} buttonTitle="중복 확인" buttonStatus={emailIdButtonStatus} onButtonClickHandler={onEmailIdButtonClickHandler} message={emailIdMessage} error={isEmailIdError} />
              <InputBox type="password" value={password} placeholder="비밀번호를 입력해주세요" 
              onChangeHandler={onPasswordChangeHandler} message={passwordMessage} error />
              {/* 3차 프로젝트 분석완료 */}
              <InputBox type="password" value={passwordCheck} placeholder="비밀번호를 입력해주세요" 
              onChangeHandler={onPasswordCheckChangeHandler} message={passwordCheckMessage} error />
              {/* 3차 프로젝트 분석시작 */}
              <InputBox type="text" value={nickname} placeholder="닉네임을 입력해주세요" onChangeHandler={onNicknameChangeHandler} buttonTitle="중복 확인" buttonStatus={nicknameButtonStatus} onButtonClickHandler={onNicknameButtonClickHandler} message={nicknameMessage} error={isNicknameError} />
              {/* 3차 프로젝트 분석완료 */}
              <InputBox type="text" value={userName} placeholder="이름을 입력해주세요" onChangeHandler={onUserNameChangeHandler} message={UserNameMessage} error />
              {/* 3차 프로젝트 분석시작 */}
              <InputBox type="text" value={userTelNumber} placeholder="전화번호를 입력해주세요" onChangeHandler={onUserTelNumberChangeHandler} buttonTitle="인증번호 전송" buttonStatus={userTelNumberButtonStatus} onButtonClickHandler={onUserTelNumberButtonClickHandler} message={userTelNumberMessage} error={isUserTelNumberError} />
              {isUserTelNumberCheck && 
              <InputBox  type="text" value={authNumber} placeholder="인증번호 6자리를 입력해주세요" onChangeHandler={onAuthNumberChangeHandler} buttonTitle="인증 확인" buttonStatus={authNumberButtonStatus} onButtonClickHandler={onAuthNumberButtonClickHandler} message={authNumberMessage} error={isAuthNumberError} />}
              {/* 3차 프로젝트 분석완료 */}
              <InputBox type="text" value={userAddress} placeholder="주소를 입력해주세요" onChangeHandler={onUserAddressChangeHandler} message={userAddressMessage} />
              <InputBox type="text" value={businessRegistrationNumber} placeholder="사업자등록번호를 입력해주세요" buttonTitle="중복 확인" buttonStatus={businessRegistrationNumberButtonStatus} onChangeHandler={onBusinessRegistrationNumberChangeHandler} onButtonClickHandler={onBusinessRegistrationButtonClickHandler} message={businessRegistrationNumberMessage} error={isBusinessRegistrationNumberError}/>
          </div>
          {/* 3차 프로젝트 분석시작 */}
          <div className="sign-up-button-container">
              <div className={signUpButtonClass} onClick={onSignUpButtonClickHandler}>회원가입</div>
              {/* 3차 프로젝트 분석완료 */}
              <div className="text-link" onClick={() => {navigation(SIGN_IN_ABSOLUTE_PATH)}}>로그인</div>
          </div>
        </div>
    </div>
  </div>  
  );
}
{/* 분석 완료 */}