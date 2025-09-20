import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';
import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';

import ResponseDto from 'src/apis/response.dto';
import { PostReviewRequestDto } from 'src/apis/restaurant/review/dto/request';

import { PostReviewRequest } from 'src/apis/restaurant/review';

import { RESTAURANT_INFO_ABSOLUTE_PATH } from 'src/constant';

import './style.css';

// component //
export default function ReviewWrite() 
{
    // state //
    const [cookies] = useCookies();
    const navigation = useNavigate();
    const {restaurantId} = useParams();
    const [rating, setRating] = useState<number>(0);
    const [reviewImage, setReviewImage] = useState<string>("");
    const [reviewContents, setReviewContents] = useState<string>("");

    const contentsRef = useRef<HTMLTextAreaElement | null>(null);

    /* 3차 프로젝트 분석 시작 */
    // function //
    const PostReviewResponse = (result: ResponseDto | null) => 
    {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '필수 데이터를 입력하지 않았습니다.' :
            result.code === 'NR' ? '존재하지 않는 식당입니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'DE' ? '이미 리뷰를 작성했습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') 
        {
            alert(message);
            return;
        }

        if (!restaurantId) return;
        navigation(RESTAURANT_INFO_ABSOLUTE_PATH(restaurantId));
    }
    /* 3차 프로젝트 분석 완료 */
    
    // event handler //
    const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
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
                    setReviewImage(base64String);
                }
            };
        }
    }

    const onRatingChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => 
    {
        if(event.target.value === "선택")
        { setRating(0); } 

        const { value } = event.target;
        const result = Number(value);
        setRating(result);
    }

    const onContentsChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => 
    {
        const { value } = event.target;
        setReviewContents(value);

        if(!contentsRef.current) return;
        contentsRef.current.style.height = 'auto';
        contentsRef.current.style.height = `${contentsRef.current.scrollHeight}px`;
    }
    
    {/* 3차 프로젝트 분석 시작 */}
    const UploadClickHandler = () =>
    {
        if (!rating) { return; }

        const requestBody: PostReviewRequestDto =
        { reviewImage: reviewImage, rating: rating, reviewContents: reviewContents }

        if(!restaurantId) return;
        PostReviewRequest(restaurantId, requestBody, cookies.accessToken).then(PostReviewResponse);
    }
    {/* 3차 프로젝트 분석 완료 */}

    const onKeyPressHandler = (event: KeyboardEvent<HTMLTextAreaElement>) => 
    {
        if (event.key === 'Enter') 
        {
            UploadClickHandler();
        }
    };

    const ButtonClass = `${rating ? 'review-primary' : 'review-disable'}-button`;
    
    // render //
    return (
        <div id='review-wrapper'>
            <div className='review-write-container'>
                <div className="review-write-title">리뷰 작성</div>
                <div className='review-write-container'>
                    <div className="review-write-box">
                        <input type="file" accept="image/*" onChange={onImageChangeHandler} className="review-image-file-input"/>
                        {reviewImage && (
                            <img src={reviewImage}  style={{ maxWidth: '100px', maxHeight: '100px' }} className="review-image-file"/>
                        )}
                        <div className='review-grade-box'>
                            <div className='review-grade-image'></div>
                            <div id="review-rating-box">
                                <select id="review-rating" name="review-rating" defaultValue={rating} onChange={onRatingChangeHandler}>
                                    <option value="선택">별점</option>
                                    <option value="1.0">1.0</option>
                                    <option value="1.5">1.5</option>
                                    <option value="2.0">2.0</option>
                                    <option value="2.5">2.5</option>
                                    <option value="3.0">3.0</option>
                                    <option value="3.5">3.5</option>
                                    <option value="4.0">4.0</option>
                                    <option value="4.5">4.5</option>
                                    <option value="5.0">5.0</option>
                                </select>
                            </div>
                        </div>
                        <div className='review-write-contents-box'>
                            <textarea ref={contentsRef} className='review-write-contents-textarea'
                                placeholder='내용을 입력해주세요. / 300자' maxLength={300} value={reviewContents} onChange={onContentsChangeHandler} onKeyDown={onKeyPressHandler} style={{ resize: 'none', width: '100%', height: '100px'}} />
                        </div>
                    </div>
                    {/* 3차 프로젝트 분석 시작 */}
                    <div className="review-registered-button-box">
                        <button onClick={UploadClickHandler} className={ButtonClass}>작성하기</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
{/* 3차 프로젝트 분석 완료 */}
