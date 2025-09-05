package com.project.back.dto.response.board.noticeboard;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.project.back.entity.NoticeBoardEntity;
import com.project.back.dto.response.ResponseDto;
import com.project.back.dto.response.ResponseCode;
import com.project.back.dto.response.ResponseMessage;
import com.project.back.common.util.ChangeDateFormatUtil;

import lombok.Getter;

@Getter
public class GetNoticeBoardResponseDto extends ResponseDto 
{
    private Integer viewCount;
    private Integer noticeNumber;
    private String noticeTitle;
    private String noticeWriterId;
    private String noticeContents;
    private String noticeWriteDatetime;
    private String noticeWriterNickname;
    private String noticeFile;
    private String noticeFileName;
    
    private GetNoticeBoardResponseDto(NoticeBoardEntity noticeBoardEntity, String noticeWriterNickname) throws Exception 
    {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.noticeWriterNickname = noticeWriterNickname;
        
        this.viewCount = noticeBoardEntity.getViewCount();
        this.noticeTitle = noticeBoardEntity.getNoticeTitle();
        this.noticeNumber = noticeBoardEntity.getNoticeNumber();
        this.noticeWriterId = noticeBoardEntity.getNoticeWriterId();

        String writeDate  = ChangeDateFormatUtil.changeYYYYMMDD(noticeBoardEntity.getNoticeWriteDatetime());
        this.noticeWriteDatetime = writeDate;

        this.noticeContents = noticeBoardEntity.getNoticeContents();

        this.noticeFile = noticeBoardEntity.getNoticeFile();
        this.noticeFileName = noticeBoardEntity.getNoticeFileName();
    }
    
    public static ResponseEntity<GetNoticeBoardResponseDto> success(NoticeBoardEntity noticeBoardEntity, String nickname) throws Exception 
    {
        GetNoticeBoardResponseDto responseBody = new GetNoticeBoardResponseDto(noticeBoardEntity, nickname);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
/*분석 완료*/