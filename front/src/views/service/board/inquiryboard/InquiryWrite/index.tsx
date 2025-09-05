import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { ChangeEvent, useEffect, useRef, useState } from 'react'

import { useUserStore } from 'src/stores';

import ResponseDto from 'src/apis/response.dto';
import { PostInquiryBoardRequestDto } from 'src/apis/board/inquiryboard/dto/request';

import { postInquiryBoardRequest } from 'src/apis/board/inquiryboard';

import { INQUIRY_BOARD_LIST_ABSOLUTE_PATH } from 'src/constant';

import './style.css';

// component : 문의 글쓰기 // 
export default function InquiryWrite() 
{
  // state //
  const [cookies] = useCookies();
  const { loginUserRole } = useUserStore();
  const [inquiryTitle, setInquiryTitle] = useState<string>('');
  const contentsRef = useRef<HTMLTextAreaElement | null>(null);
  const [inquiryContents, setInquiryContents] = useState<string>('');
  const [inquiryPublic, setInquiryPublic] = useState<boolean>(false);
  const [inquiryFile, setInquiryFile] = useState<string>("");
  const [inquiryFileName, setInquiryFileName] = useState<string>("");
  
  // function //
  const navigation = useNavigate();

  const postBoardResponse = (result: ResponseDto | null) => 
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
    navigation(INQUIRY_BOARD_LIST_ABSOLUTE_PATH);
  };
  
  // event handler //
  const onInquiryTitleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const inquiryTitle = event.target.value;
    setInquiryTitle(inquiryTitle);
  };

  const onInquiryContentsChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => 
  {
    const inquiryContents = event.target.value;

    if (inquiryContents.length > 500) return;
    setInquiryContents(inquiryContents);

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
                  setInquiryFile(base64String);
                  setInquiryFileName(file.name);
              }
          };
      }
  }

  const onPostButtonClickHandler = () => 
  {
    if (!inquiryContents.trim() || !inquiryTitle.trim()) return;
    if (!cookies.accessToken) return;

    const requestBody: PostInquiryBoardRequestDto = {inquiryTitle, inquiryContents, inquiryPublic, inquiryFile, inquiryFileName };
    postInquiryBoardRequest(requestBody, cookies.accessToken).then(postBoardResponse);
  };
  
  const onPublicButtonClickHandler = () => setInquiryPublic(!inquiryPublic);
  
  // effect //
  useEffect(() => 
  {
    if (!cookies.accessToken) 
    {
      navigation(INQUIRY_BOARD_LIST_ABSOLUTE_PATH);
      return;
    }
    
    if (loginUserRole === 'ROLE_ADMIN') 
    {
      navigation(INQUIRY_BOARD_LIST_ABSOLUTE_PATH);
      return;
    }
  }, [loginUserRole]);

  // render //
  const publicButtonClass = inquiryPublic ? 'public-button' : 'un-public-button';
  return (
    <div id='inquiry-write-wrapper'>
      <div className='inquiry-write-main-box'>
        <div className='inquiry-write-title-box'>
          <input className='inquiry-write-title-input' placeholder='제목을 입력해주세요.' value={inquiryTitle} onChange={onInquiryTitleChangeHandler} />
        </div>
        <input type="file" onChange={onFileChangeHandler} className="inquiry-file-input"/>
        <div className='inquiry-write-contents-box'>
          <textarea ref={contentsRef} className='inquiry-write-contents-textarea' placeholder='내용을 입력해주세요. / 500자' maxLength={500} value={inquiryContents} onChange={onInquiryContentsChangeHandler} />
          <div className='inquiry-bottom-button-box'>
            <div className={publicButtonClass} onClick={onPublicButtonClickHandler}>{ inquiryPublic ? '공개' : '비공개' }</div>
            <div className='primary-button' onClick={onPostButtonClickHandler}>작성</div>
          </div>
        </div>
      </div>
    </div>
  );
}
{/*분석 완료*/}