import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

import ResponseDto from 'src/apis/response.dto';
import { GetMyInfoResponseDto } from 'src/apis/user/dto/response';

import { deleteUserRequest, getMyInfoRequest, MFARequest } from 'src/apis/user';

import { INQUIRY_MY_BOARD_LIST_ABSOLUTE_PATH, MAIN_ABSOLUTE_PATH, MY_PAGE_SITE_ABSOLUTE_PATH, RESTAURANT_FAVORITE_ABSOLUTE_LIST_PATH, RESTAURANT_RESERVATION_ABSOLUTE_LIST_PATH, RESTAURANT_REVIEW_ABSOLUTE_DETAILS_LIST_PATH, USER_DELETE_ABSOLUTE_PATH, USER_INFO_UPDATE_ABSOLUTE_PATH } from 'src/constant';

import "./style.css";
import { MFARequestDto } from 'src/apis/user/dto/request';

// component: 마이페이지 //
export default function MyPageSite() 
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
      navigation(MY_PAGE_SITE_ABSOLUTE_PATH);
      return;
    }

    if (!cookies.accessToken) return;

    const {userEmailId, nickname, userName, userTelNumber} = result as GetMyInfoResponseDto;
    setNickname(nickname);
    setEmailId(userEmailId);
    setUserName(userName);
    setUserTelNumber(userTelNumber);
    setUserRole(userRole);
  };

  const MFAResponse = (result : ResponseDto | null) => 
  {
    const message = 
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'AF' ? '권한이 없습니다.' :
      result.code === 'NU' ? '사용자 정보가 일치하지 않습니다.' :
      result.code === 'VF' ? '사용자 정보가 일치하지 않습니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    if (!result || result.code !== 'SU')
    {
      alert(message);
      return;
    }

    navigation(USER_INFO_UPDATE_ABSOLUTE_PATH(userEmailId));
  };

  // event handler //
  const onUserDeleteClickHandler = (userEmailId:string) => navigation(USER_DELETE_ABSOLUTE_PATH(userEmailId));

  const onUserInfoUpdateClickHandler = () => 
  {
    const password = prompt("비밀번호를 입력해 주세요");
    if (!userEmailId || !cookies.accessToken || !password) return;
    
    const requestBody: MFARequestDto = { password };
    MFARequest(requestBody, cookies.accessToken).then(MFAResponse);
  }

  const onMyPageSiteClickHandler = () => navigation(MY_PAGE_SITE_ABSOLUTE_PATH);
  const onInquiryMyBoardListClickHandler = () => navigation(INQUIRY_MY_BOARD_LIST_ABSOLUTE_PATH);
  const onRestaurantFavoriteClickHandler = () => navigation(RESTAURANT_FAVORITE_ABSOLUTE_LIST_PATH);
  const onRestaurantReservationListClickHandler = () => navigation(RESTAURANT_RESERVATION_ABSOLUTE_LIST_PATH);
  const onRestaurantReviewDetailsClickHandler = () => navigation(RESTAURANT_REVIEW_ABSOLUTE_DETAILS_LIST_PATH);
  
  //   effect   //
  useEffect(() => 
  {
    getMyInfoRequest(cookies.accessToken).then(GetMyInfoResponse);
  }, []);

  const coveredUserName = userName !== 
  '' && (userName[0] + '*'.repeat(userName.length - 1));
  const coveredEmail = userEmailId !== 
  '' && (
    userEmailId.split('@')[0][0] + '*'.repeat(userEmailId.split('@')[0].length - 1) + '@' + userEmailId.split('@')[1]
  );
  const coveredTel = userTelNumber !== 
  '' && (
    userTelNumber.slice(0, 3) + '-****-' + userTelNumber.slice(-4)
  );

  //   render   //
  return (
    <div id='my-page-wrapper'>
      <div className='my-page-container'>
        <div className='my-page-top'>
          <div className='my-page-top-title'>마이페이지</div>
          <div className='short-divider-line'></div>
        </div>
        <div className='my-page-navigation-box'>
          <div className='my-page-navigation' onClick={onMyPageSiteClickHandler}>마이페이지</div>
          <div className='my-page-navigation' onClick={onUserInfoUpdateClickHandler}>회원정보 수정</div>
          <div className='my-page-navigation' onClick={() => onUserDeleteClickHandler(userEmailId)}>회원탈퇴</div>
        </div>
        <div className='short-divider-line'></div>
        <div className='my-page-contents-nav-box'>
          <div className='my-page-contents-nav' onClick={onRestaurantFavoriteClickHandler}>찜한 식당 목록</div>
          <div className='my-page-contents-nav' onClick={onRestaurantReservationListClickHandler}>예약 내역</div>
          <div className='my-page-contents-nav' onClick={onRestaurantReviewDetailsClickHandler}>리뷰 내역</div>
          <div className='my-page-contents-nav' onClick={onInquiryMyBoardListClickHandler}>내 문의내역</div>
        </div>
        <div className='short-divider-bottom-line'></div>
        <div className='my-page-info-contents-container'>
          <div className='my-page-contents-title'>회원정보</div>
          <div className='my-page-contents-box'>
            <div className='my-page-info-first'>
              <div className='my-page-info'>아이디</div>
              <div className='my-page-info'>{coveredEmail}</div>
            </div>
            <div className='my-page-info-first'>
              <div className='my-page-info'>닉네임</div>
              <div className='my-page-info'>{nickname}</div>
            </div>
            <div className='my-page-info-second'>
              <div className='my-page-info'>이름</div>
              <div className='my-page-info'>{coveredUserName}</div>
            </div>
            <div className='my-page-info-second'>
              <div className='my-page-info'>전화번호</div>
              <div className='my-page-info'>{coveredTel}</div>
            </div>
            <div className='my-page-info-second'>
              <div className='my-page-info'>비밀번호</div>
              <div className='my-page-info'>{password}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
{/*분석 완료*/}