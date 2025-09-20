import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { ChangeEvent, useEffect, useState } from 'react'

import { useUserStore } from 'src/stores';
import { usePagination } from 'src/hooks';

import ResponseDto from 'src/apis/response.dto';
import { InquiryBoardListItem } from 'src/types';
import { GetInquiryBoardListResponseDto, GetSearchInquiryBoardListResponseDto } from 'src/apis/board/inquiryboard/dto/response';

import { getInquiryBoardListRequest, getSearchInquiryBoardListRequest } from 'src/apis/board/inquiryboard';

import { COUNT_PER_PAGE, INQUIRY_BOARD_LIST_ABSOLUTE_PATH, INQUIRY_BOARD_WRITE_ABSOLUTE_PATH, INQUIRY_DETAILS_ABSOLUTE_PATH, MAIN_ABSOLUTE_PATH } from 'src/constant';

import './style.css'

// component //
function ListItem ({
  index,
  inquiryNumber,
  status,
  inquiryPublic,
  inquiryTitle,
  inquiryWriterNickname,
  inquiryWriteDatetime,
  inquiryWriterId
}: InquiryBoardListItem & { index: number }) 
{
  // state //
  const { loginUserRole, loginUserEmailId } = useUserStore();

  // function //
  const navigation = useNavigate();
  
  {/* 3차 프로젝트 분석시작 */}
  // event handler //
  const onClickHandler = () => 
  {
    if (inquiryPublic && inquiryWriterId !== loginUserEmailId && loginUserRole !== 'ROLE_ADMIN') 
    {
      alert('비공개 게시물입니다.');
      return;
    }
    navigation(INQUIRY_DETAILS_ABSOLUTE_PATH(inquiryNumber));
  }
  
  // render //
  return(
    <div className='inquiry-list-table-tr' onClick={onClickHandler}>
      {/* 3차 프로젝트 분석완료 */}
      <div className='inquiry-list-table-reception-number'>{index + 1}</div>
      <div className='inquiry-list-table-status'>
          {status ? 
            <div className='primary-bedge'>답변</div> :
            <div className='disable-bedge'>미답변</div> 
          }
      </div>
      <div className='inquiry-list-table-public'>
          {inquiryPublic ?
            <div className='disable-bedge'>비공개</div> :
            <div className='primary-bedge'>공개</div>
          }
      </div>
      <div className='inquiry-list-table-title' style={{ textAlign: 'left' }}>{inquiryTitle}</div>
      <div className='inquiry-list-table-writer-nickname'>{inquiryWriterNickname}</div>
      <div className='inquiry-list-table-write-date'>{inquiryWriteDatetime}</div>
    </div>
  );
}

