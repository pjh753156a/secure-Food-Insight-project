package com.project.back.repository;

import java.util.List;

import com.project.back.entity.ReviewEntity;
import com.project.back.entity.FavoriteRestaurantEntity;
import com.project.back.repository.resultSet.GetRestaurantReviewListItemResultSet;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity,Integer> 
{
    /* 3차 프로젝트 분석 완료 */
    
    ReviewEntity findByReviewNumber(int reviewNumber);
    /* 3차 프로젝트 분석 시작 */
    boolean existsByReviewWriterIdAndReviewRestaurantId(String userEmailId, int restaurantId);
    /* 3차 프로젝트 분석 완료 */

    List<FavoriteRestaurantEntity> findByOrderByReviewRestaurantIdDesc();

    /* 3차 프로젝트 분석시작 */
    void deleteByReviewWriterId(String userEmailId);
    /* 3차 프로젝트 분석완료 */
    @Query(
        value=
        "SELECT " +
            "r.review_number as reviewNumber, " + 
            "r.review_restaurant_id as reviewRestaurantId, " +
            "r.review_image as reviewImage, " +
            "r.rating, " +
            "r.review_contents as reviewContents, " +
            "r.review_date as reviewDate, " +
            "r.review_writer_nickname as reviewWriterNickname " +
        "FROM review r LEFT JOIN user u ON r.review_writer_id = u.user_email_id " +
        "WHERE r.review_restaurant_id = :restaurantId " +
        "ORDER BY r.review_number DESC",
        nativeQuery = true
    )
    List<GetRestaurantReviewListItemResultSet> findReviewsByRestaurantId(@Param("restaurantId") int restaurantId);
    
    @Query(
        value=
        "SELECT " +
            "r.review_number as reviewNumber, " +
            "r.review_restaurant_id as reviewRestaurantId, " +
            "r.review_image as reviewImage, " +
            "r.rating, " +
            "r.review_contents as reviewContents, " +
            "r.review_date as reviewDate, " +
            "r.review_writer_nickname as reviewWriterNickname, " +
            "r.review_restaurant_name as reviewRestaurantName " +
        "FROM review r " + 
        "WHERE review_writer_id = :userEmailId " +
        "ORDER BY r.review_number DESC", 
        nativeQuery=true
    )
    
    List<GetRestaurantReviewListItemResultSet> findByOrderByMyReviewListDesc(@Param("userEmailId") String reviewWriterId);
}
/* /분석 완료/ */