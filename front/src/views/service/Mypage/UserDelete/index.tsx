import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';
import { ChangeEvent, useEffect, useState } from 'react';

import { useUserStore } from 'src/stores';
import InputBox from 'src/components/InputBox';

import ResponseDto from 'src/apis/response.dto';
import { DeleteUserRequestDto } from 'src/apis/user/dto/request';

import { deleteUserRequest } from 'src/apis/user';

import { MAIN_ABSOLUTE_PATH, passwordPatternType } from 'src/constant';

import "./style.css";

// component: 회원탈퇴 //
export default function UserDelete() 
{
  // state //
  const { userEmailId } = useParams();
  const [cookies, ,removeCookie] = useCookies();
  const [password, setPassword] = useState<string>('');
  const {setLoginUserEmailId, setLoginUserRole} = useUserStore();
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  
  // function //
  const navigation = useNavigate();
  
  const deleteUserResponse = (result: ResponseDto | null) => 
  {
    const message = 
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'AF' ? '권한이 없습니다.' :
      result.code === 'NU' ? '사용자 정보가 일치하지 않습니다.' :
      result.code === 'VF' ? '비밀번호를 입력해주세요.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    if (!result || result.code !== 'SU')
    {
      alert(message);
      return;
    }
    alert('회원탈퇴가 성공하였습니다.');

    removeCookie('accessToken', { path: '/' });
    navigation(MAIN_ABSOLUTE_PATH);
    setLoginUserEmailId("");
    setLoginUserRole("");
  };
  
  // event handler //
  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const password = event.target.value;
    setPassword(password);

    const passwordPattern = passwordPatternType;
    const isPasswordPattern = passwordPattern.test(password);

    const passwordMessage = 
      isPasswordPattern ? '' :
      password ? '4글자 이상 입력해주세요.' : '';
    setPasswordMessage(passwordMessage);
  };

  const onUserDeleteButtonClickHandler = () => 
  {
    if (!userEmailId || !cookies.accessToken) return;
    
    const isConfirm = window.confirm('정말로 삭제하시겠습니까? 삭제하면 회원의 모든 내역이 사라집니다.');
    if (!isConfirm) return;

    const requestData: DeleteUserRequestDto = { password };
    deleteUserRequest(userEmailId, requestData, cookies.accessToken).then(deleteUserResponse);
  };
  
  // effect // 
  useEffect(() => 
  {
    if (!cookies.accessToken || !userEmailId) return;
  }, [cookies.accessToken]);

  // render // 
  return (
    <div id='resign-wrapper'>
      <div className='resign-container'>
        <div className='resign-title'>회원 탈퇴</div>
        <div className='resign-box'>
          <div className='resign-content caution-title'>회원 탈퇴 시 주의사항!</div>
          <div className='resign-content caution-contents'>1. 회원 정보 및 모든 게시물(리뷰, 문의) 삭제 처리됨
            <p>
              회원탈퇴 즉시 아래에 해당하는 개인정보가 삭제됩니다.
              <br />
              개인정보 : 이메일 계정, 비밀번호, 휴대폰번호, 생일, 성별 정보 삭제
            </p>
          </div>
        </div>
        <div className='resign-password'>
          <InputBox label="비밀번호 재입력" type="password" value={password} placeholder="비밀번호를 입력해주세요." onChangeHandler={onPasswordChangeHandler} message={passwordMessage} error />
        </div>
        <div className='delete-button' onClick={onUserDeleteButtonClickHandler}>회원 탈퇴하기</div>
      </div>
    </div>
  )
}
{/*분석 완료*/}