// component //
export default function InquiryList() 
{
  // state //
  const [cookies] = useCookies();
  const {loginUserRole} = useUserStore();
  {/* /분석 완료/ */}

  const {
    viewList,
    pageList,
    totalPage,
    currentPage,
    totalLength,

    setCurrentPage,
    setCurrentSection,
    changeList,

    onPageClickHandler,
    onPreSectionClickHandler,
    onNextSectionClickHandler
  } = usePagination<InquiryBoardListItem>();

  {/* /분석 시작/ */}
  const [searchWord, setSearchWord] = useState<string>('');
  const [isToggleOn, setToggleOn] = useState<boolean>(false);

  // function //
  const navigation = useNavigate();

  const getInquiryBoardListResponse = (result: GetInquiryBoardListResponseDto | ResponseDto | null) => 
  {
    const message =
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'AF' ? '인증에 실패했습니다.' : 
      result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    if (!result || result.code !== 'SU') 
    {
      alert(message);
      if (result?.code === 'AF') navigation(MAIN_ABSOLUTE_PATH);
      return;
    }

    const { inquiryBoardList } = result as GetInquiryBoardListResponseDto;
    changeList(inquiryBoardList, isToggleOn);
    setCurrentPage(!inquiryBoardList.length ? 0 : 1);
    setCurrentSection(!inquiryBoardList.length ? 0 : 1);
  };

  const getSearchInquiryBoardListResponse = (result: GetSearchInquiryBoardListResponseDto | ResponseDto | null) => 
  {
    const message = 
      !result ? '서버에 문제가 있습니다.' : 
      result.code === 'VF' ? '검색어를 입력하세요.' :
      result.code === 'AF' ? '인증에 실패했습니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
    
      if (!result || result.code !== 'SU') 
      {
        alert(message);
        if (result?.code === 'AF') navigation(INQUIRY_BOARD_LIST_ABSOLUTE_PATH);
        return;
      }

    const { inquiryBoardList } = result as GetSearchInquiryBoardListResponseDto;
    changeList(inquiryBoardList, isToggleOn);
    setCurrentPage(!inquiryBoardList.length ? 0 : 1);
    setCurrentSection(!inquiryBoardList.length ? 0 : 1);
  };
  
  {/* 3차 프로젝트 분석시작 */}
  // event handler //
  const onWriteButtonClickHandler = () => 
  {
    if ((loginUserRole !== 'ROLE_USER') && (loginUserRole !== 'ROLE_CEO')) return;
    navigation(INQUIRY_BOARD_WRITE_ABSOLUTE_PATH);
  };
  {/* 3차 프로젝트 분석완료 */}

  const onToggleClickHandler = () => 
  {
    if (loginUserRole !== 'ROLE_ADMIN') return;
    setToggleOn(!isToggleOn);
  };
  
  const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
  {
    const searchWord = event.target.value;
    setSearchWord(searchWord);
  };

  const onSearchButtonClickHandler = () => 
  {
    if (!searchWord) return;
    getSearchInquiryBoardListRequest(searchWord, cookies.accessToken).then(getSearchInquiryBoardListResponse);
    setSearchWord('');
  };
  
  const onEnterKeyHandler = (event: { key: string; preventDefault: () => void; }) => 
  {
    if (event.key === 'Enter') 
    {
      event.preventDefault(); 
      if (searchWord) 
      {
        getSearchInquiryBoardListRequest(searchWord, cookies.accessToken).then(getSearchInquiryBoardListResponse);
        setSearchWord('');
      }
    }
  };
  
  // effect //
  useEffect(() => 
  {
      getInquiryBoardListRequest(cookies.accessToken).then(getInquiryBoardListResponse);
  },[isToggleOn]);

  // render //
  const toggleClass = isToggleOn ? 'toggle-active' : 'toggle';
  const searchButtonClass = searchWord ? 'primary-button' : 'disable-button';
  
  return (
    <div id='inquiry-list-wrapper'>
      <div className='inquiry-list-top'>문의</div>
      <div className='inquiry-list-top-box'>
        <div className='inquiry-list-top-left'>
          <div className='inquiry-list-size-text'>전체
            <span className='emphasis'> {totalLength}건</span> | 페이지 <span className='emphasis'>{currentPage}/{totalPage}</span>
          </div>
        </div>
        <div className='inquiry-list-top-right'>
          {loginUserRole === 'ROLE_ADMIN' &&
            (<>
              <div className='inquiry-list-top-admin-text'>미답변 보기</div>
              <div className={toggleClass} onClick={onToggleClickHandler}></div>
            </>)}
          {(loginUserRole === 'ROLE_USER' || loginUserRole === 'ROLE_CEO') &&(
            <div className='primary-button inquiry' onClick={onWriteButtonClickHandler}>문의 작성</div>
          )}
        </div>
      </div>
      <div className='inquiry-list-table'>
        <div className='inquiry-list-table-top'>
          <div className='inquiry-list-table-reception-number'>번호</div>
          <div className='inquiry-list-table-status'>상태</div>
          <div className='inquiry-list-table-public'>공개</div>
          <div className='inquiry-list-table-title'>제목</div>
          <div className='inquiry-list-table-writer-nickname'>작성자</div>
          <div className='inquiry-list-table-write-date'>작성일자</div>
        </div>
        <div className='inquiry-list-table-contents'>
          {viewList.map((item, index)=> <ListItem {...item} index={totalLength - (currentPage - 1) * COUNT_PER_PAGE - (index + 1)} key={item.inquiryNumber} />)}
        </div>
      </div>
      <div className='inquiry-list-bottom'>
        <div style={{ width: '332px' }}></div>
        <div className='inquiry-list-page-nation'>
          <div className='page-left' onClick={onPreSectionClickHandler}></div>
          <div className='inquiry-list-page-box'>
            {pageList.map(page => page === currentPage ?
              <div className='inquiry-list-page-active'>{page}</div> :
              <div className='inquiry-list-page' onClick={() => onPageClickHandler(page)}>{page}</div>
            )}
          </div>
          <div className='page-right' onClick={onNextSectionClickHandler}></div>
        </div>
        <div className='inquiry-list-search-box'>
          <div className='inquiry-list-search-input-box'>
            <input className='inquiry-list-search-input' placeholder='검색어를 입력하세요.' value={searchWord} onChange={onSearchWordChangeHandler} onKeyDown={onEnterKeyHandler} />
          </div>
          <div className={searchButtonClass} onClick={onSearchButtonClickHandler}>검색</div>
        </div>
      </div>
    </div>
  )
}
{/* /분석 완료/ */}