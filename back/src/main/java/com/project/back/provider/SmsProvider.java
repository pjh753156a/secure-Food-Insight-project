package com.project.back.provider;


import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.service.DefaultMessageService;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

@Component
public class SmsProvider 
{
    private final DefaultMessageService messageService;

    @Value("${sms.from-number}") String FROM;

    public SmsProvider(
        @Value("${sms.api-key}") String API_KEY,
        @Value("${sms.api-secret-key}") String API_SECRET_KEY,
        @Value("${sms.domain}") String API_DOMAIN
    ) {
        this.messageService = NurigoApp.INSTANCE.initialize(API_KEY, API_SECRET_KEY, API_DOMAIN);
    }
    
    public boolean sendAuthNumber(String userTelNumber, String authNumber) 
    {
        Message message = new Message();
        message.setFrom(FROM);
        message.setTo(userTelNumber);
        message.setText(getAuthNumberText(authNumber));

        SingleMessageSentResponse response = messageService.sendOne(new SingleMessageSendingRequest(message));

        String statusCode = response.getStatusCode();
        boolean result = statusCode.equals("2000");

        return result;
    }
    
    private String getAuthNumberText(String authNumber) 
    {
        String text = "요청하신 인증 번호는 " + authNumber + "입니다.";
        return text;
    }
}
/* 3차 프로젝트 분석완료 */