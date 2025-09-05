import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { ChangeEvent, KeyboardEvent, useState } from "react";

import InputBox from "src/components/InputBox";

import ResponseDto from "src/apis/response.dto";
import { AdminSignInRequestDto } from "src/apis/auth/dto/request";
import { AdminSignInResponseDto } from "src/apis/auth/dto/response";

import { AdminSignInRequest } from "src/apis/auth";

import { ADMIN_PAGE_SITE_ABSOLUTE_PATH } from "src/constant";

import "./style.css";

//   component: 로그인   //
export default function AdminSignIn() 
{
    // state //
    const [, setCookie] = useCookies();
    const [message, setMessage] = useState<string>('');
    const [emailId, setEmailId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    
    // function // 
    const navigation = useNavigate();

    const AdminSignInResponse = (result: AdminSignInResponseDto | ResponseDto | null) => 
    {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '아이디와 비밀번호를 모두 입력하세요.' :
            result.code === 'SF' ? '로그인 정보가 일치하지 않습니다.' :
            result.code === 'TF' ? '서버에 문제가 있습니다.' :
            result.code === 'DBE' ? result.message : '';
        setMessage(message);

        const isSuccess = result && result.code === 'SU';
        if (!isSuccess) return;

        const { accessToken, expires } = result as AdminSignInResponseDto;
        const expiration = new Date(Date.now() + (expires * 1000));
        setCookie('accessToken', accessToken, { path: '/', expires: expiration })

        navigation(ADMIN_PAGE_SITE_ABSOLUTE_PATH);
    };
    {/* 3차 프로젝트 분석완료 */}

    // event handler //
    const onEmailIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
    {
        setEmailId(event.target.value);
        setMessage('');
    };

    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
    {
        setPassword(event.target.value);
        setMessage('');
    };

    const onPasswordKeydownHandler = (event: KeyboardEvent<HTMLInputElement>) => 
    {
        if (event.key !== 'Enter') return;
        onSignInButtonClickHandler();
    };
    
    {/* 3차 프로젝트 분석시작 */}
    const onSignInButtonClickHandler = () => 
    {
        if (!emailId || !password) 
        {
            setMessage('이에일과 비밀번호를 모두 입력하세요.');
            return;
        }

        const requestBody: AdminSignInRequestDto = 
        {
            userEmailId: emailId,
            password: password
        }
        AdminSignInRequest(requestBody).then(AdminSignInResponse);
    };
    {/* 3차 프로젝트 분석완료 */}

    //   render   //
    return (
        <div id="authentication-wrapper">
            <div className="authentication-contents">
                <div className="authentication-sign-title">관리자 로그인</div>
                <div className="authentication-sign-container">
                    <div className="authentication-contents-box">
                        <div className="authentication-input-container">
                            <InputBox type="text" value={emailId} placeholder="이메일을 입력해주세요" onChangeHandler={onEmailIdChangeHandler} />
                            <InputBox type="password" value={password} placeholder="비밀번호를 입력해주세요" onChangeHandler={onPasswordChangeHandler} onKeydownHandler={onPasswordKeydownHandler} message={message} error />
                        </div>
                        {/* 3차 프로젝트 분석시작 */}
                        <div className="authentication-button-container">
                            <div className="primary-button full-width" onClick={onSignInButtonClickHandler}>관리자 로그인</div>
                        </div>
                        {/* 3차 프로젝트 분석완료 */}
                    </div>
                </div>
            </div>
        </div>
    );
}
{/* 분석 완료 */}