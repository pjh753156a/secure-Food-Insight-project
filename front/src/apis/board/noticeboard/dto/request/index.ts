// description: 공지 게시물 작성 Request Body DTO
export interface PostNoticeBoardRequestDto 
{
  noticeTitle: string;
  noticeContents: string;
  noticeFile: string;
  noticeFileName: string;
}

// description: 공지 게시물 수정 Request Body DTO
export interface PatchNoticeBoardRequestDto 
{
  noticeTitle: string;
  noticeContents: string;
  noticeFile: string;
  noticeFileName: string;
}
{/* 3차 프로젝트 분석완료 */}