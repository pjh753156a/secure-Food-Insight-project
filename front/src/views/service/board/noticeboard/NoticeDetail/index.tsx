import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useUserStore } from 'src/stores';

import ResponseDto from 'src/apis/response.dto';
import { GetNoticeBoardResponseDto } from 'src/apis/board/noticeboard/dto/response';

import { deleteNoticeBoardRequest, getNoticeBoardRequest, increaseViewCountRequest } from 'src/apis/board/noticeboard';

import { NOTICE_BOARD_LIST_ABSOLUTE_PATH, NOTICE_BOARD_UPDATE_ABSOLUTE_PATH, SIGN_IN_ABSOLUTE_PATH } from 'src/constant';

import './style.css';

// component //
export default function NoticeDetail() 
{
    // state //
    const [cookies] = useCookies();
    const { noticeNumber } = useParams();
    const [viewCount, setViewCount] = useState<number>(0);
    const { loginUserEmailId, loginUserRole } = useUserStore();
    const [noticeTitle, setNoticeTitle] = useState<string>('');
    const [noticeFile, setNoticeFile] = useState<string>('');
    const [noticeFileName, setNoticeFileName] = useState<string>('');
    const [noticeWriterId, setNoticeWriterId] = useState<string>('');
    const [noticeContents, setNoticeContents] = useState<string>('');
    const [noticeWriteDatetime, setNoticeWriteDatetime] = useState<string>('');
    const [noticeWriterNickname, setNoticeWriterNickname] = useState<string>('');

    // function //
    const navigation = useNavigate();

    const increaseViewCountResponse = (result: ResponseDto | null) => 
    {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '잘못된 공지번호입니다.' :
            result.code === 'AF' ? '인증에 실패했습니다.' :
            result.code === 'NB' ? '존재하지 않는 게시물입니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') 
        {
            alert(message);
            if (result?.code === 'AF') 
            {
                navigation(SIGN_IN_ABSOLUTE_PATH);
                return;
            }
            navigation(NOTICE_BOARD_LIST_ABSOLUTE_PATH);
            return;
        }

        if (!noticeNumber) return;
        getNoticeBoardRequest(noticeNumber, cookies.accessToken).then(getNoticeBoardResponse);
    };

    const getNoticeBoardResponse = (result: GetNoticeBoardResponseDto | ResponseDto | null) => 
    {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '잘못된 공지번호입니다.' :
            result.code === 'AF' ? '인증에 실패했습니다.' :
            result.code === 'NB' ? '존재하지 않는 게시물입니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU')
        {
            alert(message);
            if (result?.code === 'AF') 
            {
                navigation(SIGN_IN_ABSOLUTE_PATH);
                return;
            }
            navigation(NOTICE_BOARD_LIST_ABSOLUTE_PATH);
            return;
        }

        const { noticeTitle, noticeWriterId, noticeWriterNickname, noticeWriteDatetime, noticeContents, viewCount, noticeFile, noticeFileName } = result as GetNoticeBoardResponseDto;
        setNoticeTitle(noticeTitle);
        setNoticeWriterId(noticeWriterId);
        setNoticeWriterNickname(noticeWriterNickname);
        setNoticeWriteDatetime(noticeWriteDatetime);
        setNoticeContents(noticeContents);
        setViewCount(viewCount);
        setNoticeFile(noticeFile);
        setNoticeFileName(noticeFileName);
    };

    {/* 3차 프로젝트 분석시작 */}
    const deleteNoticeBoardResponse = (result: ResponseDto | null) => 
    {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'VF' ? '올바르지 않은 접수번호입니다.' :
            result.code === 'NB' ? '존재하지 않는 게시물입니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        if (!result || result.code !== 'SU') 
        {
            alert(message);
            return;
        }
        navigation(NOTICE_BOARD_LIST_ABSOLUTE_PATH);
    };
    {/* 3차 프로젝트 분석완료 */}
    
    // event handler //
    const onListClickHandler = () => navigation(NOTICE_BOARD_LIST_ABSOLUTE_PATH);
    
    {/* 3차 프로젝트 분석시작 */}
    const onUpdateClickHandler = () => 
    {
        if (!noticeNumber || loginUserEmailId !== noticeWriterId) return;
        navigation(NOTICE_BOARD_UPDATE_ABSOLUTE_PATH(noticeNumber));
    };
    
    const onDeleteClickHandler = () => 
    {
        if (!noticeNumber || loginUserEmailId !== noticeWriterId || !cookies.accessToken) return;

        const isConfirm = window.confirm('게시물을 삭제하시겠습니까?');
        if (!isConfirm) return;

        deleteNoticeBoardRequest(noticeNumber, cookies.accessToken).then(deleteNoticeBoardResponse);
    };
    {/* 3차 프로젝트 분석완료 */}
    
    // effect //
    useEffect(() => 
    {
        if (!noticeNumber) return;
        increaseViewCountRequest(noticeNumber, cookies.accessToken).then(increaseViewCountResponse);
    }, []);

    // render //
    return (
        <div id='notice-detail-wrapper'>
            <div className='notice-detail-main-box'>
                <div className='notice-detail-top-box'>
                    <div className="notice-detail-title">{noticeTitle}</div>
                    <div className='notice-detail-info-box'>
                        <div className='notice-detail-info'>작성자 {noticeWriterNickname}</div>
                        <div className='notice-detail-info-divider'>{'\|'}</div>
                        <div className='notice-detail-info'>작성일 {noticeWriteDatetime}</div>
                        <div className='notice-detail-info-divider'>{'\|'}</div>
                        <div className='notice-detail-info'>조회수 {viewCount}</div>
                    </div>
                </div>
                {noticeFileName && (
                <a href={`http://localhost:9999/download/board/notice?file=${encodeURIComponent(noticeFileName)}`} download>
                    {noticeFileName}
                </a>
                )}
                <div className="notice-detail-contents-box">{noticeContents}</div>
            </div>
            <div className='notice-detail-bottom-box'>
                <div className='primary-button' onClick={onListClickHandler}>목록보기</div>
                {/* 3차 프로젝트 분석시작 */}
                { loginUserEmailId === noticeWriterId && loginUserRole === 'ROLE_ADMIN' &&
                    (<div className="notice-detail-button-box">
                        <div className="second-button" onClick={onUpdateClickHandler}>수정</div>
                        <div className="error-button" onClick={onDeleteClickHandler}>삭제</div>
                    </div>)}
            </div>
        </div>
    );
}
{/* 3차 프로젝트 분석완료 */}
{/*분석 완료*/}