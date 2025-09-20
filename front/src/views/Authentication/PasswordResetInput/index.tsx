import { useNavigate } from 'react-router';
import { ChangeEvent, useState } from 'react';

import InputBox from 'src/components/InputBox';

import ResponseDto from 'src/apis/response.dto';
import { CheckAuthNumberRequestDto, PasswordResetRequestDto } from 'src/apis/auth/dto/request';

import { passwordResetRequest, telNumberAuthCheckRequest } from 'src/apis/auth';

import { PASSWORD_RESET_CHECK_ABSOLUTE_PATH } from 'src/constant';

import './style.css';
import { PasswordResetResponseDto } from 'src/apis/auth/dto/response';
import { useAuthStore, useUserStore } from 'src/stores';

// component: 비밀번호 재설정(이메일 비밀번호) // 
export default function PasswordResetInput() 
{

  // state //
  const [authNumber, setAuthNumber] = useState<string>('');
  const [userEmailId, setUserEmailId] = useState<string>('');
  const [userTelNumber, setUserTelNumber] = useState<string>('');
  const [isUserEmailId, setIsUserEmailId] = useState<boolean>(false);
  const [isUserTelNumber, setIsUserTelNumber] = useState<boolean>(false);
  const { tempAccessToken, setTempAccessToken }  = useAuthStore();
  const [isSuccess, setIsSuccess] = useState<boolean|null>(false);

  const isAuthNumberCheck = isSuccess && isUserEmailId && isUserTelNumber;
  const passwordResetInputButtonClass = `${userEmailId && userTelNumber ? 'primary' : 'disable'}-button full-width`;
  const authNumberInputButtonClass = `${authNumber ? 'primary' : 'disable'}-button full-width`;

  // function //
  const navigation = useNavigate();

  /* 3차 프로젝트 분석시작 */
  const passwordResetResponse = (result: PasswordResetResponseDto | ResponseDto | null) => 
  {

    const message = 
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'VF' ? '입력 형식이 맞지 않습니다.' : 
      result.code === 'AF' ? '사용자 정보와 불일치 합니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' : ''

    const isSuccess = result && result.code === 'SU';
    setIsSuccess(isSuccess);
    if (!isSuccess) 
    {
      alert(message);
      return;
    }
    alert("인증번호가 전송되었습니다.");

    const { tempAccessToken } = result as PasswordResetResponseDto;

    setTempAccessToken(tempAccessToken);
    setIsUserEmailId(true);
    setIsUserTelNumber(true);
  };

  const userTelNumberCheckResponse = (result: ResponseDto | null) => 
    {
      const authNumberMessage = 
        !result ? '서버에 문제가 있습니다.' : 
        result.code === 'VF' ? '인증번호를 입력해주세요.' : 
        result.code === 'AF' ? '인증번호가 일치하지 않습니다.' :
        result.code === 'DBE' ? '서버에 문제가 있습니다.' :
        result.code === 'SU' ? '인증번호가 확인되었습니다.' : '';

      alert(authNumberMessage);
        
      if (result == null || result.code !== 'SU') 
      {
        return;
      }

      navigation(PASSWORD_RESET_CHECK_ABSOLUTE_PATH);  
    };
  
  // event handler //
  const onEmailIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const {value} = event.target;
    setUserEmailId(value);
    setIsUserEmailId(false);
  };

  const onUserTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const { value } = event.target;
    setUserTelNumber(value);
    setIsUserTelNumber(false);
  };

  const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const { value } = event.target;
    setAuthNumber(value);
  };

  const onPasswordResetButtonClickHandler = () => 
  {
    if(!userEmailId || !userTelNumber) 
    {
      alert('모든 내용을 입력해주세요.');
      return;
    }

    const requestBody: PasswordResetRequestDto = 
    {
      userEmailId: userEmailId,
      userTelNumber: userTelNumber
    }
    passwordResetRequest(requestBody).then(passwordResetResponse);
  };
  {/* 3차 프로젝트 분석완료 */}

  const onAuthNumberButtonClickHandler = () => 
  {
      if(!authNumber) return;
  
      const requestBody: CheckAuthNumberRequestDto = 
      {
        userTelNumber: userTelNumber,
        authNumber
      };
      telNumberAuthCheckRequest(requestBody).then(userTelNumberCheckResponse);
  };
  
  return (
    <div id='authentication-wrapper'>
      <div className='reset-password-container'>
        <div className='reset-password-title'>비밀번호 재설정</div>
        <div className='reset-password-box'>
          {/* 3차 프로젝트 분석시작 */}
          <div className='reset-password-input-container'>
            <InputBox type="text" value={userEmailId} placeholder="이메일을 입력해주세요" onChangeHandler={onEmailIdChangeHandler} />
            <InputBox type="text" value={userTelNumber} placeholder="전화번호를 입력해주세요" onChangeHandler={onUserTelNumberChangeHandler} />
          </div>
          <div className={passwordResetInputButtonClass} onClick={onPasswordResetButtonClickHandler}>인증번호 전송</div>
          {isAuthNumberCheck &&
          <>
          <div className='reset-password-input-container'>
            <InputBox type="text" value={authNumber} placeholder="인증번호를 입력해 주세요" onChangeHandler={onAuthNumberChangeHandler} />
          </div>
          <div className={authNumberInputButtonClass} onClick={onAuthNumberButtonClickHandler}>인증 확인</div>
          </>}
        </div>
      </div>
    </div>
  )
}
{/* 3차 프로젝트 분석완료 */}

