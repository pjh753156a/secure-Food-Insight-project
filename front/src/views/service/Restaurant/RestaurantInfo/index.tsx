import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useNavigate, useParams } from 'react-router';

import { useUserStore } from 'src/stores';
import ReviewList from 'src/views/service/Restaurant/Review/ReviewList';
import restaurantDefault from 'src/assets/image/restaurant-default.png';

import ResponseDto from 'src/apis/response.dto';
import { RestaurantReviewListItem } from 'src/types';
import { GetRestaurantInfoResponseDto } from 'src/apis/restaurant/dto/response';
import { GetFavoriteCheckResponseDto } from 'src/apis/restaurant/favorite/dto/response';
import { GetReservationCheckResponseDto } from 'src/apis/restaurant/reservation/dto/response';

import { DeleteRestaurantInfoRequest, GetRestaurantInfoRequest } from 'src/apis/restaurant';
import { DeleteReservationRequest, GetReservationCheckStatusRequest } from 'src/apis/restaurant/reservation';
import { DeleteRestaurantFavoriteRequest, GetFavoriteCheckStatusRequest, PostRestaurantFavoriteRequest } from 'src/apis/restaurant/favorite';

import { RESTAURANT_DO_RESERVATION_ABSOLUTE_PATH, RESTAURANT_INFO_UPDATE_ABSOLUTE_PATH, RESTAURANT_LIST_ABSOLUTE_PATH, RESTAURANT_REVIEW_ABSOLUTE_DETAIL_WRITE_PATH } from 'src/constant';

import './style.css';

