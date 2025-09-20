import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router';

import Main from './views/Main';
import TopContainer from './layouts/TopContainer';
import SignUp from './views/Authentication/SignUp';
import Policy from './views/service/Introduction/Policy';
import Company from './views/service/Introduction/Company';
import MyPageSite from './views/service/Mypage/MyPageSite';
import UserDelete from './views/service/Mypage/UserDelete';
import SignIn, { Sns } from './views/Authentication/SignIn';
import CeoPageSite from './views/service/CeoPage/CeoPageSite';
import Provision from './views/service/Introduction/Provision';
import Authentication from './layouts/AuthenticationContainer';
import CeoInfoUpdate from './views/service/CeoPage/CeoInfoUpdate';
import FavoriteList from './views/service/Restaurant/FavoriteList';
import UserInfoUpdate from './views/service/Mypage/UserInfoUpdate';
import FindEmailInput from './views/Authentication/FIndEmailInput';
import NoticeList from './views/service/board/noticeboard/NoticeList';
import RestaurantList from './views/service/Restaurant/RestaurantList';
import RestaurantInfo from './views/service/Restaurant/RestaurantInfo';
import NoticeWrite from './views/service/board/noticeboard/NoticeWrite';
import ReviewWrite from './views/service/Restaurant/Review/ReviewWrite';
import InquiryList from './views/service/board/inquiryboard/InquiryList';
import MyReviewList from './views/service/Restaurant/Review/MyReviewList';
import ReviewDetail from './views/service/Restaurant/Review/ReviewDetail';
import ReviewUpdate from './views/service/Restaurant/Review/ReviewUpdate';
import NoticeDetail from './views/service/board/noticeboard/NoticeDetail';
import NoticeUpdate from './views/service/board/noticeboard/NoticeUpdate';
import InquiryWrite from './views/service/board/inquiryboard/InquiryWrite';
import PasswordResetCheck from './views/Authentication/PasswordResetCheck';
import PasswordResetInput from './views/Authentication/PasswordResetInput';
import InquiryDetail from './views/service/board/inquiryboard/InquiryDetail';
import InquiryMyList from './views/service/board/inquiryboard/InquiryMyList';
import InquiryUpdate from './views/service/board/inquiryboard/InquiryUpdate';
import DoReservation from './views/service/Restaurant/Reservation/DoReservation';
import RestaurantInfoWrite from './views/service/Restaurant/RestaurantInfoWrite';
import RestaurantInfoUpdate from './views/service/Restaurant/RestaurantInfoUpdate';
import ReservationList from './views/service/Restaurant/Reservation/ReservationList';

import { ADMIN_DELETE_PATH, ADMIN_INFO_UPDATE_PATH, ADMIN_PAGE_PATH, ADMIN_PAGE_SITE_PATH, ADMIN_SIGN_IN_PATH, AUTH_PATH, BOARD_PATH, CEO_DELETE_PATH, CEO_INFO_UPDATE_PATH, CEO_PAGE_PATH, CEO_PAGE_SITE_PATH, DO_RESERVATION_PATH, FAVORITE_PATH, FIND_EMAIL_INPUT_PATH, INQUIRY_BOARD_LIST_PATH, INQUIRY_BOARD_UPDATE_PATH, INQUIRY_BOARD_WRITE_PATH, INQUIRY_DETAILS_PATH, INQUIRY_MY_BOARD_LIST_PATH, INQUIRY_PATH, INTRODUCTION_COMPANY_PATH, INTRODUCTION_PATH, INTRODUCTION_POLICY_ABSOLUTE_PATH, INTRODUCTION_POLICY_PATH, INTRODUCTION_PROVISION_PATH, MAIN_ABSOLUTE_PATH, MAIN_PATH, MY_PAGE_PATH, MY_PAGE_SITE_PATH, NOTICE_BOARD_LIST_PATH, NOTICE_BOARD_UPDATE_PATH, NOTICE_BOARD_WRITE_PATH, NOTICE_DETAILS_PATH, NOTICE_PATH, PASSWORD_RESET_CHECK, PASSWORD_RESET_INPUT_PATH, RESERVATION_LIST_PATH, RESERVATION_PATH, RESTAURANT_FAVORITE_LIST_PATH, RESTAURANT_INFO_PATH, RESTAURANT_INFO_UPDATE_PATH, RESTAURANT_INFO_WRITE_PATH, RESTAURANT_LIST_PATH, RESTAURANT_PATH, RESTAURANT_REVIEW_DETAILS_LIST_PATH, RESTAURANT_REVIEW_DETAIL_PATH, RESTAURANT_REVIEW_UPDATE_PATH, RESTAURANT_REVIEW_WRITE_PATH, REVIEW_PATH, SIGN_IN_PATH, SIGN_UP_PATH, SNS_PATH, USER_DELETE_PATH, USER_INFO_UPDATE_PATH } from './constant';

import './App.css';
import { useKakaoLoader } from 'react-kakao-maps-sdk';
import AdminSignIn from './views/Authentication/AdminSignIn';
import AdminInfoUpdate from './views/service/AdminPage/AdminInfoUpdate';
import AdminPageSite from './views/service/AdminPage/AdminPageSite';
import CeoDelete from './views/service/CeoPage/CeoDelete';
import AdminDelete from './views/service/AdminPage/AdminDelete';


