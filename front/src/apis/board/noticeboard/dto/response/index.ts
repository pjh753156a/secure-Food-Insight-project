import ResponseDto from "src/apis/response.dto";
import { NoticeBoardListItem } from "src/types";

// description: 공지 게시물 목록 확인 Response Body DTO
export interface GetNoticeBoardListResponseDto extends ResponseDto 
{
  noticeBoardList: NoticeBoardListItem[];
}

// description: 검색 공지 게시물 목록 확인 Response Body DTO
export interface GetSearchNoticeBoardListResponseDto extends ResponseDto 
{
  noticeBoardList: NoticeBoardListItem[];
}

// description: 공지 게시물 확인 Response Body DTO
export interface GetNoticeBoardResponseDto extends ResponseDto 
{
  noticeNumber: number;
  noticeTitle: string;
  noticeWriterId: string;
  noticeWriterNickname: string;
  noticeWriteDatetime: string;
  noticeContents: string;
  viewCount: number;
  noticeFile: string;
  noticeFileName: string;
}
/*분석 완료*/

// description: 공지 게시물 목록 확인 Response Body DTO
export interface GetNoticeBoardListItem
{
  noticeNumber: number;
  noticeTitle: string;
  noticeWriterId: string;
  noticeWriteDatetime: string;
  viewCount: number;
}