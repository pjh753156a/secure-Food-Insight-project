package com.project.back.service.implementation;

import java.util.Map;

import com.project.back.entity.UserEntity;
import com.project.back.repository.UserRepository;
import com.project.back.common.object.CustomOAuth2User;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;

@Service
@RequiredArgsConstructor
public class OAuth2UserServiceImplementation extends DefaultOAuth2UserService 
{
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException 
    {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String oauthClientName = userRequest.getClientRegistration().getClientName().toUpperCase();

        String snsId = getId(oAuth2User, oauthClientName);
        UserEntity userEntity = userRepository.findBySnsId(snsId);
        
        if (userEntity == null) 
        {
            return new CustomOAuth2User(snsId, oAuth2User.getAttributes(), false, oauthClientName);
        } 
        else
        {
            return new CustomOAuth2User(userEntity.getUserEmailId(), oAuth2User.getAttributes(), true, oauthClientName);
        }
    };
    
    private String getId(OAuth2User oAuth2User, String oauthClientName) 
    {
        String id = null;

        if (oauthClientName.equals("KAKAO")) 
        {
            Long longId = (Long) oAuth2User.getAttributes().get("id");
            id = longId.toString();
        };

        if (oauthClientName.equals("NAVER")) 
        {
            Map<String, String> response = (Map<String, String>) oAuth2User.getAttributes().get("response");
            id = response.get("id");
        };

        return id;
    };
}
/* 분석 완료 */