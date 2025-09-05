import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

import ResponseDto from 'src/apis/response.dto';
import { GetMyInfoResponseDto } from 'src/apis/user/dto/response';

import { getMyInfoRequest } from 'src/apis/user';

import { ADMIN_DELETE_ABSOLUTE_PATH, ADMIN_INFO_UPDATE_ABSOLUTE_PATH, ADMIN_PAGE_SITE_ABSOLUTE_PATH, INQUIRY_BOARD_LIST_ABSOLUTE_PATH, INQUIRY_MY_BOARD_LIST_ABSOLUTE_PATH, MAIN_ABSOLUTE_PATH, MY_PAGE_SITE_ABSOLUTE_PATH, RESTAURANT_FAVORITE_ABSOLUTE_LIST_PATH, RESTAURANT_RESERVATION_ABSOLUTE_LIST_PATH, RESTAURANT_REVIEW_ABSOLUTE_DETAILS_LIST_PATH, USER_DELETE_ABSOLUTE_PATH, USER_INFO_UPDATE_ABSOLUTE_PATH } from 'src/constant';

import "./style.css";

// component: 관리자 페이지 //
export default function AdminPageSite() 
{
  // state //
  const [cookies] = useCookies();
  const [password, setPassword] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userEmailId, setEmailId] = useState<string>('');
  const [userTelNumber, setUserTelNumber] = useState<string>('');
  
  // function //
  const navigation = useNavigate();

  const GetMyInfoResponse = (result : GetMyInfoResponseDto | ResponseDto | null) => 
  {
    if (!result || result.code !== 'SU') 
    {
      if (result?.code === 'AF') 
      {
        navigation(MAIN_ABSOLUTE_PATH);
        return;
      }
      navigation(ADMIN_PAGE_SITE_ABSOLUTE_PATH);
      return;
    }

    if (!cookies.accessToken) return;

    const {userEmailId, nickname, userName, userTelNumber, password} = result as GetMyInfoResponseDto;
    setNickname(nickname);
    setEmailId(userEmailId);
    setUserName(userName);
    setUserTelNumber(userTelNumber);
    setUserRole(userRole);
    setPassword(password);
  };

  // event handler //
  const onAdminDeleteClickHandler = (userEmailId:string) => navigation(ADMIN_DELETE_ABSOLUTE_PATH(userEmailId));
  const onAdminInfoUpdateClickHandler = (userEmailId:string) => navigation(ADMIN_INFO_UPDATE_ABSOLUTE_PATH(userEmailId));
  const onAdminPageSiteClickHandler = () => navigation(ADMIN_PAGE_SITE_ABSOLUTE_PATH);
  
  //   effect   //
  useEffect(() => 
  {
    getMyInfoRequest(cookies.accessToken).then(GetMyInfoResponse);
  }, []);

  //   render   //
  return (
    <div id='admin-page-wrapper'>
      <div className='admin-page-container'>
        <div className='admin-page-top'>
          <div className='admin-page-top-title'>관리자 페이지</div>
          <div className='short-divider-line'></div>
        </div>
        <div className='admin-page-navigation-box'>
          <div className='admin-page-navigation' onClick={onAdminPageSiteClickHandler}>관리자 페이지</div>
          <div className='admin-page-navigation' onClick={() => onAdminInfoUpdateClickHandler(userEmailId)}>관리자 수정</div>
          <div className='admin-page-navigation' onClick={() => onAdminDeleteClickHandler(userEmailId)}>회원탈퇴</div>
        </div>
        <div className='short-divider-line'></div>
        <div className='short-divider-bottom-line'></div>
        <div className='admin-page-info-contents-container'>
          <div className='admin-page-contents-title'>관리자정보</div>
          <div className='admin-page-contents-box'>
            <div className='admin-page-info-first'>
              <div className='admin-page-info'>아이디</div>
              <div className='admin-page-info'>{userEmailId}</div>
            </div>
            <div className='admin-page-info-first'>
              <div className='admin-page-info'>닉네임</div>
              <div className='admin-page-info'>{nickname}</div>
            </div>
            <div className='admin-page-info-second'>
              <div className='admin-page-info'>이름</div>
              <div className='admin-page-info'>{userName}</div>
            </div>
            <div className='admin-page-info-second'>
              <div className='admin-page-info'>전화번호</div>
              <div className='admin-page-info'>{userTelNumber}</div>
            </div>
            <div className='admin-page-info-three'>
              <div className='admin-page-info'>비밀번호</div>
              <div className='admin-page-info'>{password}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
{/*분석 완료*/}