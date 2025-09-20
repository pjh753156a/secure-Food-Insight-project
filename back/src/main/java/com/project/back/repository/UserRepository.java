package com.project.back.repository;

import com.project.back.entity.UserEntity;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> 
{
    boolean existsByNickname(String nickname);
    /* 분석 완료 */
    boolean existsByPassword(String password);
    /* 3차 프로젝트 분석시작 */
    boolean existsByUserEmailId(String userId);
    boolean existsByBusinessRegistrationNumber(String businessRegistrationNumber);
    /* 3차 프로젝트 분석완료 */
    
    boolean existsByUserNameAndUserTelNumber(String userName,String userTelNumber);
    
    /* 3차 프로젝트 분석시작 */
    boolean existsByUserEmailIdAndUserTelNumber(String userEmailId, String userTelNumber);
    /* 3차 프로젝트 분석완료 */

    /* 분석 시작 */
    UserEntity findBySnsId(String snsId);
    /* 분석 완료 */
    UserEntity findByPassword(String Password);
    /* 3차 프로젝트 분석시작 */
    UserEntity findByUserEmailId(String userEmailId);
    /* 3차 프로젝트 분석완료 */
    UserEntity findByUserNameAndUserTelNumber(String userName, String userTelNumber);
    /* /분석 완료/ */
    UserEntity findByUserEmailIdAndUserTelNumber(String userEmailId, String userTelNumber);
}
