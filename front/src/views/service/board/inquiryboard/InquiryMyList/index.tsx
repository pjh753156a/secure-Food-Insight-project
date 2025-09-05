import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

import { useUserStore } from 'src/stores';
import { usePagination } from 'src/hooks';

import ResponseDto from 'src/apis/response.dto';
import { InquiryBoardListItem } from 'src/types';
import { GetInquiryBoardListResponseDto } from 'src/apis/board/inquiryboard/dto/response';

import { getInquiryBoardListRequest } from 'src/apis/board/inquiryboard';

import { COUNT_PER_PAGE, INQUIRY_DETAILS_ABSOLUTE_PATH, MAIN_ABSOLUTE_PATH, NOTICE_BOARD_LIST_ABSOLUTE_PATH } from 'src/constant';

import './style.css'

// component //
function ListItem ({
  index,
  inquiryNumber,
  status,
  inquiryTitle,
  inquiryWriteDatetime,
}: InquiryBoardListItem & { index: number }) 
{
  
  // function //
  const navigation = useNavigate();
  
  // event handler //
  const onClickHandler = () => navigation(INQUIRY_DETAILS_ABSOLUTE_PATH(inquiryNumber));
  
  // render //
  return(
    <div className='inquiry-my-list-table-tr' onClick={onClickHandler}>
      <div className='inquiry-my-list-table-reception-number'>{index + 1}</div>
      <div className='inquiry-my-list-table-status'>
        {status ? 
          <div className='primary-bedge'>답변</div> :
          <div className='disable-bedge'>미답변</div>
        }
      </div>
      <div className='inquiry-my-list-table-title' style={{ textAlign: 'left' }}>{inquiryTitle}</div>
      <div className='inquiry-my-list-table-write-date'>{inquiryWriteDatetime}</div>
    </div>
  );
}

// component: 나의 문의사항 목록보기 //
export default function InquiryMyList() 
{  
  // state //
  const {loginUserRole, loginUserEmailId} = useUserStore();
  const [cookies] = useCookies();
  {/*분석 완료*/}

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

  {/*분석 시작*/}
  const [isToggleOn, setToggleOn] = useState<boolean>(false);
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

    if (loginUserRole == "ROLE_ADMIN")
    { navigation(NOTICE_BOARD_LIST_ABSOLUTE_PATH); }

    const { inquiryBoardList } = result as GetInquiryBoardListResponseDto;
    changeList(inquiryBoardList.filter(item => item.inquiryWriterId === loginUserEmailId), isToggleOn);
    setCurrentPage(!inquiryBoardList.length ? 0 : 1);
    setCurrentSection(!inquiryBoardList.length ? 0 : 1);
  };

  // event handler //
  const onToggleClickHandler = () => 
  {
    if ((loginUserRole !== 'ROLE_USER') && (loginUserRole !== 'ROLE_CEO')) return;
    setToggleOn(!isToggleOn);
  };
  
  // effect //
  useEffect(() => 
  {
    getInquiryBoardListRequest(cookies.accessToken).then(getInquiryBoardListResponse);
  }, [isToggleOn ,cookies.accessToken, loginUserEmailId]);
  
  // render //
  const toggleClass = isToggleOn ? 'toggle-active' : 'toggle';
  return (
    <div id='inquiry-my-list-wrapper'>
      <div className='inquiry-my-list-top'>나의 문의 내역</div>
      <div className='inquiry-my-list-top-box'>
        <div className='inquiry-my-list-top-left'>
          <div className='inquiry-my-list-size-text'>전체 
          <span className='emphasis'> {totalLength}건</span> | 페이지 <span className='emphasis'>{currentPage}/{totalPage}</span></div>
        </div>
        <div className='inquiry-my-list-top-right'>
          <div className='inquiry-my-list-toggle-box'>
            <div className='inquiry-my-list-top-text'>미답변 보기</div>
            <div className={toggleClass} onClick={onToggleClickHandler}></div>
          </div>
        </div>
      </div>
  <div className='inquiry-my-list-table'>
    <div className='inquiry-my-list-table-top'>
      <div className='inquiry-my-list-table-reception-number'>번호</div>
      <div className='inquiry-my-list-table-status'>상태</div>
      <div className='inquiry-my-list-table-title'>문의 제목</div>
      <div className='inquiry-my-list-table-write-date'>작성일자</div>
    </div>
    <div className='inquiry-my-list-table-contents'>
      {viewList.map((item, index)=> <ListItem {...item} index={totalLength - (currentPage - 1) * COUNT_PER_PAGE - (index + 1)} key={item.inquiryNumber} />)}
    </div> 
  </div>
  <div className='inquiry-my-list-bottom'>
    <div className='inquiry-my-list-pagenation'>
      <div className='page-left' onClick={onPreSectionClickHandler}></div>
      <div className='inquiry-my-list-page-box'>
        {pageList.map(page => page === currentPage ? 
          <div className='inquiry-my-list-page-active'>{page}</div> :
          <div className='inquiry-my-list-page'onClick={() => onPageClickHandler(page)}>{page}</div>
        )}
      </div>
      <div className='page-right' onClick={onNextSectionClickHandler}></div>
      </div>
    </div>
  </div>
  )
}
{/*분석 완료*/}