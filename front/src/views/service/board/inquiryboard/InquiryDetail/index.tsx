import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';
import { ChangeEvent, useEffect, useState } from 'react';

import { useUserStore } from 'src/stores';

import ResponseDto from 'src/apis/response.dto';
import { PostCommentRequestDto } from 'src/apis/board/inquiryboard/dto/request';
import { GetInquiryBoardResponseDto } from 'src/apis/board/inquiryboard/dto/response';

import { deleteInquiryBoardRequest, getInquiryBoardRequest, postCommentRequest } from 'src/apis/board/inquiryboard';

import { INQUIRY_BOARD_LIST_ABSOLUTE_PATH, INQUIRY_BOARD_LIST_PATH, INQUIRY_BOARD_UPDATE_ABSOLUTE_PATH, SIGN_IN_ABSOLUTE_PATH } from 'src/constant';

import './style.css';
import { fileURLToPath } from 'url';

// component //
export default function InquiryDetail() 
{
    // state //
    const [cookies,,removeCookie] = useCookies();
    const { inquiryNumber } = useParams();
    const [status, setStatus] = useState<boolean>(false);
    const [commentRows, setCommentRows] = useState<number>(1);
    const { loginUserEmailId, loginUserRole, setLoginUserEmailId, setLoginUserRole}  = useUserStore();
    const [inquiryTitle, setInquiryTitle] = useState<string>('');
    const [inquiryFile, setInquiryFile] = useState<string>('');
    const [inquiryFileName, setInquiryFileName] = useState<string>('');
    const [inquiryWriterId, setInquiryWriterId] = useState<string>('');
    const [inquiryContents, setInquiryContents] = useState<string>('');
    const [inquiryComment, setInquiryComment] = useState<string | null>(null);
    const [inquiryWriteDatetime, setInquiryWriteDatetime] = useState<string>('');
    const [inquiryWriterNickname, setInquiryWriterNickname] = useState<string>('');

    // function //
    const navigation = useNavigate();

    /* 3차 프로젝트 분석시작 */
    const getInquiryBoardResponse = (result: GetInquiryBoardResponseDto | ResponseDto | null) => 
    {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '잘못된 접수번호입니다.' : 
            result.code === 'AF' ? '인증에 실패했습니다.' :
            result.code === 'NB' ? '존재하지 않는 접수번호입니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') 
        {
            alert(message);
            if (result?.code === 'AF') 
            {
                removeCookie('accessToken', { path: '/' });
                removeCookie('csrfToken', { path: '/' });
                setLoginUserEmailId('');
                setLoginUserRole('');
                navigation(SIGN_IN_ABSOLUTE_PATH);
                return;
            }
            navigation(INQUIRY_BOARD_LIST_ABSOLUTE_PATH);
            return;
        }

        const { inquiryTitle, inquiryWriterId, inquiryWriteDatetime, inquiryContents, inquiryComment, inquiryWriterNickname, status, inquiryFile, inquiryFileName  } = result as GetInquiryBoardResponseDto;
        setInquiryTitle(inquiryTitle);
        setInquiryWriterId(inquiryWriterId);
        setInquiryWriterNickname(inquiryWriterNickname);
        setInquiryWriteDatetime(inquiryWriteDatetime);
        setInquiryContents(inquiryContents);
        setInquiryComment(inquiryComment);
        setStatus(status);
        setInquiryFile(inquiryFile);
        setInquiryFileName(inquiryFileName);
    };
    /* 3차 프로젝트 분석완료 */

    const postInquiryCommentResponse = (result: ResponseDto | null) => 
    {
        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '입력 데이터가 올바르지 않습니다.' : 
            result.code === 'NB' ? '존재하지 않는 게시물입니다.' :
            result.code === 'WC' ? '이미 답글이 작성된 게시물입니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
    
        if (!result || result.code !== 'SU') 
        {
            alert(message);
            return;
        }

        if (!inquiryNumber || !cookies.accessToken) return;
        getInquiryBoardRequest(inquiryNumber, cookies.accessToken).then(getInquiryBoardResponse);
    };

    /* 3차 프로젝트 분석시작 */
    const deleteInquiryBoardResponse = (result: ResponseDto | null) => 
    {
        const message = 
            !result ? '서버에 문제가 있습니다.' : 
            result.code === 'VF' ? '올바르지 않은 접수번호입니다.' : 
            result.code === 'NB' ? '존재하지 않는 게시물입니다.' : 
            result.code === 'AF' ? '권한이 없습니다.' : 
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') 
        {
            alert(message);
            return;
        }
        navigation(INQUIRY_BOARD_LIST_ABSOLUTE_PATH);
    };
    /* 3차 프로젝트 분석완료 */
    
    // event handler //
    const onCommentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => 
    {
        if (status || loginUserRole !== 'ROLE_ADMIN') return;

        const inquiryComment = event.target.value;
        setInquiryComment(inquiryComment);

        const commentRows = inquiryComment.split('\n').length;
        setCommentRows(commentRows);
    };

    const onCommentSubmitClickHandler = () => 
    {
        if (!inquiryComment || !inquiryComment.trim()) return;

        if (!inquiryNumber || loginUserRole !== 'ROLE_ADMIN' || !cookies.accessToken) return;
        
        const requestBody: PostCommentRequestDto = { inquiryComment };
        postCommentRequest(inquiryNumber, requestBody, cookies.accessToken).then(postInquiryCommentResponse);
    };
    
    const onListClickHandler = () => 
    {
        navigation(INQUIRY_BOARD_LIST_ABSOLUTE_PATH);
    };

    {/* 3차 프로젝트 분석시작 */}
    const onUpdateClickHandler = () => 
    {
        if (!inquiryNumber || loginUserEmailId !== inquiryWriterId || status ) return;
        navigation(INQUIRY_BOARD_UPDATE_ABSOLUTE_PATH(inquiryNumber));
    };

    const onDeleteClickHandler = () => 
    {
        if (!inquiryNumber || (loginUserEmailId !== inquiryWriterId && loginUserRole !== 'ROLE_ADMIN') || !cookies.accessToken) return;
        
        const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!isConfirm) return;
    
        deleteInquiryBoardRequest(inquiryNumber, cookies.accessToken).then(deleteInquiryBoardResponse);
    };
    
    // effect //
    useEffect(() => 
    {
        if (!inquiryNumber) return;
        getInquiryBoardRequest(inquiryNumber, cookies.accessToken).then(getInquiryBoardResponse);
    }, []);
    /* 3차 프로젝트 분석완료 */

    //                    render                    //
    return (
        <div id='inquiry-detail-wrapper'>
            <div className='inquiry-detail-main-box'>
                <div className='inquiry-detail-top-box'>
                    <div className='inquiry-detail-title'>{inquiryTitle}</div>
                    <div className='inquiry-detail-info-box'>
                        <div className='inquiry-detail-info'>작성자 {inquiryWriterNickname}</div>
                        <div className='inquiry-detail-info-divider'>{'\|'}</div>
                        <div className='inquiry-detail-info'>작성일 {inquiryWriteDatetime}</div>
                    </div>
                </div>
                {inquiryFileName && (
                <a href={`http://localhost:9999/download/board/inquiry?file=${encodeURIComponent(inquiryFileName)}`} download>
                    {inquiryFileName}
                </a>
                )}
                <div className='inquiry-detail-contents-box'>{inquiryContents}</div>
            </div>
            { loginUserRole === 'ROLE_ADMIN' && !status &&
                <div className='inquiry-detail-comment-write-box'>
                    <div className='inquiry-detail-comment-textarea-box'>
                        <textarea style={{height: `${40 * commentRows}px`}} className='inquiry-detail-comment-textarea' placeholder='답글을 작성해주세요.' value={inquiryComment === null ? '' : inquiryComment} onChange={onCommentChangeHandler} />
                    </div>
                    <div className='primary-button' onClick={onCommentSubmitClickHandler}>답글달기</div>
                </div>
            }
            { status && 
                <div className='inquiry-detail-comment-box'>
                    <div className='primary-bedge'>답변</div>
                    <div className='inquiry-detail-comment'>{inquiryComment}</div>
                </div>
            }
            <div className='inquiry-detail-button-box'>
                <div className='primary-button' onClick={onListClickHandler}>목록보기</div>
                {/* 3차 프로젝트 분석시작 */}
                { (loginUserEmailId === inquiryWriterId || loginUserRole === 'ROLE_ADMIN') &&
                    <div className='inquiry-detail-owner-button-box'>
                        { !status && loginUserRole !== 'ROLE_ADMIN' && <div className='second-button' onClick={onUpdateClickHandler}>수정</div> }
                        <div className='error-button' onClick={onDeleteClickHandler}>삭제</div>
                    </div>
                }
            </div>
        </div>
    );
}
{/* 3차 프로젝트 분석완료 */}

//<iframe className='inquiry-detail-contents-box' srcDoc={inquiryContents}></iframe>