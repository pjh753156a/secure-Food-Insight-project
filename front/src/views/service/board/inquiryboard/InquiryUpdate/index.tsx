import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';
import { ChangeEvent, useEffect, useRef, useState } from 'react'

import { useUserStore } from 'src/stores';

import ResponseDto from 'src/apis/response.dto';
import { GetInquiryBoardResponseDto } from 'src/apis/board/inquiryboard/dto/response';
import { PatchInquiryBoardRequestDto } from 'src/apis/board/inquiryboard/dto/request';

import { getInquiryBoardRequest, patchInquiryBoardRequest } from 'src/apis/board/inquiryboard';

import { INQUIRY_BOARD_LIST_ABSOLUTE_PATH, INQUIRY_DETAILS_ABSOLUTE_PATH } from 'src/constant';

import './style.css';

// component //
export default function InquiryUpdate() 
{
  // state //
  const [cookies] = useCookies();
  const { inquiryNumber } = useParams();
  const { loginUserRole } = useUserStore();
  const [inquiryFile, setInquiryFile] = useState<string>("");
  const [inquiryTitle, setInquiryTitle] = useState<string>('');
  const contentsRef = useRef<HTMLTextAreaElement | null>(null);
  const [inquiryContents, setInquiryContents] = useState<string>('');
  const [inquiryFileName, setInquiryFileName] = useState<string>("");

  // function //
  const navigation = useNavigate();

  const getInquiryBoardResponse = (result: GetInquiryBoardResponseDto | ResponseDto | null) => 
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
      navigation(INQUIRY_BOARD_LIST_ABSOLUTE_PATH);
      return;
    }

    const { inquiryContents, inquiryTitle, status } = result as GetInquiryBoardResponseDto;

    if (!cookies.accessToken) 
    {
      alert('권한이 없습니다.');
      navigation(INQUIRY_BOARD_LIST_ABSOLUTE_PATH);
      return;
    }
    if (status) 
    {
      alert('답변이 완료된 게시물 입니다.');
      navigation(INQUIRY_BOARD_LIST_ABSOLUTE_PATH);
      return;
    }
    setInquiryTitle(inquiryTitle)
    setInquiryContents(inquiryContents);
  };

  const patchInquiryBoardResponse = (result: ResponseDto | null) => 
  {
    const message =
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'AF' ? '권한이 없습니다.' :
      result.code === 'VF' ? '모든 값을 입력해주세요.' :
      result.code === 'NB' ? '존재하지 않는 접수 번호입니다.' :
      result.code === 'WC' ? '이미 답글이 작성되어있습니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    if (!result || result.code !== 'SU') 
    {
      alert(message);
      return;
    }

    if (!inquiryNumber) return;
    navigation(INQUIRY_DETAILS_ABSOLUTE_PATH(inquiryNumber));
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

  const onInquiryUpdateButtonClickHandler = () => 
  {
    if (!cookies.accessToken || !inquiryNumber) return;

    if (!inquiryTitle.trim() || !inquiryContents.trim()) return;

    const requestBody: PatchInquiryBoardRequestDto = { inquiryTitle, inquiryContents, inquiryFile, inquiryFileName };
    patchInquiryBoardRequest(inquiryNumber, requestBody, cookies.accessToken).then(patchInquiryBoardResponse);
  };
  
  // effect //
  let effectFlag = false;
  
  useEffect(() => 
  {
    if (!inquiryNumber) return;
    if(!loginUserRole) return;
    if(effectFlag) return;
    effectFlag = true;
    if(loginUserRole !== 'ROLE_USER' && loginUserRole !== 'ROLE_CEO') 
    {
      navigation(INQUIRY_BOARD_LIST_ABSOLUTE_PATH);
      return;
    }
    getInquiryBoardRequest(inquiryNumber, cookies.accessToken).then(getInquiryBoardResponse);
  }, [loginUserRole]);
  
  // render //
  return (
    <div id='inquiry-update-wrapper'>
      <div className='inquiry-update-main-box'>
        <div className='inquiry-update-title-box'>
          <input className='inquiry-update-title-input' placeholder='제목을 입력해주세요.' value={inquiryTitle} onChange={onInquiryTitleChangeHandler} />
        </div>
        <input type="file" onChange={onFileChangeHandler} className="inquiry-file-input"/>
        <div className='inquiry-update-contents-box'>
          <textarea ref={contentsRef} className='inquiry-update-contents-textarea' placeholder='내용을 입력해주세요. / 500자' maxLength={500} value={inquiryContents} onChange={onInquiryContentsChangeHandler} />
          <div className='primary-button inquiry-update' onClick={onInquiryUpdateButtonClickHandler}>수정</div>
        </div>
      </div>
    </div>
  );
}
{/*분석 완료*/}