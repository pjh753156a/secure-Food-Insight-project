import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { ChangeEvent, useEffect, useState, KeyboardEvent } from 'react';

import { useUserStore } from 'src/stores';
import restaurantDefault from 'src/assets/image/restaurant-default.png';

import { RestaurantListItem } from 'src/types';
import ResponseDto from 'src/apis/response.dto';
import { GetRestaurantListResponseDto } from 'src/apis/restaurant/dto/response';

import { GetRestaurantListRequest } from 'src/apis/restaurant';

import { RESTAURANT_INFO_ABSOLUTE_PATH, RESTAURANT_INFO_WRITE_ABSOLUTE_PATH, RESTAURANT_LIST_ABSOLUTE_PATH } from 'src/constant';

import './style.css';

// component: 식당 리스트 //
export default function RestaurantList() 
{

    // state //
    const [cookies] = useCookies();
    const {loginUserRole } = useUserStore();
    const [searchWord, setSearchWord] = useState<string>('');
    const [displayCount, setDisplayCount] = useState<number>(8);
    const [resultword, setResultWord] = useState<string>('');
    const [restaurantList, SetRestaurantList] = useState<RestaurantListItem[]>([]);
    
    // function //
    const navigation = useNavigate();

    {/* 3차 프로젝트 분석 시작 */}
    const GetRestaurantListResponse = (result: GetRestaurantListResponseDto | ResponseDto | null) => 
    {

        if (!result || result.code !== 'SU') 
        {
            return;
        }
    
        const { restaurantList } = result as GetRestaurantListResponseDto;
        SetRestaurantList(restaurantList);
        setResultWord(searchWord);
    };
    
    // event handler //
    const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const searchWord = event.target.value;
        setSearchWord(searchWord);
    };

    const sanitize = (s: string) => 
    {
        return s
            .replace(/<\s*script.*?>[\s\S]*?<\s*\/\s*script\s*>/gi, '') // <script>…</script> 제거
            .replace(/[<>]/g, ''); // <, > 제거
    };

    const onSearchClickHandler = () => 
    {
        if (!searchWord) return;
        const safeWord = sanitize(searchWord); // [XSS 방지 적용]
        GetRestaurantListRequest(safeWord, cookies.accessToken).then(GetRestaurantListResponse);
    };
    {/* 3차 프로젝트 분석 완료 */}

    const onRegistrationClickHandler = () => 
    {
        if (!cookies.accessToken) return;
        navigation(RESTAURANT_INFO_WRITE_ABSOLUTE_PATH);
    };

    const onItemClickHandler = (item: number) => navigation(RESTAURANT_INFO_ABSOLUTE_PATH(item));
    const onLoadMoreClickHandler = () => setDisplayCount(prevCount => prevCount + 8);
    {/* 3차 프로젝트 분석 시작 */}
    const onSearchKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => 
    {
        if (event.key === 'Enter') onSearchClickHandler();
    };
    {/* 3차 프로젝트 분석 완료 */}

    // effect //
    let effectFlag1 = false;

    useEffect(() => 
    {
    if(effectFlag1) return;
    effectFlag1 = true;

    GetRestaurantListRequest(searchWord, cookies.accessToken).then(GetRestaurantListResponse);
    }, []);
    
    // render //
    const searchButtonClass = searchWord ? 'primary-button' : 'disable-button';
    return(
        <div id='restaurant-list-wrapper'>
            <div className='restaurant-list-search-input-box'>
                {/* 3차 프로젝트 분석 시작 */}
                <input className="restaurant-list-search-input" placeholder='오늘의 맛집은?' value={searchWord} 
                onChange={onSearchWordChangeHandler} onKeyDown={onSearchKeyPressHandler}></input>
                <div className={searchButtonClass} onClick={onSearchClickHandler}>검색</div>
                {/* 3차 프로젝트 분석 완료 */}
                {loginUserRole === 'ROLE_CEO' && 
                    <div className="second-button" onClick={onRegistrationClickHandler}>등록하기</div>
                }
            </div>
            <div className='restaurant-list-box'>
                {!restaurantList || restaurantList.length === 0 ?
                    //<iframe className='restaurant-list-no-item' srcDoc={resultword + " 에해당하는 식당이 없습니다."}></iframe>
                    (<div className='restaurant-list-no-item'>해당하는 식당이 없습니다.</div>)
                    :
                    (restaurantList.slice(0, displayCount).map((item) => (
                    <div className='restaurant-list-item-box' onClick={() => onItemClickHandler(item.restaurantId)}>
                        <img src={item.restaurantImage ? item.restaurantImage : restaurantDefault} className='restaurant-list-item' />
                        <div className='restaurant-list-item-top-box'>
                            <div className='restaurant-list-item name'>{item.restaurantName}</div>
                            <div className='restaurant-list-item category'>{item.restaurantFoodCategory}</div>
                        </div>
                        <div className='restaurant-list-item location'>{item.restaurantLocation}</div>
                    </div>
                )))}
            </div>
            {restaurantList.length > displayCount && ( <div className="load-more-button" onClick={onLoadMoreClickHandler}>더보기</div> )}
        </div>
    );
}
{/* 분석 완료 */}
// (<div className='restaurant-list-no-item'>해당하는 식당이 없습니다.</div>)