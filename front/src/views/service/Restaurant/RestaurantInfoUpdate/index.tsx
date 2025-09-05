import { useCookies } from 'react-cookie';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useNavigate, useParams } from 'react-router';
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';

import { useUserStore } from 'src/stores';
import SelectBox from 'src/views/service/Restaurant/FoodSelectBox';
import RestaurantInputBox from 'src/components/RestaurantInputBox';

import ResponseDto from 'src/apis/response.dto';
import { GetRestaurantInfoResponseDto } from 'src/apis/restaurant/dto/response';
import { PatchRestaurantInfoRequestDto } from 'src/apis/restaurant/dto/request';

import { GetRestaurantInfoRequest, PatchRestaurantInfoRequest } from 'src/apis/restaurant';

import { RESTAURANT_INFO_ABSOLUTE_PATH } from 'src/constant';

import './style.css';

// component //
export default function RestaurantInfoUpdate() 
{
    // interface //
    type Center = 
    {
        lat: number;
        lng: number;
    };

    // state //
    const [cookies] = useCookies();
    const navigation = useNavigate();
    const { restaurantId } = useParams();
    const [restaurantName, setRestaurantName] = useState<string>('');
    const [restaurantImage, setRestaurantImage] = useState<string>('');
    const [restaurantNotice, setRestaurantNotice] = useState<string>('');
    const [restaurantFeatures, setRestaurantFeatures] = useState<string>('');
    const [restaurantLocation, setRestaurantLocation] = useState<string>('');
    const [restaurantTelNumber, setRestaurantTelNumber] = useState<string>('');
    const [restaurantSnsAddress, setRestaurantSnsAddress] = useState<string>('');
    const [restaurantFoodCategory, setRestaurantFoodCategory] = useState<string>('');
    const [restaurantOperationHours, setRestaurantOperationHours] = useState<string>('');
    const [restaurantRepresentativeMenu, setRestaurantRepresentativeMenu] = useState<string>('');

    const [center, setCenter] = useState<Center>();
    const {businessRegistrationNumber} = useUserStore();
    const [restaurantPosition, setRestaurantPosition] = useState<Center>();

    // function //
    const GetRestaurantInfoResponse = (result: GetRestaurantInfoResponseDto | ResponseDto | null) => 
        {
            if (!result || result.code !== 'SU') 
            {
                return;
            }

        const { restaurantImage, restaurantName, restaurantFoodCategory,
            restaurantLocation, restaurantTelNumber,
            restaurantSnsAddress, restaurantOperationHours, restaurantFeatures,
            restaurantNotice, restaurantRepresentativeMenu, restaurantLat,
            restaurantLng
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
        setCenter({
            lat: restaurantLat,
            lng: restaurantLng,
        })
        setRestaurantPosition({
            lat: restaurantLat,
            lng: restaurantLng
        });
    }

    const PatchRestaurantInfoResponse = (result: ResponseDto | null) => 
    {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '필수 데이터를 입력하지 않았습니다.' :
            result.code === 'NR' ? '존재하지 않는 식당입니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }

        if(!restaurantId) return;
        navigation(RESTAURANT_INFO_ABSOLUTE_PATH(restaurantId))
    }
    
    // event handler //
    const onUpdateClickHandler = () => 
    {
        if (!cookies.accessToken || !restaurantImage || !restaurantName || !restaurantFoodCategory || !restaurantPosition || !restaurantLocation || !restaurantId || !restaurantTelNumber) 
        {
            return;
        }

        const requestBody: PatchRestaurantInfoRequestDto = 
        {
            restaurantImage: restaurantImage,
            restaurantName: restaurantName,
            restaurantFoodCategory: restaurantFoodCategory,
            restaurantLocation: restaurantLocation,
            restaurantTelNumber: restaurantTelNumber,
            restaurantSnsAddress: restaurantSnsAddress,
            restaurantOperationHours: restaurantOperationHours,
            restaurantFeatures: restaurantFeatures,
            restaurantNotice: restaurantNotice,
            restaurantRepresentativeMenu: restaurantRepresentativeMenu,
            restaurantLat: restaurantPosition.lat,
            restaurantLng: restaurantPosition.lng
        }
        PatchRestaurantInfoRequest(restaurantId, requestBody, cookies.accessToken).then(PatchRestaurantInfoResponse);
    }
    
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
                    setRestaurantImage(base64String);
                }
            };
        }
    }

    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { value } = event.target;
        setRestaurantName(value);
    }

    const onFoodCategoryChangeHandler = (selectFood: string) => setRestaurantFoodCategory(selectFood);
    
    const onLocationChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { value } = event.target;
        setRestaurantLocation(value);
    }

    const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { value } = event.target;
        setRestaurantTelNumber(value);
    }

    const onSnsLocationChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { value } = event.target;
        setRestaurantSnsAddress(value);
    }

    const onOperationHoursChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { value } = event.target;
        setRestaurantOperationHours(value);
    }

    const onFeaturesChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { value } = event.target;
        setRestaurantFeatures(value);
    }

    const onNoticeChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { value } = event.target;
        setRestaurantNotice(value);
    }

    const onRepresentativeMenuChangeHandler = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { value } = event.target;
        setRestaurantRepresentativeMenu(value);
    }

    const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => 
    {
        if (event.key === 'Enter') 
        {
            onUpdateClickHandler();
        }
    };
    
    // effect //
    let effectFlag = false;

    useEffect(() => 
    {
        if (!cookies.accessToken || !restaurantId) 
        {
            return;
        }
    if(effectFlag) return;
    effectFlag = true;

    GetRestaurantInfoRequest(restaurantId, cookies.accessToken).then(GetRestaurantInfoResponse);
    }, []);
    
    const isRestUploadUpActive = restaurantImage && restaurantName && restaurantFoodCategory && restaurantLocation && restaurantTelNumber && restaurantPosition;
    const ButtonClass = `${isRestUploadUpActive ? 'restaurant-info-update-primary' : 'restaurant-info-update-disable'}-button`;

    // render //
    return (
        <>
            <div className="restaurant-info-update-write-title">식당 정보 수정</div>
            <div className='restaurant-info-update-write-container'>
                <div className="restaurant-info-update-write-box">
                    <div className="restaurant-input-label label">식당 사진</div>
                    <div className='restaurant-image-box'>
                        <input type="file" accept="image/*" onChange={onImageChangeHandler} className="restaurant-info-image-file-input"/>
                        {restaurantImage && (
                            <img src={restaurantImage} style={{ maxWidth: '100px', maxHeight: '100px' }} className="restaurant-info-image-file"/>
                        )}
                    </div>
                    <RestaurantInputBox label="식당 이름" type="text" value={restaurantName}
                    placeholder="이름을 입력해주세요" onChangeHandler={onNameChangeHandler}/>
                    <RestaurantInputBox label="식당 주소" type="text" value={restaurantLocation}
                    placeholder="주소를 입력해주세요" onChangeHandler={onLocationChangeHandler}/>
                    <em className="restaurant-info-update-write-contents">지도를 클릭해주세요!</em>
                    {center && <Map
                        id="map"
                        center={center}
                        style={{
                            width: "100%",
                            height: "350px",
                            margin: '0 auto'}}
                        level={3}
                        onClick={(_, mouseEvent) => 
                            {
                            const restaurantRatlng = mouseEvent.latLng
                            setRestaurantPosition({
                                lat: restaurantRatlng.getLat(),
                                lng: restaurantRatlng.getLng(),
                            })}}>
                        <MapMarker position={restaurantPosition ?? center} />
                    </Map>}
                    <div className="restaurant-info-update-write-select-box">                 
                        <SelectBox value={restaurantFoodCategory} onChange={onFoodCategoryChangeHandler} />
                    </div>
                </div>
                <div className="restaurant-info-update-write-box">
                    <RestaurantInputBox label="식당 연락쳐" type="text" value={restaurantTelNumber} placeholder="연락쳐를 입력해주세요" onChangeHandler={onTelNumberChangeHandler} onKeydownHandler={onKeyPressHandler}/>
                    <RestaurantInputBox label="식당 SNS 주소" type="text" value={restaurantSnsAddress} placeholder="주소를 입력해주세요" onChangeHandler={onSnsLocationChangeHandler}/>
                    <RestaurantInputBox label="운영 시간" type="text" value={restaurantOperationHours} placeholder="운영시간을 입력해주세요" onChangeHandler={onOperationHoursChangeHandler}/> 
                    <RestaurantInputBox label="식당 특징" type="text" value={restaurantFeatures} placeholder="특징을 입력해주세요" onChangeHandler={onFeaturesChangeHandler}/>     
                    <RestaurantInputBox label="식당 공지" type="text" value={restaurantNotice} placeholder="공지를 입력해주세요" onChangeHandler={onNoticeChangeHandler}/>
                    <RestaurantInputBox label="대표메뉴" type="text" value={restaurantRepresentativeMenu} placeholder="대표메뉴를 입력해주세요" onChangeHandler={onRepresentativeMenuChangeHandler} onKeydownHandler={onKeyPressHandler}/>
                    <div className='businessRegistrationNumber-update-box'>
                        <div className='businessRegistrationNumber-update-title'>사업자 등록번호</div>
                        <div className='businessRegistrationNumber-update-title-input'>{businessRegistrationNumber}</div>
                    </div>
                </div>
            </div>
            <div className="restaurant-info-update-registered-button-box">
                <button onClick={onUpdateClickHandler} className={ButtonClass}>수정하기</button>
            </div>
        </>
    );
}
{/* /분석 완료/ */}