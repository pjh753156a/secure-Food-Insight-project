package com.project.back.common.util;

import java.util.Random;

public class TelNumberAuthNumberUtil 
{
  public static String createNumber() 
  {
    String authNumber = "";
    Random random = new Random();

    for (int index = 0; index < 6; index++) { authNumber += random.nextInt(10); }
    return authNumber;
  }
}
/* 3차 프로젝트 분석완료 */