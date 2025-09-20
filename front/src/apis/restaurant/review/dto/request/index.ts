// description: 식당 리뷰 작성 Request Body DTO
export interface PostReviewRequestDto 
{
    reviewImage: string;
    rating: number;
    reviewContents: string;
}
{/* 3차 프로젝트 분석 완료 */}

// description: 식당 리뷰 수정 Request Body DTO
export interface PatchReviewRequestDto 
{
    reviewImage: string;
    rating: number;
    reviewContents: string;
}
/* /분석 완료/ */