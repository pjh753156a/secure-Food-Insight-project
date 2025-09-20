package com.project.back.repository;

import java.util.List;

import com.project.back.entity.InquiryBoardEntity;
import com.project.back.repository.resultSet.GetInquiryBoardListResultSet;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface InquiryBoardRepository extends JpaRepository<InquiryBoardEntity,Integer> 
{
    InquiryBoardEntity findByInquiryNumber(Integer inquiryNumber);
    /* 3차 프로젝트 분석완료 */

    @Query(value=
    "SELECT ib.inquiry_number inquiryNumber, ib.status status, ib.inquiry_public inquiryPublic, ib.inquiry_title inquiryTitle, u.nickname inquiryWriterNickname, ib.inquiry_write_datetime inquiryWriteDatetime, ib.inquiry_writer_id inquiryWriterId " +
    "FROM inquiry_board ib LEFT JOIN user u ON ib.inquiry_writer_id = u.user_email_id " +
    "ORDER BY ib.inquiry_number DESC",
    nativeQuery=true
    )
    List<GetInquiryBoardListResultSet> getInquiryBoardList();

    @Query(value=
    "SELECT ib.inquiry_number inquiryNumber, ib.status status, ib.inquiry_public inquiryPublic, ib.inquiry_title inquiryTitle, u.nickname inquiryWriterNickname, ib.inquiry_write_datetime inquiryWriteDatetime " +
    "FROM inquiry_board ib LEFT JOIN user u ON ib.inquiry_writer_id = u.user_email_id " +
    "WHERE ib.inquiry_title LIKE %:title% " +
    "ORDER BY ib.inquiry_number DESC",
    nativeQuery=true
    )
    List<GetInquiryBoardListResultSet> getInquirySearchBoardList(@Param("title") String title);
    /* /분석 완료/ */

    @Query(value=
    "SELECT ib.inquiry_number inquiryNumber, ib.status status, ib.inquiry_public inquiryPublic, ib.inquiry_title inquiryTitle, u.nickname inquiryWriterNickname, ib.inquiry_write_datetime inquiryWriteDatetime ib.inquiry_writer_id inquiryWriterId " +
    "FROM inquiry_board ib LEFT JOIN user u ON ib.inquiry_writer_id = u.user_email_id " +
    "WHERE ib.inquiry_writer_id = ':userEmailId' " +
    "ORDER BY ib.inquiry_number DESC",
    nativeQuery=true
    )
    List<GetInquiryBoardListResultSet> getInquiryUserBoardList(@Param("userEmailId") String userEmailId);
}