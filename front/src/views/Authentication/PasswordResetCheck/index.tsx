import { ChangeEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import InputBox from 'src/components/InputBox';

import ResponseDto from 'src/apis/response.dto';
import { NewPasswordRequestDto } from 'src/apis/auth/dto/request';

import { newPasswordRequest } from 'src/apis/auth';

import { SIGN_IN_ABSOLUTE_PATH, passwordPatternType } from 'src/constant';

import './style.css';

// component: 비밀번호 재설정 // 
export default function PasswordResetCheck() 
{
  // state //
  const { userEmailId } = useParams();
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [isEqualPassword, setEqualPassword] = useState<boolean>(false);
  const [isPasswordPattern, setPasswordPattern] = useState<boolean>(false);
  const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');

  const isResetPasswordCheckActive = isPasswordPattern && isEqualPassword;
  const passwordResetCheckButtonClass = `${isResetPasswordCheckActive ? 'primary' : 'disable'}-button full-width`;

  // function //
  const navigation = useNavigate();

  const passwordResetCheckResponse = (result: ResponseDto | null) => 
  {

    const message = 
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'VF' ? '입력 형식이 맞지 않습니다.' : 
      result.code === 'NU' ? '유저 정보를 찾을 수 없습니다.' : 
      result.code === 'DBE' ? '서버에 문제가 있습니다.' : ''

    const isSuccess = result && result.code === 'SU';
    if (!isSuccess) 
    {
      alert(message);
      return;
    }
    navigation(SIGN_IN_ABSOLUTE_PATH);
  };

  // event handler //
  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const {value} = event.target;
    setPassword(value);

    const passwordPattern = passwordPatternType;
    const isPasswordPattern = passwordPattern.test(value);
    setPasswordPattern(isPasswordPattern);

    const passwordMessage = 
      isPasswordPattern ? '' :
      value ? '4글자 이상 입력해주세요.' : '';
    setPasswordMessage(passwordMessage);

    const isEqualPassword = passwordCheck === value;
      setEqualPassword(isEqualPassword);

    const passwordCheckMessage = 
      isEqualPassword ? '' : 
      passwordCheck ? '비밀번호가 일치하지 않습니다.' : '';
    setPasswordCheckMessage(passwordCheckMessage);
  };

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
  
  const onPasswordResetCheckButtonClickHandler = () => 
  {
    if(!isResetPasswordCheckActive || !userEmailId) return;
    if(!password || !passwordCheck) 
    {
      alert('모든 내용을 입력해주세요.');
      return;
    }
    alert('비밀번호가 성공적으로 변경되었습니다. \n새로운 비밀번호는 ' + password + ' 입니다.');

    const requestBody: NewPasswordRequestDto = 
    {
      password: password
    }
    newPasswordRequest(userEmailId, requestBody).then(passwordResetCheckResponse);
  };
  
  // render //
  return (
    <div id='authentication-wrapper'>
      <div className='reset-password-container'>
        <div className='reset-password-title'>비밀번호 재설정</div>
        <div className='reset-password-box'>
          <div className='reset-password-input-container'>
            <InputBox type="text" value={password} placeholder="새 비밀번호를 입력해주세요" onChangeHandler={onPasswordChangeHandler} message={passwordMessage} error />
            <InputBox type="text" value={passwordCheck} placeholder="새 비밀번호를 입력해주세요" onChangeHandler={onPasswordCheckChangeHandler} message={passwordCheckMessage} error />
          </div>
          <div className={passwordResetCheckButtonClass} onClick={onPasswordResetCheckButtonClickHandler}>재설정</div>
        </div>
      </div>
    </div>
  )
}
{/* 분석 완료 */}