package com.project.back.constant;

public interface PatternType 
{
    String patternType1=
    "^(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
    String patternType2="^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\\.[a-zA-Z]{2,4}$";
}
/* 3차 프로젝트 분석완료 */