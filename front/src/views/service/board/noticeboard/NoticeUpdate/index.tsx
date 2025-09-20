import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { useUserStore } from 'src/stores';

import ResponseDto from 'src/apis/response.dto';
import { GetNoticeBoardResponseDto } from 'src/apis/board/noticeboard/dto/response';
import { PatchNoticeBoardRequestDto } from 'src/apis/board/noticeboard/dto/request';

import { getNoticeBoardRequest, patchNoticeBoardRequest } from 'src/apis/board/noticeboard';

import { NOTICE_BOARD_LIST_ABSOLUTE_PATH, NOTICE_BOARD_WRITE_ABSOLUTE_PATH, NOTICE_DETAILS_ABSOLUTE_PATH } from 'src/constant';

import './style.css';

// component //
export default function NoticeUpdate() 
{
  // state //
  const [cookies] = useCookies();
  const { noticeNumber } = useParams();
  const [noticeTitle, setNoticeTitle] = useState<string>('');
  const { loginUserEmailId, loginUserRole } = useUserStore();
  const contentsRef = useRef<HTMLTextAreaElement | null>(null);
  const [noticeContents, setNoticeContents] = useState<string>('');
  const [noticeFile, setNoticeFile] = useState<string>("");
  const [noticeFileName, setNoticeFileName] = useState<string>("");

  // function //
  const navigation = useNavigate();

  const getNoticeBoardResponse = (result: GetNoticeBoardResponseDto | ResponseDto | null) => 
  {
    const message =
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'VF' ? '올바르지 않은 접수 번호입니다.' :
      result.code === 'AF' ? '인증에 실패했습니다.' :
      result.code === 'NB' ? '존재하지 않는 접수 번호입니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    if (!result || result.code !== 'SU') 
    {
      alert(message);
      navigation(NOTICE_BOARD_LIST_ABSOLUTE_PATH);
      return;
    }

    const { noticeWriterId, noticeContents, noticeTitle } = result as GetNoticeBoardResponseDto;
    if (noticeWriterId !== loginUserEmailId) 
    {
      alert('권한이 없습니다.');
      navigation(NOTICE_BOARD_LIST_ABSOLUTE_PATH);
      return;
    }
    setNoticeTitle(noticeTitle)
    setNoticeContents(noticeContents);
  };

  {/* 3차 프로젝트 분석시작 */}
  const patchNoticeBoardResponse = (result: ResponseDto | null) => 
  {
    const message =
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'AF' ? '권한이 없습니다.' :
      result.code === 'VF' ? '모든 값을 입력해주세요.' :
      result.code === 'NB' ? '존재하지 않는 접수 번호입니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    if (!result || result.code !== 'SU') 
    {
      alert(message);
      return;
    }

    if (!noticeNumber) return;
    navigation(NOTICE_DETAILS_ABSOLUTE_PATH(noticeNumber));
  };
  {/* 3차 프로젝트 분석완료 */}

  // event handler //
  const onNoticeTitleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const noticeTitle = event.target.value;
    setNoticeTitle(noticeTitle);
  };
  
  const onNoticeContentsChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => 
  {
    const noticeContents = event.target.value;

    if (noticeContents.length > 500) return;
    setNoticeContents(noticeContents);

    if (!contentsRef.current) return;
    contentsRef.current.style.height = 'auto';
    contentsRef.current.style.height = `${contentsRef.current.scrollHeight}px`;
  };

  const onFileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
      const file = event.target.files?.[0];
      if (file) 
      {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => 
          {
              const base64String = reader.result?.toString();
              if (base64String) 
              {
                  setNoticeFile(base64String);
                  setNoticeFileName(file.name);
              }
          };
      }
  }

  {/* 3차 프로젝트 분석시작 */}
  const onNoticeUpdateButtonClickHandler = () => 
  {
    if (!cookies.accessToken || !noticeNumber) return;
    
    if (!noticeTitle.trim() || !noticeContents.trim()) return;

    const requestBody: PatchNoticeBoardRequestDto = { noticeTitle, noticeContents, noticeFile, noticeFileName };
    patchNoticeBoardRequest(noticeNumber, requestBody, cookies.accessToken).then(patchNoticeBoardResponse);
  };
  {/* 3차 프로젝트 분석완료 */}
  
  // effect //
  let effectFlag = false;

  useEffect(() => 
  {
      if (!noticeNumber || !cookies.accessToken) return;
      if (!loginUserRole) return;
      if (effectFlag) return;
      effectFlag = true;
      if (loginUserRole !== 'ROLE_ADMIN') 
      {
          alert('권한이 없습니다.');
          navigation(NOTICE_BOARD_LIST_ABSOLUTE_PATH);
          return;
      }
      getNoticeBoardRequest(noticeNumber, cookies.accessToken).then(getNoticeBoardResponse);
  }, [loginUserRole]);

  // render //
  return (
    <div id='notice-update-wrapper'>
      <div className='notice-update-main-box'>
        <div className='notice-update-title-box'>
          <input className='notice-update-title-input' placeholder='제목을 입력해주세요.' value={noticeTitle} onChange={onNoticeTitleChangeHandler} />
        </div>
        <input type="file" onChange={onFileChangeHandler} className="notice-file-input"/>
        <div className='notice-update-contents-box'>
          <textarea ref={contentsRef} className='notice-update-contents-textarea' placeholder='내용을 입력해주세요.' maxLength={1000} value={noticeContents} onChange={onNoticeContentsChangeHandler} />
          {/* 3차 프로젝트 분석시작 */}
          <div className='primary-button' onClick={onNoticeUpdateButtonClickHandler}>수정</div>
        </div>
      </div>
    </div>
  );
};
{/* 3차 프로젝트 분석완료 */}
{/*분석 완료*/}