// component : 특정 식당 정보 //
export default function RestaurantInfo() 
{
    // interface //
    type Center = {
        lat: number;
        lng: number;
    };

    // state //
    const [cookies] = useCookies();
    const { restaurantId } = useParams();
    const { loginUserEmailId, loginUserRole } = useUserStore();
    const [favoriteUserId, setFavoriteUserId] = useState<string>('');
    const [restaurantName, setRestaurantName] = useState<string>('');
    const [restaurantImage, setRestaurantImage] = useState<string>('');
    const [restaurantNotice, setRestaurantNotice] = useState<string>('');
    const [reservationUserId, setReservationUserId] = useState<String>('');
    const [restaurantLocation, setRestaurantLocation] = useState<string>('');
    const [restaurantFeatures, setRestaurantFeatures] = useState<string>('');
    const [restaurantWriterId, setRestaurantWriterId] = useState<string>('');
    const [restaurantTelNumber, setRestaurantTelNumber] = useState<string>('');
    const [restaurantSnsAddress, setRestaurantSnsAddress] = useState<string>('');
    const [restaurantFoodCategory, setRestaurantFoodCategory] = useState<string>('');
    const [restaurantOperationHours, setRestaurantOperationHours] = useState<string>('');
    const [restaurantRepresentativeMenu, setRestaurantRepresentativeMenu] = useState<string>('');

    const [grade, setGrade] = useState<number>();
    const [center, setCenter] = useState<Center>();
    const [favoriteRestaurantId, setFavoriteRestaurantId] = useState<number>(0);
    const [reservationRestaurantId, setReservationRestaurantId] = useState<number>(0);
    const [restaurantReviewList, setRestaurantReviewList] = useState<RestaurantReviewListItem[]>([]);
    
    // function //
    const navigation = useNavigate();

    const GetRestaurantInfoResponse = (result: GetRestaurantInfoResponseDto | ResponseDto | null) => 
    {
        if (!result || result.code !== 'SU') 
        {
            return;
        }

        const { restaurantImage, restaurantName, restaurantFoodCategory,
            restaurantLocation, restaurantTelNumber,
            restaurantSnsAddress, restaurantOperationHours, restaurantFeatures,
            restaurantNotice, restaurantRepresentativeMenu,
            restaurantWriterId, restaurantReviewList, restaurantLat, restaurantLng
        } = result as GetRestaurantInfoResponseDto;
        
        setRestaurantImage(restaurantImage);
        setRestaurantName(restaurantName);
        setRestaurantFoodCategory(restaurantFoodCategory);
        setRestaurantLocation(restaurantLocation);
        setRestaurantTelNumber(restaurantTelNumber);
        setRestaurantSnsAddress(restaurantSnsAddress);
        setRestaurantOperationHours(restaurantOperationHours);
        setRestaurantFeatures(restaurantFeatures);
        setRestaurantNotice(restaurantNotice);
        setRestaurantRepresentativeMenu(restaurantRepresentativeMenu);
        setRestaurantWriterId(restaurantWriterId);
        setRestaurantReviewList(restaurantReviewList);

        if(!restaurantLat || !restaurantLng)
        {
            setCenter({
                lat: 33.450701,
                lng: 126.570667,
            });
            return;
        }

        setCenter({
            lat: restaurantLat,
            lng: restaurantLng,
        });
    }
    
    const DeleteReservationResponse = (result: ResponseDto | null) => 
    {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '필수 데이터를 입력하지 않았습니다.' :
            result.code === 'NR' ? '존재하지 않는 식당입니다.' :
            result.code === 'NU' ? '존재하지 않는 사용자입니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') 
        {
            alert(message);
            return;
        }

        alert("예약이 취소되었습니다.");
        setReservationUserId("");
        setReservationRestaurantId(0);
    }
    
    const PostRestaurantFavoriteResponse = (result: ResponseDto | null) => 
    {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '필수 데이터를 입력하지 않았습니다.' :
            result.code === 'NR' ? '존재하지 않는 식당입니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'NU' ? '존재하지 않는 사용자입니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') 
        {
            alert(message);
            return;
        }

        if (!restaurantId) return;
        GetFavoriteCheckStatusRequest(restaurantId,cookies.accessToken).then(GetFavoriteCheckStatusResponse);
    }

    const DeleteRestaurantFavoriteResponse = (result: ResponseDto | null) => 
    {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '필수 데이터를 입력하지 않았습니다.' :
            result.code === 'NR' ? '존재하지 않는 식당입니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'NU' ? '존재하지 않는 사용자입니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') 
        {
            alert(message);
            return;
        }

        setFavoriteUserId("");
        setFavoriteRestaurantId(0);
    }
    
    const GetFavoriteCheckStatusResponse = (result: GetFavoriteCheckResponseDto | ResponseDto | null) => 
    {
        if (!result || result.code !== 'SU') 
        {
            if (!result || result.code !== 'NU') return;
        }

        const {  favoriteUserId, favoriteRestaurantId } = result as GetFavoriteCheckResponseDto;
        setFavoriteUserId(favoriteUserId);
        setFavoriteRestaurantId(favoriteRestaurantId);
    };

    const GetReservationCheckStatusResponse = (result: GetReservationCheckResponseDto | ResponseDto | null) => 
    {
        if (!result || result.code !== 'SU') 
        {
            if (!result || result.code !== 'NU') return;
        }

        const { reservationUserId,reservationRestaurantId } = result as GetReservationCheckResponseDto
        setReservationUserId(reservationUserId);
        setReservationRestaurantId(reservationRestaurantId);
    };

    const DeleteRestaurantInfoResponse = (result: ResponseDto | null) => 
    {
        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'AF' ? '인증에 실패했습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' :
            result.code === 'NU' ? '존재하지 않는 사용자입니다.' :
            result.code === 'NR' ?  '존재하지 않는 식당입니다.' : '';
        
        if (!result || result.code !== 'SU') 
        {
                alert(message);
            return;
        }

        alert("삭제되었습니다.");
        navigation(RESTAURANT_LIST_ABSOLUTE_PATH);
    }
    
    // event handler //
    const onSetRestIdNumberHandler = () => 
    {
        if (!restaurantId) return;
        navigation(RESTAURANT_INFO_UPDATE_ABSOLUTE_PATH(restaurantId))
    }

    const onDeleteRestIdNumberHandler = () => 
    {
        if (!restaurantId) return;
        
        const confirmed = window.confirm("정말로 삭제하시겠습니까? 삭제하면 식당의 모든 내역이 사라집니다.");
        if (confirmed) 
        {
            DeleteRestaurantInfoRequest(restaurantId, cookies.accessToken).then(DeleteRestaurantInfoResponse);
        } 
        else 
        {
            return;
        }
    }
    
    const onReservationClickHandler = () => 
    {
        if (!restaurantId) return;
        navigation(RESTAURANT_DO_RESERVATION_ABSOLUTE_PATH(restaurantId));
    };
    
    const onReservationCancelClickHandler = () => 
    {
        const confirmed = window.confirm("정말로 취소하시겠습니까?");
        if (confirmed) 
        {
            if(!restaurantId) return;
            DeleteReservationRequest(restaurantId,cookies.accessToken).then(DeleteReservationResponse)
        } 
        else 
        {
            return;
        }
    };

    const RestaurantChange = () =>
    {
        if (!restaurantId) 
        {
            return;
        }

        GetRestaurantInfoRequest(restaurantId, cookies.accessToken).then(GetRestaurantInfoResponse);
    }
    
    const onFavoriteClickHandler = () => 
    {
        if (!loginUserEmailId || !restaurantId || !cookies.accessToken) return;
        PostRestaurantFavoriteRequest(restaurantId, cookies.accessToken).then(PostRestaurantFavoriteResponse)
    }

    const onCancleFavoriteClickHandler = () => 
    {
        if (!loginUserEmailId || !restaurantId || !cookies.accessToken) return;
        DeleteRestaurantFavoriteRequest(restaurantId,cookies.accessToken).then(DeleteRestaurantFavoriteResponse)
    }

    const onWriteClickHandler = () => 
    {
        if (!restaurantId) return;
        navigation(RESTAURANT_REVIEW_ABSOLUTE_DETAIL_WRITE_PATH(restaurantId));
    }
    
    // effect //
    useEffect(() => 
    {
        if (!restaurantId) 
        {
            return;
        }

        GetRestaurantInfoRequest(restaurantId, cookies.accessToken).then(GetRestaurantInfoResponse);
    }, []);

    useEffect(() => 
    {
        if (!restaurantId) 
        {
            return;
        }

        const total = restaurantReviewList.reduce((sum, restaurantReviewList) => sum + restaurantReviewList.rating, 0);
        const average = total / restaurantReviewList.length;
        setGrade(parseFloat(average.toFixed(1)));
    }, [restaurantReviewList]);
    
    let effectFlag = false;
    useEffect(() => 
    {
        if (!restaurantId) 
        {
            return;
        }

        if (effectFlag) return;
        effectFlag = true;

        if (!cookies.accessToken) return;
        GetFavoriteCheckStatusRequest(restaurantId,cookies.accessToken).then(GetFavoriteCheckStatusResponse);
        GetReservationCheckStatusRequest(restaurantId,cookies.accessToken).then(GetReservationCheckStatusResponse)
    }, []);
    
    // render //
    return (
        <div id='restaurant-info-wrapper'>
            <div className='restaurant-info-container'>
                <div className='restaurant-info-top-container'>
                    <img src={restaurantImage ? restaurantImage : restaurantDefault}/>
                    <div className='restaurant-info-top'>
                        <div className='restaurant-info-name-box'> 
                            <div className='restaurant-info-name'>{restaurantName}</div>
                            {grade ? (<div className='restaurant-info-grade'>{grade}</div>) : (<div></div>)}
                        </div>
                        <div className='restaurant-info-category-box'>
                            <div className='restaurant-info-food-category'>{restaurantFoodCategory}</div>
                            <div >
                                {loginUserRole === "ROLE_USER" && (loginUserEmailId === favoriteUserId && Number(restaurantId) === favoriteRestaurantId ?
                                (<div className='restaurant-info-favorite-heart' onClick={onCancleFavoriteClickHandler}></div>) :
                                (<div className='restaurant-info-favorite-non-heart' onClick={onFavoriteClickHandler}></div>))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='restaurant-info-middle-container'>
                    <div className='restaurant-info-box'>
                        <div className="restaurant-info-button-box">
                            {loginUserRole === "ROLE_USER" && (loginUserEmailId === reservationUserId && Number(restaurantId) === reservationRestaurantId ?
                                <button className='reservation-delete' onClick={onReservationCancelClickHandler}>예약취소</button> :
                                <button className='reservation' onClick={onReservationClickHandler}>예약</button>)}
                            {loginUserRole === "ROLE_USER" && (<button className='review-write' onClick={onWriteClickHandler}>리뷰작성</button>)}
                        </div>
                        {loginUserRole === "ROLE_CEO" && loginUserEmailId === restaurantWriterId && (
                            <div className="restaurant-info-button-box">
                                <button className="restaurant-info-update" onClick={onSetRestIdNumberHandler}>수정</button>
                                <button className="restaurant-info-delete" onClick={onDeleteRestIdNumberHandler}>삭제</button>
                            </div>
                        )}
                        <div className='restaurant-info-content-box'>
                            <div className='restaurant-info-icon location'></div>
                            <div className='restaurant-info-imformation'>위치 : {restaurantLocation}</div>
                        </div>
                        <div className='restaurant-info-content-box'>
                            <div className='restaurant-info-icon telnumber'></div>
                            <div className='restaurant-info-imformation'>전화번호 : {restaurantTelNumber}</div>
                        </div>
                        <div className='restaurant-info-content-box'>
                            {restaurantSnsAddress && <div className='restaurant-info-icon sns'></div>}
                            {restaurantSnsAddress && <div className='restaurant-info-imformation'>SNS : {restaurantSnsAddress}</div>}
                        </div>
                        <div className='restaurant-info-content-box'>
                            {restaurantOperationHours && <div className='restaurant-info-icon time'></div>}
                            {restaurantOperationHours && <div className='restaurant-info-imformation'>운영시간 : {restaurantOperationHours}</div>}
                        </div>
                        <div className='restaurant-info-content-box'>
                            {restaurantRepresentativeMenu && <div className='restaurant-info-icon menu'></div>}
                            {restaurantRepresentativeMenu && <div className='restaurant-info-imformation'>대표메뉴 : {restaurantRepresentativeMenu}</div>}
                        </div>
                        <div className='restaurant-info-content-box'>
                            {restaurantFeatures && <div className='restaurant-info-icon feature'></div>}
                            {restaurantFeatures && <div className='restaurant-info-imformation'>특징 : {restaurantFeatures}</div>}
                        </div>
                        <div className='restaurant-info-content-box'>
                            {restaurantNotice && <div className='restaurant-info-icon notice'></div>}
                            {restaurantNotice && <div className='restaurant-info-imformation'>공지사항 : {restaurantNotice}</div>}
                        </div>
                    </div>
                    {center && 
                        <Map id="map" center={center} style={{ width: "400px", height: "300px", border: "5px solid white", borderRadius: "15px" }} level={3}>
                            <MapMarker position={center} />
                        </Map>
                    }
                </div>
                <ReviewList value={restaurantReviewList} onChange={RestaurantChange}/>
            </div>
        </div>
    )
}
{/* 분석 완료 */}