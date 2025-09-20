package com.project.back.handler;

import java.io.IOException;


import com.project.back.provider.JwtProvider;
import com.project.back.common.object.CustomOAuth2User;

import lombok.RequiredArgsConstructor;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler 
{
    private final JwtProvider jwtProvider;

    @Value("${front.url}")
    private String frontUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException 
    {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        boolean status = oAuth2User.getStatus();

        if (status) 
        {
            String userId = oAuth2User.getName();

            String token = jwtProvider.accessTokenCreate(userId);
            response.sendRedirect(frontUrl + "sns/" + token + "/36000");
        }
        
        else 
        {
            String snsId = oAuth2User.getName();
            String joinPath = oAuth2User.getJoinPath();
            String url = frontUrl + "authentication/sign-up?" + "snsId=" + snsId + "&" + "joinPath=" + joinPath;
            response.sendRedirect(url);
        }
    };
}
/* 분석 완료 */