// description: 문의 게시물 작성 Request Body DTO
export interface PostInquiryBoardRequestDto 
{
  inquiryTitle: string;
  inquiryContents: string;
  inquiryPublic: boolean;
  inquiryFile: string;
  inquiryFileName: string;
}

// description: 문의 게시물 답글 작성 Request Body DTO
export interface PostCommentRequestDto 
{
  inquiryComment: string;
}

// description: 문의 게시물 수정 Request Body DTO
export interface PatchInquiryBoardRequestDto 
{
  inquiryTitle: string;
  inquiryContents: string;
  inquiryFile: string;
  inquiryFileName: string;
}
{/*분석 완료*/}