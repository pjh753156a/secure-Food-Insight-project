import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

import ResponseDto from 'src/apis/response.dto';
import { GetMyInfoResponseDto } from 'src/apis/user/dto/response';
import { GetRestaurantIdResponseDto } from 'src/apis/restaurant/dto/response';

import { getMyInfoRequest } from 'src/apis/user';
import { getRestaurantIdRequest } from 'src/apis/restaurant';

import { CEO_DELETE_ABSOLUTE_PATH, CEO_INFO_UPDATE_ABSOLUTE_PATH, CEO_PAGE_SITE_ABSOLUTE_PATH, INQUIRY_MY_BOARD_LIST_ABSOLUTE_PATH, MAIN_ABSOLUTE_PATH, MY_PAGE_SITE_ABSOLUTE_PATH, RESTAURANT_INFO_ABSOLUTE_PATH, RESTAURANT_LIST_ABSOLUTE_PATH, RESTAURANT_RESERVATION_ABSOLUTE_LIST_PATH, USER_DELETE_ABSOLUTE_PATH} from 'src/constant';

import "./style.css";

// component : 사장 페이지 // 
export default function CeoPageSite() 
{

  // state // 
  const [cookies] = useCookies();
  const [password, setPassword] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userEmailId, setEmailId] = useState<string>('');
  const [userTelNumber, setUserTelNumber] = useState<string>('');
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState<string>('');


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
      navigation(CEO_PAGE_SITE_ABSOLUTE_PATH);
      return;
    }

    if (!cookies.accessToken) return;

    const {userEmailId, userName, businessRegistrationNumber, userTelNumber, password} = result as GetMyInfoResponseDto;
    setEmailId(userEmailId);
    setUserName(userName);
    setUserRole(userRole);
    setBusinessRegistrationNumber(businessRegistrationNumber);
    setUserTelNumber(userTelNumber);
    setPassword(password);
  };

  const getRestaurantIdResponse = (result : GetRestaurantIdResponseDto | ResponseDto | null) => 
  {
    if (!result || result.code !== 'SU') 
    {
      if (result?.code === 'AF') 
      {
        navigation(MAIN_ABSOLUTE_PATH);
        return;
      }
      navigation(RESTAURANT_LIST_ABSOLUTE_PATH);
      return;
    }

    if (!cookies.accessToken) return;

    const {restaurantId} = result as GetRestaurantIdResponseDto;
    navigation(RESTAURANT_INFO_ABSOLUTE_PATH(restaurantId));
  }

  //  event handler //
  const onCeoPageSiteClickHandler = () => navigation(CEO_PAGE_SITE_ABSOLUTE_PATH);
  const onCeoInfoUpdateClickHandler = (userEmailId:string) => navigation(CEO_INFO_UPDATE_ABSOLUTE_PATH(userEmailId));
  const onCeoDeleteClickHandler = (userEmailId:string) => navigation(CEO_DELETE_ABSOLUTE_PATH(userEmailId));
  const onRestaurantReservationListClickHandler = () => navigation(RESTAURANT_RESERVATION_ABSOLUTE_LIST_PATH);
  const onInquiryMyBoardListClickHandler = () => navigation(INQUIRY_MY_BOARD_LIST_ABSOLUTE_PATH);
  
  //   effect   //
  useEffect(() => 
  {
    getMyInfoRequest(cookies.accessToken).then(GetMyInfoResponse);
  }, []);
  
  const onMyRestaurantInformationClickHandler = () => 
  {
    getRestaurantIdRequest(cookies.accessToken).then(getRestaurantIdResponse);
  }
  
  //   render   //
  return (
    <div id='ceo-page-wrapper'>
      <div className='ceo-page-container'>
        <div className='ceo-page-top'>
          <div className='ceo-page-top-title'>사장페이지</div>
          <div className='short-divider-line'></div>
        </div>
        <div className='ceo-page-navigation-box'>
          <div className='ceo-page-navigation' onClick={onCeoPageSiteClickHandler}>사장페이지</div>
          <div className='ceo-page-navigation' onClick={() => onCeoInfoUpdateClickHandler(userEmailId)}>사장정보 수정</div>
          <div className='ceo-page-navigation' onClick={() => onCeoDeleteClickHandler(userEmailId)}>회원탈퇴</div>
        </div>
        <div className='short-divider-line'></div>
        <div className='ceo-page-contents-nav-box'>
            <div className='ceo-page-nav' onClick={onRestaurantReservationListClickHandler}>예약 내역</div>
            <div className='ceo-page-nav' onClick={onMyRestaurantInformationClickHandler}>내 식당 정보</div>
            <div className='ceo-page-nav' onClick={onInquiryMyBoardListClickHandler}>내 문의내역</div>
        </div>
        <div className='short-divider-bottom-line'></div>
        <div className='ceo-page-info-contents-container'>
          <div className='ceo-page-contents-title'>사장정보</div>
          <div className='ceo-page-contents-box'>
            <div className='ceo-page-info-first'>
              <div className='ceo-page-info'>아이디</div>
              <div className='ceo-page-info'>{userEmailId}</div>
            </div>
            <div className='ceo-page-info-second'>
              <div className='ceo-page-info'>이름</div>
              <div className='ceo-page-info'>{userName}</div>
            </div>
            <div className='ceo-page-info-second'>
              <div className='ceo-page-info'>전화번호</div>
              <div className='ceo-page-info'>{userTelNumber}</div>
            </div>
            <div className='ceo-page-info-second'>
              <div className='ceo-page-info'>사업자등록번호</div>
              <div className='ceo-page-info'>{businessRegistrationNumber}</div>
            </div>
            <div className='ceo-page-info-second'>
              <div className='ceo-page-info'>비밀번호</div>
              <div className='ceo-page-info'>{password}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
{/*분석 완료*/}