import { useNavigate } from 'react-router';
import { ChangeEvent, useState } from 'react';

import InputBox from 'src/components/InputBox';

import ResponseDto from 'src/apis/response.dto';
import { FindEmailRequestDto } from 'src/apis/auth/dto/request';

import { findEmailRequest } from 'src/apis/auth';

import { PASSWORD_RESET_INPUT_ABSOLUTE_PATH, SIGN_IN_ABSOLUTE_PATH } from 'src/constant';

import './style.css';
import { FindEmailResponseDto } from 'src/apis/auth/dto/response';

// component: 이메일 찾기 // 
export default function FindEmailInput() 
{

    // state //
    const [userName, setUserName] = useState<string>('');
    const [userEmailId, setUserEmailId] = useState<string>('');
    const [userTelNumber, setUserTelNumber] = useState<string>('');
    const [userTelNumberButtonStatus, setUserTelNumberButtonStatus] = useState<boolean>(false);
    
    const findEmailButtonClass = `${userName && userTelNumber ? 'primary' : 'disable'}-button full-width`;

    // function // 
    const navigation = useNavigate();

    const findEmailResponse = (result: ResponseDto | null) => 
    {

        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'NF' ? '사용자 정보 불일치합니다.' : 
            result.code === 'NU' ? '사용자 정보가 없습니다.' : 
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : ''
    
        const isSuccess = result && result.code === 'SU';
        if (!isSuccess) 
        {
            alert(message);
            return;
        }

        const {userEmailId} = result as FindEmailResponseDto;
        setUserEmailId(userEmailId);
    };
    {/* 3차 프로젝트 분석완료 */}
    
    // event handler // 
    const onUserNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { value } = event.target;
        setUserName(value);
    };

    const onUserTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { value } = event.target;
        setUserTelNumber(value);
        setUserTelNumberButtonStatus(value !== '');
    };

    {/* 3차 프로젝트 분석시작 */}
    const onFindEmailButtonClickHandler = () => 
    {
        if (!userName || !userTelNumber) 
        {
            alert('모든 내용을 입력해주세요.');
            return;
        }

        const requestBody: FindEmailRequestDto = 
        {
            userName: userName,
            userTelNumber: userTelNumber
        }
        findEmailRequest(requestBody).then(findEmailResponse);
    };
    {/* 3차 프로젝트 분석완료 */}
    
    const onSignInClickHandler = () => navigation(SIGN_IN_ABSOLUTE_PATH)
    const onPasswordResetInputClickHandler = () => navigation(PASSWORD_RESET_INPUT_ABSOLUTE_PATH)
    
   // render //
    return (
        <div className='find-email-container'>
            <div className='find-email-title'>이메일 찾기</div>
            <div className='find-email-box'>
                <div className='find-email-input'>
                    <InputBox type="text" value={userName} placeholder="이름을 입력해주세요" onChangeHandler={onUserNameChangeHandler} />
                    <InputBox type="text" value={userTelNumber} placeholder="전화번호를 입력해주세요" onChangeHandler={onUserTelNumberChangeHandler} buttonStatus={userTelNumberButtonStatus} />
                </div>
                {/* 3차 프로젝트 분석시작 */}
                <div className='find-email-button'>
                    <div className={findEmailButtonClass} onClick={onFindEmailButtonClickHandler}>이메일 찾기</div> 
                </div>
                {/* 3차 프로젝트 분석완료 */}
                {userEmailId &&
                    <div>
                        <div className='return-email-id' >* {userEmailId}</div>
                    </div>
                }
                <div className='navigation-button'>
                    <div className='moving-sign-up' onClick={onSignInClickHandler}>로그인</div>
                    <div className="find-divider">{'\|'}</div>
                    <div className='moving-password-reset' onClick={onPasswordResetInputClickHandler}>비밀번호 재설정</div>
                </div>
            </div>
        </div>
    )
}
{/* 분석 완료 */}
