import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { useUserStore } from 'src/stores';

import ResponseDto from 'src/apis/response.dto';
import { PostNoticeBoardRequestDto } from 'src/apis/board/noticeboard/dto/request';

import { postNoticeBoardRequest } from 'src/apis/board/noticeboard';

import { NOTICE_BOARD_LIST_ABSOLUTE_PATH, NOTICE_BOARD_WRITE_ABSOLUTE_PATH } from 'src/constant';

import './style.css';

// component //
export default function NoticeWrite() 
{
  // state //
  const [cookies] = useCookies();
  const { loginUserRole } = useUserStore();
  const [noticeTitle, setNoticeTitle] = useState<string>('');
  const contentsRef = useRef<HTMLTextAreaElement | null>(null);
  const [noticeContents, setNoticeContents] = useState<string>('');
  const [noticeFile, setNoticeFile] = useState<string>("");
  const [noticeFileName, setNoticeFileName] = useState<string>("");

  /* 3차 프로젝트 분석시작 */
  //  function  //
  const navigation = useNavigate();

  const postNoticeBoardResponse = (result: ResponseDto | null) => 
  {
    const message =
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'VF' ? '제목과 내용을 모두 입력해주세요.' :
      result.code === 'AF' ? '권한이 없습니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    if (!result || result.code !== 'SU') 
    {
      alert(message);
      return;
    }
    navigation(NOTICE_BOARD_LIST_ABSOLUTE_PATH);
  };
  /* 3차 프로젝트 분석완료 */
  
  // event handler //
  const onNoticeTitleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const noticeTitle = event.target.value;
    setNoticeTitle(noticeTitle);
  };

  const onNoticeContentsChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => 
  {
    const noticeContents = event.target.value;

    if (noticeContents.length > 1000) return;
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
  const onPostButtonClickHandler = async () => 
  {
    if (!noticeTitle.trim() || !noticeContents.trim()) return;

    if (!cookies.accessToken) return;

    const requestBody: PostNoticeBoardRequestDto = { noticeTitle, noticeContents, noticeFile, noticeFileName };
    postNoticeBoardRequest(requestBody, cookies.accessToken).then(postNoticeBoardResponse);
  };
  {/* 3차 프로젝트 분석완료 */}
  
  // effect //
  useEffect(() => 
  {
    if (loginUserRole === 'ROLE_ADMIN') 
    {
      navigation(NOTICE_BOARD_WRITE_ABSOLUTE_PATH);
      return;
    }
  }, [loginUserRole]);

  // render //
  return (
    <div id='notice-write-wrapper'>
      <div className='notice-write-main-box'>
        <div className='notice-write-title-box'>
          <input className='notice-write-title-input' placeholder='제목을 입력해주세요.' value={noticeTitle} onChange={onNoticeTitleChangeHandler} />
        </div>
        <input type="file" onChange={onFileChangeHandler} className="notice-file-input"/>
        {/* 3차 프로젝트 분석시작 */}
        <div className='notice-write-contents-box'>
          <textarea ref={contentsRef} className='notice-write-contents-textarea' placeholder='내용을 입력해주세요.' maxLength={1000} value={noticeContents} onChange={onNoticeContentsChangeHandler} />
          <div className='primary-button' onClick={onPostButtonClickHandler}>작성</div>
        </div>
        {/* 3차 프로젝트 분석완료 */}
      </div>
    </div>
  );
}
{/*분석 완료*/}
