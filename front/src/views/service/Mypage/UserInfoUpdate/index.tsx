import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { useUserStore } from 'src/stores';
import InputBox from 'src/components/InputBox';

import ResponseDto from 'src/apis/response.dto';
import { PatchUserInfoRequestDto } from 'src/apis/user/dto/request';
import { GetMyInfoResponseDto } from 'src/apis/user/dto/response';

import { getMyInfoRequest, patchUserInfoRequest } from 'src/apis/user';

import { MAIN_ABSOLUTE_PATH, MY_PAGE_SITE_ABSOLUTE_PATH, USER_DELETE_ABSOLUTE_PATH, USER_INFO_UPDATE_ABSOLUTE_PATH } from 'src/constant';

import "./style.css";

// component: 회원정보 수정 //
export default function UserInfoUpdate() 
{
  // state // 
  const [cookies] = useCookies();
  const { loginUserRole } = useUserStore();
  const [password, setPassword] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userEmailId, setEmailId] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string>('');
  const [userTelNumber, setUserTelNumber] = useState<string>('');

  // function //
  const navigation = useNavigate();

  const GetMyInfoResponse = (result : GetMyInfoResponseDto | ResponseDto | null) => 
  {
    const message =
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'AF' ? '인증에 실패했습니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    if (!result || result.code !== 'SU') 
    {
      alert(message);
      if (result?.code === 'AF') 
      {
        navigation(MAIN_ABSOLUTE_PATH);
        return;
      }
      navigation(MY_PAGE_SITE_ABSOLUTE_PATH);
      return;
    }

    if (!cookies.accessToken) return;

    const {userEmailId, nickname, userName, userTelNumber, userAddress, password} = result as GetMyInfoResponseDto;
    setNickname(nickname);
    setEmailId(userEmailId);
    setUserName(userName);
    setUserTelNumber(userTelNumber);
    setUserAddress(userAddress);
    setUserRole(userRole);
    setPassword(password);
  };

  const PatchUpdateUserInfoResponse = (result: ResponseDto | null) => 
  {
    const message =
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'AF' ? '인증에 실패했습니다.' :
      result.code === 'NU' ? '사용자 정보가 일치하지 않습니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccess = result && result.code === 'SU';
    if (!isSuccess) 
    {
      alert(message);
      return;
    }

    alert('정보가 성공적으로 수정되었습니다.');
    navigation(MY_PAGE_SITE_ABSOLUTE_PATH);
  };
  
  // event handler //
  const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const nickname = event.target.value;
    setNickname(nickname);
  };

  const onUserAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const userAddress = event.target.value;
    setUserAddress(userAddress);
  };

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>
  {
    const password = event.target.value;
    setPassword(password);
  };

  const onUpdateButtonClickHandler = () => 
  {
    if (!cookies.accessToken || !userEmailId) return;
    if (!nickname.trim() || !userAddress.trim() || !password.trim()) return;

    const requestBody: PatchUserInfoRequestDto = { nickname, userAddress, password };
    patchUserInfoRequest(userEmailId, requestBody, cookies.accessToken).then(PatchUpdateUserInfoResponse);
  };
  
  const onMyPageSiteClickHandler = () => navigation(MY_PAGE_SITE_ABSOLUTE_PATH);
  const onUserInfoUpdateClickHandler = (userEmailId:string) => navigation(USER_INFO_UPDATE_ABSOLUTE_PATH(userEmailId));
  const onUserDeleteClickHandler = (userEmailId:string) => navigation(USER_DELETE_ABSOLUTE_PATH(userEmailId));
  
  // effect //
  let effectFlag = useRef(false);

  useEffect(() => 
  {
    if (!cookies.accessToken) return;
    getMyInfoRequest(cookies.accessToken).then(GetMyInfoResponse);
  }, []);
  
  useEffect(() => 
  {
    if (!cookies.accessToken) return;
    if (!loginUserRole) return;
    if (effectFlag.current) return;
    effectFlag.current = true;
    if (loginUserRole !== 'ROLE_USER') 
    {
      navigation(MY_PAGE_SITE_ABSOLUTE_PATH);
      return;
    }
    getMyInfoRequest(cookies.accessToken).then(GetMyInfoResponse);
  }, [loginUserRole, cookies.accessToken]);

  // render //
  return (
    <div id='my-page-update-wrapper'>
      <div className='my-page-update-container'>
        <div>
          <div className='my-page-update-top-title'>회원정보 수정</div>
          <div className='short-divider-line'></div>
        </div>
        <div className='my-page-navigation-box'>
          <div className='my-page-navigation' onClick={onMyPageSiteClickHandler}>마이페이지</div>
          <div className='my-page-navigation' onClick={() => onUserInfoUpdateClickHandler(userEmailId)}>회원정보 수정</div>
          <div className='my-page-navigation' onClick={() => onUserDeleteClickHandler(userEmailId)}>회원탈퇴</div>
        </div>
        <div className='short-divider-bottom-line'></div>
        <div className='my-page-update-container'>
          <div className='my-page-update-contents-title'>회원정보 수정</div>
          <div className='my-page-update-contents-box'>
            <div className='my-page-update-info-box'>
              <div className='my-page-update-info-left'>닉네임</div>
              <div className='my-page-input-box'>
                <InputBox type='text' value={nickname} placeholder='닉네임을 입력해주세요.' onChangeHandler={onNicknameChangeHandler} />
              </div>
            </div>
            <div className='my-page-update-info-box'>
              <div className='my-page-update-info-left'>아이디</div>
              <div className='my-page-update-info'>{userEmailId}</div>
            </div>
            <div className='my-page-update-info-box'>
              <div className='my-page-update-info-left'>이름</div>
              <div className='my-page-update-info'>{userName}</div>
            </div>
            <div className='my-page-update-info-box'>
              <div className='my-page-update-info-left'>전화번호</div>
              <div className='my-page-update-info'>{userTelNumber}</div>
            </div>
            <div className='my-page-update-info-box'>
              <div className='my-page-update-info-left'>주소</div>
              <div className='my-page-input-box'>
                <InputBox type='text' value={userAddress}  placeholder='주소를 입력해주세요.' onChangeHandler={onUserAddressChangeHandler} />
              </div>
            </div>
            <div className='my-page-update-info-box'>
              <div className='my-page-update-info-left'>비밀번호</div>
              <div className='my-page-input-box'>
                <InputBox type='text' value={password}  placeholder='비밀번호를 입력해주세요.' onChangeHandler={onPasswordChangeHandler} />
              </div>
            </div>
          </div>
          <div className='my-page-update-button' onClick={onUpdateButtonClickHandler}>수정</div>
        </div>
      </div>
    </div>
  );
}
{/*분석 완료*/}