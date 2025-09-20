import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

import InputBox from "src/components/InputBox";

import ResponseDto from "src/apis/response.dto";
import { SignInRequestDto } from "src/apis/auth/dto/request";
import { SignInResponseDto } from "src/apis/auth/dto/response";

import { signInRequest } from "src/apis/auth";

import { FIND_EMAIL_INPUT_ABSOLUTE_PATH, MAIN_PATH, PASSWORD_RESET_INPUT_ABSOLUTE_PATH, SERVER_DOMAIN_URL, SIGN_IN_ABSOLUTE_PATH, SIGN_UP_ABSOLUTE_PATH} from "src/constant";

import "./style.css";
import { useAuthStore, useUserStore } from "src/stores";

// component: Sns 로그인 //
export function Sns() 
{

    // state //
    const [, setCookie] = useCookies();
    const { accessToken, expires } = useParams();

    // function //
    const navigation = useNavigate();

    // effect //
    useEffect(() => 
    {
        if (!accessToken || !expires) return;
        const expiration = new Date(Date.now() + (Number(expires) * 1000));
        setCookie('accessToken', accessToken, { path: '/', expires: expiration });

        navigation(SIGN_IN_ABSOLUTE_PATH);
    }, []);

    // render //
    return (
        <></>
    );
}

// interface //
interface SnsContainerProps 
{
    title: string;
}

// component // 
function SnsContainer({ title }: SnsContainerProps) 
{
    // event handler //
    const onSnsButtonClickHandler = (type: 'kakao' | 'naver') => 
    {
        window.location.href = SERVER_DOMAIN_URL +'/api/v1/auth/oauth2/' + type;
    };
    
    // render: sns화면 //
    return (
        <div className="authentication-sns-container">
            <div className="sns-container-title">{title}</div>
            <div className="sns-button-container">
                <div className="sns-button kakao-button" onClick={() => onSnsButtonClickHandler('kakao')}></div>
                <div className="sns-button naver-button" onClick={() => onSnsButtonClickHandler('naver')}></div>
            </div>
        </div>
    );
}


{/* 3차 프로젝트 분석시작 */}
//   component: 로그인   //
export default function SignIn() 
{
    // state //
    const [, setCookie] = useCookies();
    const [lockRemain, setLockRemain] = useState(30);
    const [message, setMessage] = useState<string>('');
    const [emailId, setEmailId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    let { SFcount, setSFcount} = useAuthStore();
    
    // function // 
    const navigation = useNavigate();
    const signInResponse = (result: SignInResponseDto | ResponseDto | null) => 
    {

        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '아이디와 비밀번호를 모두 입력하세요.' :
            result.code === 'SF' ? '로그인 정보가 일치하지 않습니다.' :
            result.code === 'TF' ? '서버에 문제가 있습니다.' :
            result.code === 'DBE' ? result.message : '';
        setMessage(message);

        const isSuccess = result && result.code === 'SU';

        if (!isSuccess)
        {
            if(result == null) return;
        
            if(result.code === 'SF')
            {
                setSFcount(++SFcount)
            }

            return;
        }
        
        const { accessToken, expires, csrfToken } = result as SignInResponseDto;
        const expiration = new Date(Date.now() + (expires * 1000));
        setCookie('accessToken', accessToken, { path: '/', expires: expiration })
        setCookie('csrfToken', csrfToken, { path: '/', expires: expiration })
        
        navigation(MAIN_PATH);
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

        const requestBody: SignInRequestDto = 
        {
            userEmailId: emailId,
            password: password
        }
        signInRequest(requestBody).then(signInResponse);
    };
    {/* 3차 프로젝트 분석완료 */}

    const onFindEmailInputClickHandler = () => navigation(FIND_EMAIL_INPUT_ABSOLUTE_PATH)
    const onPasswordResetInputClickHandler = () => navigation(PASSWORD_RESET_INPUT_ABSOLUTE_PATH)
    {/* 3차 프로젝트 분석시작 */}
    const onSignUpClickHandler = () => navigation(SIGN_UP_ABSOLUTE_PATH)
    {/* 3차 프로젝트 분석완료 */}

    //                      effect                         //
    useEffect(() => 
    {
        if (SFcount >= 5) 
        {
            setLockRemain(30);
            const timer = setInterval(() => 
            {
                setLockRemain(prev => 
                {
                    if (prev <= 1) 
                    {
                        clearInterval(timer);
                        setSFcount(0);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [SFcount]);

    useEffect(() => 
    {
        if (SFcount >= 5)
        {
            setSFcount(0);
        }
    }, [SFcount]);

    //   render   //
    return (
        <div id="authentication-wrapper">
            <div className="authentication-contents">
                <div className="authentication-sign-title">로그인</div>
                <div className="authentication-sign-container">
                {SFcount >= 5 ? 
                    <div className="authentication-failed">5회 이상 실패하여 {lockRemain}초 뒤에 다시 할 수 있습니다</div>
                        :
                    <div className="authentication-contents-box">
                        <div className="authentication-input-container">
                            <InputBox type="text" value={emailId} placeholder="이메일을 입력해주세요" 
                            onChangeHandler={onEmailIdChangeHandler} />
                            <InputBox type="password" value={password} placeholder="비밀번호를 입력해주세요" 
                            onChangeHandler={onPasswordChangeHandler} onKeydownHandler={onPasswordKeydownHandler} 
                            message={message} error />
                        </div>
                        {/* 3차 프로젝트 분석시작 */}
                        <div className="authentication-button-container">
                            <div className="primary-button full-width" onClick={onSignInButtonClickHandler}>로그인</div>
                        </div>
                        {/* 3차 프로젝트 분석완료 */}
                    </div>
                    }
                    <div className="find-container">
                        <div className="find-email">
                            <div className="text-link" onClick={onFindEmailInputClickHandler}>이메일 찾기</div>
                        </div>
                        <div className="find-divider">{'\|'}</div>
                        <div className="reset-password">
                            <div className="text-link" onClick={onPasswordResetInputClickHandler}>비밀번호 재설정</div>
                        </div>
                        {/* 3차 프로젝트 분석시작 */}
                        <div className="find-divider">{'\|'}</div>
                        <div className="user-sign-up">
                            <div className="text-link" onClick={onSignUpClickHandler}>회원가입</div>
                        </div>
                    </div>
                    {/* 3차 프로젝트 분석완료 */}
                    <SnsContainer title="SNS 로그인" />
                </div>
            </div>
        </div>
    );
}
{/* 분석 완료 */}