// component: root 경로 컴포넌트
function Index() {

  //   function   //
  const navigation = useNavigate();

  //   effect   //
  useEffect(() => navigation(MAIN_ABSOLUTE_PATH), []);

  //   render   //
  return <></>;
}

// component: Application 컴포넌트
function App() 
{
  
  //  effect  //
  useKakaoLoader({
    appkey: "1121641ff4fa6668d61874ed79c1709e",
    libraries: ["clusterer", "drawing", "services"],
  })
  
  //   render   //
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path={SNS_PATH} element={<Sns />} />
      <Route path={MAIN_PATH} element={<Main />} />
      <Route path={AUTH_PATH} element={<Authentication />} >
        <Route path={SIGN_IN_PATH} element={<SignIn />} />
        <Route path={ADMIN_SIGN_IN_PATH} element={<AdminSignIn />} />
        <Route path={SIGN_UP_PATH} element={<SignUp />} />
        <Route path={FIND_EMAIL_INPUT_PATH} element={<FindEmailInput />} />
        <Route path={PASSWORD_RESET_INPUT_PATH} element={<PasswordResetInput />} />
        <Route path={PASSWORD_RESET_CHECK} element={<PasswordResetCheck />} />
      </Route>
      <Route element={<TopContainer />} >
        <Route path={RESTAURANT_PATH}>
          <Route path={RESTAURANT_LIST_PATH} element={<RestaurantList />} />
          <Route path={RESTAURANT_INFO_PATH} element={<RestaurantInfo />} />
          <Route path={RESTAURANT_INFO_WRITE_PATH} element={<RestaurantInfoWrite />} />
          <Route path={RESTAURANT_INFO_UPDATE_PATH} element={<RestaurantInfoUpdate />} />
          <Route path={REVIEW_PATH}>
            <Route path={RESTAURANT_REVIEW_DETAILS_LIST_PATH} element={<MyReviewList />} />
            <Route path={RESTAURANT_REVIEW_DETAIL_PATH} element={<ReviewDetail />} />
            <Route path={RESTAURANT_REVIEW_UPDATE_PATH} element={<ReviewUpdate />} />
            <Route path={RESTAURANT_REVIEW_WRITE_PATH} element={<ReviewWrite />} />
          </Route>
          <Route path={RESERVATION_PATH}>
            <Route path={DO_RESERVATION_PATH} element={<DoReservation />} />
            <Route path={RESERVATION_LIST_PATH} element={<ReservationList />} />
          </Route>
          <Route path={FAVORITE_PATH}>
            <Route path={RESTAURANT_FAVORITE_LIST_PATH} element={<FavoriteList />} />
          </Route>
        </Route>
        <Route path={MY_PAGE_PATH} >
          <Route path={MY_PAGE_SITE_PATH} element={<MyPageSite />} />
          <Route path={USER_INFO_UPDATE_PATH} element={<UserInfoUpdate />} />
          <Route path={USER_DELETE_PATH} element={<UserDelete />} />
        </Route>
        <Route path={CEO_PAGE_PATH} >
          <Route path={CEO_PAGE_SITE_PATH} element={<CeoPageSite />} />
          <Route path={CEO_INFO_UPDATE_PATH} element={<CeoInfoUpdate />} />
          <Route path={CEO_DELETE_PATH} element={<CeoDelete />} />
        </Route>
        <Route path={ADMIN_PAGE_PATH} >
          <Route path={ADMIN_PAGE_SITE_PATH} element={<AdminPageSite />} />
          <Route path={ADMIN_INFO_UPDATE_PATH} element={<AdminInfoUpdate/>} />
          <Route path={ADMIN_DELETE_PATH} element={<AdminDelete />} />
        </Route>
        <Route path={BOARD_PATH} >
          <Route path={NOTICE_PATH} >
            <Route path={NOTICE_BOARD_LIST_PATH} element={<NoticeList />} />
            <Route path={NOTICE_BOARD_WRITE_PATH} element={<NoticeWrite />} />
            <Route path={NOTICE_BOARD_UPDATE_PATH} element={<NoticeUpdate />} />
            <Route path={NOTICE_DETAILS_PATH} element={<NoticeDetail />} />
          </Route>
          <Route path={INQUIRY_PATH} >
            <Route path={INQUIRY_BOARD_LIST_PATH} element={<InquiryList />} />
            <Route path={INQUIRY_BOARD_WRITE_PATH} element={<InquiryWrite />} />
            <Route path={INQUIRY_BOARD_UPDATE_PATH} element={<InquiryUpdate />} />
            <Route path={INQUIRY_MY_BOARD_LIST_PATH} element={<InquiryMyList />} />
            <Route path={INQUIRY_DETAILS_PATH} element={<InquiryDetail />} />
          </Route>
        </Route>
        <Route path={INTRODUCTION_PATH} >
          <Route path={INTRODUCTION_COMPANY_PATH} element={<Company />} />
          <Route path={INTRODUCTION_PROVISION_PATH} element={<Provision />} />
          <Route path={INTRODUCTION_POLICY_PATH} element={<Policy />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
{/* / 분석 완료 / */}