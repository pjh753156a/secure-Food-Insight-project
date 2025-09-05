package com.project.back.config;

import java.io.IOException;

import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.project.back.handler.OAuth2SuccessHandler;
import com.project.back.filter.JwtAuthenticationFilter;
import com.project.back.service.implementation.OAuth2UserServiceImplementation;

import lombok.RequiredArgsConstructor;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configurable
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig 
{
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final JwtAuthenticationFilter JwtAuthenticationFilter;
    private final OAuth2UserServiceImplementation oAuth2UserService;

    @Bean
    protected SecurityFilterChain configure(HttpSecurity httpSecurity) throws Exception 
    {
        httpSecurity
            .httpBasic(HttpBasicConfigurer::disable)
            .csrf(CsrfConfigurer::disable)
            .sessionManagement(sessionManagement -> sessionManagement
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .cors(cors -> cors.configurationSource(corsConfigurationSource())
            )
            .authorizeHttpRequests(request -> request
                .requestMatchers("/", "/download/**" ,"/notice-uploads/**", "/inquiry-uploads/**", "/board/**", "/api/v1/auth/**", "/api/v1/user/**", "/api/v1/auth/password-update/**", "/oauth2/callback/*", "/sms-auth/send-sms/*", "/api/v1/inquiry-board/**","/api/v1/notice-board/**", "/api/v1/restaurant/search", "/api/v1/restaurant/{restaurantId}").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/restaurant/review", "/api/v1/inquiry-board/*").hasRole("USER")
                .requestMatchers(HttpMethod.POST, "/api/v1/inquiry-board/*/comment", "/api/v1/notice-board/").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(endpoint -> endpoint.baseUri("/api/v1/auth/oauth2"))
                .redirectionEndpoint(endpoint -> endpoint.baseUri("/oauth2/callback/*"))
                .userInfoEndpoint(endpoint -> endpoint.userService(oAuth2UserService))
                .successHandler(oAuth2SuccessHandler)
            )
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(new AuthorizationFailEntryPoint())
            )
            .addFilterBefore(JwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    @Bean
    protected CorsConfigurationSource corsConfigurationSource() 
    {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("*");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}

class AuthorizationFailEntryPoint implements AuthenticationEntryPoint
{

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) 
        throws IOException, ServletException 
    {

        authException.printStackTrace();

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.getWriter().write("{ \"code\": \"AF\", \"message\": \"Authorization Failed\" }");
    }
}
/* 분석 완료 */