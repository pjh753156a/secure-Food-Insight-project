package com.project.back.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import com.project.back.dto.request.restaurant.PatchRestaurantInfoRequestDto;
import com.project.back.dto.request.restaurant.PostRestaurantInfoRequestDto;

@Entity(name = "restaurant")
@Table(name = "restaurant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantEntity 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer restaurantId;
    private String restaurantLat;
    private String restaurantLng;
    private String restaurantName;
    private String restaurantImage;
    private String restaurantNotice;
    private String restaurantFeatures;
    private String restaurantWriterId;
    private String restaurantLocation;
    private String restaurantTelNumber;
    private String restaurantSnsAddress;
    private String restaurantFoodCategory;
    private String restaurantOperationHours;
    private String restaurantRepresentativeMenu;
    private String restaurantBusinessRegistrationNumber;
    /* 3차 프로젝트 분석 완료 */

    public RestaurantEntity(PostRestaurantInfoRequestDto dto, String userEmailId, UserEntity userEntity) 
    {
        this.restaurantWriterId = userEmailId;

        this.restaurantLat = dto.getRestaurantLat();
        this.restaurantLng = dto.getRestaurantLng();
        this.restaurantName = dto.getRestaurantName();
        this.restaurantImage = dto.getRestaurantImage();
        this.restaurantNotice = dto.getRestaurantNotice();
        this.restaurantFeatures = dto.getRestaurantFeatures();
        this.restaurantLocation = dto.getRestaurantLocation();
        this.restaurantTelNumber = dto.getRestaurantTelNumber();
        this.restaurantSnsAddress = dto.getRestaurantSnsAddress();
        this.restaurantFoodCategory = dto.getRestaurantFoodCategory();
        this.restaurantOperationHours = dto.getRestaurantOperationHours();
        this.restaurantRepresentativeMenu = dto.getRestaurantRepresentativeMenu();
        this.restaurantBusinessRegistrationNumber = userEntity.getBusinessRegistrationNumber();
    }

    public void updateRestaurantInfo(PatchRestaurantInfoRequestDto dto) 
    {
        this.restaurantLat = dto.getRestaurantLat();
        this.restaurantLng = dto.getRestaurantLng();
        this.restaurantName = dto.getRestaurantName();
        this.restaurantImage = dto.getRestaurantImage();
        this.restaurantNotice = dto.getRestaurantNotice();
        this.restaurantLocation = dto.getRestaurantLocation();
        this.restaurantFeatures = dto.getRestaurantFeatures();
        this.restaurantTelNumber = dto.getRestaurantTelNumber();
        this.restaurantSnsAddress = dto.getRestaurantSnsAddress();
        this.restaurantFoodCategory = dto.getRestaurantFoodCategory();
        this.restaurantOperationHours = dto.getRestaurantOperationHours();
        this.restaurantRepresentativeMenu = dto.getRestaurantRepresentativeMenu();
    }
}
/* /분석 완료/ */