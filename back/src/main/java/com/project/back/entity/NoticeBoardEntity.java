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

import com.project.back.common.util.ChangeDateFormatUtil;
import com.project.back.dto.request.board.noticeboard.PatchNoticeBoardRequestDto;
import com.project.back.dto.request.board.noticeboard.PostNoticeBoardRequestDto;

@Entity(name="noticeBoard")
@Table(name="notice_board")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NoticeBoardEntity 
{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer noticeNumber;
    private Integer viewCount;
    private String noticeTitle;
    private String noticeWriterId;
    private String noticeContents;
    private String noticeWriteDatetime;
    private String noticeFile;
    private String noticeFileName;

    public NoticeBoardEntity(PostNoticeBoardRequestDto dto, String userEmailId ) 
    {
        String dateNow = ChangeDateFormatUtil.nowYYYYMMDD();
        this.noticeWriteDatetime = dateNow;

        this.viewCount = 0;
        this.noticeWriterId = userEmailId;

        this.noticeTitle = dto.getNoticeTitle();
        this.noticeContents = dto.getNoticeContents();
        this.noticeFile = dto.getNoticeFile();
        this.noticeFileName = dto.getNoticeFileName();
    }

    public void increaseViewCount() 
    {
        this.viewCount++;
    }

    public void update(PatchNoticeBoardRequestDto dto) 
    {
        this.noticeTitle = dto.getNoticeTitle();
        this.noticeContents = dto.getNoticeContents();
        this.noticeFile = dto.getNoticeFile();
        this.noticeFileName = dto.getNoticeFileName();
    }    
}
/*분석 완료*/
