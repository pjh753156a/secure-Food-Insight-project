import { useState } from 'react';

import reviewDefault from 'src/assets/image/review-default.png';

import { RestaurantReviewListItem } from 'src/types';

import { ITEM_PER_PAGE2, RESTAURANT_INFO_ABSOLUTE_PATH } from 'src/constant';

import './style.css';
import { useUserStore } from 'src/stores';
import { DeleteReviewRequest } from 'src/apis/restaurant/review';
import { useCookies } from 'react-cookie';
import ResponseDto from 'src/apis/response.dto';

// interface //
interface Props 
{
    value: RestaurantReviewListItem[];
    onChange:() => void;
}

// component: 리뷰 리스트 //
export default function ReviewList({ value,onChange  }: Props) 
{
    // state //
    const[cookies] = useCookies();
    const [currentPage, setCurrentPage] = useState(1);
    const { loginUserRole } = useUserStore();

    // function //
    const DeleteReviewResponse = (result: ResponseDto | null) => 
        {
            const message =
                !result ? '서버에 문제가 있습니다.' :
                result.code === 'NR' ? '존재하지 않는 식당입니다.' :
                result.code === 'AF' ? '권한이 없습니다.' :
                result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
    
        if (!result || result.code !== 'SU') 
        {
            alert(message);
            return;
        }
        onChange();
    };

    // event handler //
    const onLoadMoreClickHandler = () => setCurrentPage(prevPage => prevPage + 1);

    const onDeleteClickHandler = (reviewNumber: number) => 
    {
        if(!reviewNumber || !cookies.accessToken) return;
        const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
        if(!isConfirm) return;
    
        DeleteReviewRequest(reviewNumber, cookies.accessToken).then(DeleteReviewResponse);
    }
    
    const currentItems = value.slice(0, currentPage * ITEM_PER_PAGE2);

    // render //
    return (
        <div id='review-list-wrapper'>
            <div className='review-list-title'>리뷰 ({value.length})</div>
            {currentItems.map((item) => (
                <div className='review-list-contents-box' key={item.reviewNumber}>
                    <img src={item.reviewImage ? item.reviewImage : reviewDefault} className='review-content image'/>
                    <div className='review-list-container'>
                        <div className='review-content-box'>
                            <div className='review-content-nickname'>작성자 {item.reviewWriterNickname}</div>
                            <div className='review-content-divider'>{'\|'}</div>
                            <div className='review-content-rating'>평점 {item.rating}</div>
                            <div className='review-content-divider'>{'\|'}</div>
                            <div className='review-content-date'>작성일 {item.reviewDate}</div>
                        </div>
                        <div className='review-content'>{item.reviewContents}</div>
                    </div>
                    {loginUserRole == "ROLE_ADMIN" && <div className='review-delete-button' onClick={() => onDeleteClickHandler(item.reviewNumber)}>삭제</div>}
                </div>
            ))}
            {currentItems.length < value.length && (
                <div className='review-load-more' onClick={onLoadMoreClickHandler}>더보기</div>
            )}   
        </div>
    )
}
{/* 분석 완료 */}