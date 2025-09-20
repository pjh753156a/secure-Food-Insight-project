package com.project.back.common.util;

import java.util.Date;
import java.text.SimpleDateFormat;
import java.time.Instant;

public class ChangeDateFormatUtil 
{
    public static String changeYYMMDD(String original) throws Exception 
    {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date datetime = simpleDateFormat.parse(original);
        simpleDateFormat = new SimpleDateFormat("yy.MM.dd");
        String writeDatetime = simpleDateFormat.format(datetime);
        return writeDatetime;
    }

    /* 3차 프로젝트 분석시작 */
    public static String changeYYYYMMDD(String original) throws Exception 
    {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date datetime = simpleDateFormat.parse(original);
        simpleDateFormat = new SimpleDateFormat("yyyy.MM.dd");
        String writeDatetime = simpleDateFormat.format(datetime);
        return writeDatetime;
    }
    /* 3차 프로젝트 분석완료 */

    public static String changeHHmm(String original) throws Exception 
    {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date datetime = simpleDateFormat.parse(original);
        simpleDateFormat = new SimpleDateFormat("HH:mm");
        String writeDatetime = simpleDateFormat.format(datetime);
        return writeDatetime;
    }

    /* 3차 프로젝트 분석시작 */
    public static String nowYYYYMMDD() 
    {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date now = Date.from(Instant.now());
        return simpleDateFormat.format(now);
    }
}
/* 3차 프로젝트 분석완료 */