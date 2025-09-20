import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { useUserStore } from 'src/stores';

import ResponseDto from 'src/apis/response.dto';
import { GetMyInfoResponseDto, GetUserInfoResponseDto } from 'src/apis/user/dto/response';

import { getMyInfoRequest, getSignInUserRequest } from 'src/apis/user';

import { ADMIN_PAGE_ABSOLUTE_PATH, ADMIN_PAGE_SITE_ABSOLUTE_PATH, ADMIN_SIGN_IN_ABSOLUTE_PATH, CEO_PAGE_SITE_ABSOLUTE_PATH, INQUIRY_BOARD_LIST_ABSOLUTE_PATH, INTRODUCTION_COMPANY_ABSOLUTE_PATH, INTRODUCTION_POLICY_ABSOLUTE_PATH, INTRODUCTION_PROVISION_ABSOLUTE_PATH, MAIN_ABSOLUTE_PATH, MY_PAGE_SITE_ABSOLUTE_PATH, NOTICE_BOARD_LIST_ABSOLUTE_PATH, RESTAURANT_LIST_ABSOLUTE_PATH, SIGN_IN_ABSOLUTE_PATH} from 'src/constant';

import './style.css';

// component // 
function TopBar() 
{

    // state //
    const { pathname } = useLocation();
    const [cookies, , removeCookie] = useCookies();
    const [nickname, setNickname] = useState<string>('');
    const { setLoginUserEmailId, setLoginUserRole, loginUserRole } = useUserStore();

    const getMyInfoResponse = (result: GetMyInfoResponseDto | ResponseDto | null) => 
    {
        if (!result) return;
        const { nickname } = result as GetMyInfoResponseDto;
        setNickname(nickname);
    };
    
    // function //
    const navigation = useNavigate();

    // event handler //
    const onLogoutClickHandler = () => 
    {
        removeCookie('accessToken', { path: '/' });
        removeCookie('csrfToken', { path: '/' });
        setLoginUserEmailId('');
        setLoginUserRole('');
    };
    
    const onLogoClickHandler = () => 
    {
        if (pathname === MAIN_ABSOLUTE_PATH) 
        {
            window.location.reload();
        } 
        else 
        {
            navigation(MAIN_ABSOLUTE_PATH);
        }
    }

    const onRestaurantSearchListClickHandler = () => 
    {
        if (pathname === RESTAURANT_LIST_ABSOLUTE_PATH) 
        {
            window.location.reload();
        } 
        else 
        {
            navigation(RESTAURANT_LIST_ABSOLUTE_PATH);
        }
    }
    
    const onNoticeBoardSearchListClickHandler = () => 
    {
        if (pathname === NOTICE_BOARD_LIST_ABSOLUTE_PATH) 
        {
            window.location.reload();
        } 
        else
            navigation(NOTICE_BOARD_LIST_ABSOLUTE_PATH);
    }
    
    const onSignInClickHandler = () => navigation(SIGN_IN_ABSOLUTE_PATH);
    const onMyPageClickHandler = () => navigation(MY_PAGE_SITE_ABSOLUTE_PATH);
    const onAdminPageClickHandler = () => navigation(ADMIN_PAGE_SITE_ABSOLUTE_PATH);
    const onCeoPageClickHandler = () => navigation(CEO_PAGE_SITE_ABSOLUTE_PATH);
    //  effect  //
    useEffect(() => 
    {
        if (!cookies.accessToken) return;
        getMyInfoRequest(cookies.accessToken).then(getMyInfoResponse);
    }, [cookies.accessToken]);
    
    // render // 
    return (
        <>
            <div className='top-head-box'>
                <div className='top-title' onClick={onLogoClickHandler}>{"Food Insight"}</div>
                <div className='top-right-container'>
                    <div className='top-navigation-box'>
                        <div className='top-navigation' onClick={onRestaurantSearchListClickHandler}>식당 검색</div>
                        <div className='top-navigation' onClick={onNoticeBoardSearchListClickHandler}>고객센터</div>
                    </div>
                    <div className='top-divider'>|</div>
                    <div className='top-bar-button'>
                        {loginUserRole === 'ROLE_USER' &&
                            <div className="top-bar-role">
                                <div className="sign-in-wrapper">
                                    <div className="top-button" onClick={onMyPageClickHandler}>{nickname}님</div>
                                </div>
                                <div className="logout-button" onClick={onLogoutClickHandler}>로그아웃</div>
                            </div>
                        }
                        {loginUserRole === 'ROLE_CEO' &&
                            <div className="top-bar-role">
                                <div className="sign-in-wrapper">
                                    <div className="top-button" onClick={onCeoPageClickHandler}>사장</div>
                                </div> 
                                <div className="logout-button" onClick={onLogoutClickHandler}>로그아웃</div>
                            </div>
                        }
                        {loginUserRole === 'ROLE_ADMIN' &&
                            <div className="top-bar-role">
                                <div className="sign-in-wrapper">
                                    <div className="top-button" onClick={onAdminPageClickHandler}>관리자</div>
                                </div> 
                                <div className="logout-button" onClick={onLogoutClickHandler}>로그아웃</div>
                            </div>
                        }
                        {loginUserRole !== 'ROLE_USER' && loginUserRole !== 'ROLE_ADMIN' && loginUserRole !== 'ROLE_CEO' &&
                            <div className="top-button" onClick={onSignInClickHandler}>로그인</div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

function BottomBar()
{

    // function //
    const navigation = useNavigate();

    // event handler //
    const onCompanyClickHandler = () => navigation(INTRODUCTION_COMPANY_ABSOLUTE_PATH);
    const onPolicyClickHandler = () => navigation(INTRODUCTION_POLICY_ABSOLUTE_PATH);
    const onProvisionClickHandler = () => navigation(INTRODUCTION_PROVISION_ABSOLUTE_PATH);
    const onInquiryBoardlistClickHandler = () => navigation(INQUIRY_BOARD_LIST_ABSOLUTE_PATH);
    const onNoticeBoardlistClickHandler = () => navigation(NOTICE_BOARD_LIST_ABSOLUTE_PATH);
    const onAdminSignInClickHandler = () => navigation(ADMIN_SIGN_IN_ABSOLUTE_PATH);
    
    // render // 
    return (
        <div className='bottom-box'>
            <div className='bottom-title'>Food Insight</div>
            <div className='bottom-navigation-box'>
                <div className='bottom-navigation' onClick={onCompanyClickHandler}>회사소개</div>
                <div className="bottom-divider">{'\|'}</div>
                <div className='bottom-navigation' onClick={onPolicyClickHandler}>개인정보처리방침</div>
                <div className="bottom-divider">{'\|'}</div>
                <div className='bottom-navigation' onClick={onProvisionClickHandler}>이용약관</div>
                <div className="bottom-divider">{'\|'}</div>
                <div className='bottom-navigation' onClick={onInquiryBoardlistClickHandler}>도움말</div>
                <div className="bottom-divider">{'\|'}</div>
                <div className='bottom-navigation' onClick={onNoticeBoardlistClickHandler}>공지사항</div>
                <div className="bottom-divider">{'\|'}</div>
                <div className='bottom-navigation' onClick={onAdminSignInClickHandler}>RedZone</div>
            </div>
            <div className='bottom-detail-contents-box first'>
                <div className='bottom-detail-content'>(주)FoodInsight</div>
                <div className='bottom-detail-content'>대표자| 김나경 김다인 김유진 박주형</div>
                <div className='bottom-detail-content'>대한민국</div>
            </div>
            <div className='bottom-detail-contents-box second'>
                <div className='bottom-detail-content'>사업자등록번호 111-11-11111</div>
                <div className='bottom-detail-content'>TEL 1515-1515</div>
                <div className='bottom-detail-content'>FAX 02.000.000</div>
                <div className='bottom-detail-content'>EMAIL foodinsight@email.com</div>
            </div>
        </div>
    );
}

// component //
export default function TopContainer() 
{

    // state //
    const { setLoginUserEmailId, setLoginUserRole, setBusinessRegistrationNumber } = useUserStore();
    const [cookies] = useCookies();

    // function //
    const getSignInUserResponse = (result: GetUserInfoResponseDto | ResponseDto | null) => 
    {

        if (!result || result.code !== 'SU') 
        {
            return;
        }
    
        const { userEmailId, userRole, businessRegistrationNumber } = result as GetUserInfoResponseDto;
        setLoginUserEmailId(userEmailId);
        setLoginUserRole(userRole);
        setBusinessRegistrationNumber(businessRegistrationNumber);
    };
    
    //  effect  //
    useEffect(() => 
    {
        getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
    }, [cookies.accessToken]);
    
    // render //
    return (
        <div id="top-wrapper">
            <TopBar />
            <div className="top-container">
                <Outlet />
            </div>
            <BottomBar />
        </div>
    );
}
{/* /분석 완료/ */}