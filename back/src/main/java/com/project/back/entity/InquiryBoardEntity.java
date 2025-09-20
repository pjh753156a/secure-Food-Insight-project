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

import com.project.back.dto.request.board.inquiryboard.PostInquiryBoardRequestDto;
import com.project.back.common.util.ChangeDateFormatUtil;
import com.project.back.dto.request.board.inquiryboard.PatchInquiryBoardRequestDto;

@Entity(name="inquiryBoard")
@Table(name="inquiry_board")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InquiryBoardEntity 
{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer inquiryNumber;
    private Boolean status;
    private Boolean inquiryPublic;
    private String inquiryTitle;
    private String inquiryComment;
    private String inquiryWriterId;
    private String inquiryContents;
    private String inquiryWriteDatetime;
    private String inquiryFile;
    private String inquiryFileName;

    public InquiryBoardEntity(PostInquiryBoardRequestDto dto, String userEmailId) 
    {
        String dateNow = ChangeDateFormatUtil.nowYYYYMMDD();
        this.inquiryWriteDatetime = dateNow;
    
        this.status = false;
        this.inquiryWriterId = userEmailId;
        
        this.inquiryTitle = dto.getInquiryTitle();
        this.inquiryPublic = dto.getInquiryPublic();
        this.inquiryContents = dto.getInquiryContents();
        this.inquiryFile = dto.getInquiryFile();
        this.inquiryFileName = dto.getInquiryFileName();
    }
    /* 3차 프로젝트 분석완료 */

    public void update(PatchInquiryBoardRequestDto dto) 
    {
        this.inquiryTitle = dto.getInquiryTitle();
        this.inquiryContents = dto.getInquiryContents();
        this.inquiryFile = dto.getInquiryFile();
        this.inquiryFileName = dto.getInquiryFileName();
    }
}
/*분석 완료*/
