package com.project.back.repository;

import java.util.List;

import com.project.back.entity.NoticeBoardEntity;
import com.project.back.repository.resultSet.GetNoticeBoardListResultSet;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface NoticeBoardRepository extends JpaRepository<NoticeBoardEntity,Integer> 
{
    NoticeBoardEntity findByNoticeNumber(Integer noticeNumber);
    /* 3차 프로젝트 분석완료 */
    
    @Query(value=
    "SELECT nb.notice_number noticeNumber, nb.notice_title noticeTitle, u.nickname noticeWriterNickname, nb.notice_write_datetime noticeWriteDatetime, nb.view_count viewCount " +
    "FROM notice_board nb LEFT JOIN user u ON nb.notice_writer_id = u.user_email_id " +
    "ORDER BY nb.notice_number DESC",
    nativeQuery=true
    )
    List<GetNoticeBoardListResultSet> getNoticeBoardList();
    
    @Query(value=
    "SELECT nb.notice_number noticeNumber, nb.notice_title noticeTitle, u.nickname noticeWriterNickname, nb.notice_write_datetime noticeWriteDatetime, nb.view_count viewCount " +
    "FROM notice_board nb LEFT JOIN user u ON nb.notice_writer_id = u.user_email_id " +
    "WHERE nb.notice_title LIKE %:title% " +
    "ORDER BY nb.notice_number DESC", 
    nativeQuery=true
    )
    
    List<GetNoticeBoardListResultSet> getNoticeSearchBoardList(@Param("title") String title);
}
/*분석 완료*/