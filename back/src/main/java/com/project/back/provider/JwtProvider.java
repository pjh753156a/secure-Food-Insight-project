package com.project.back.provider;

import java.util.Date;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.nio.charset.StandardCharsets;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
@Component
public class JwtProvider 
{
    @Value("${jwt.secret-key}")
    private String secretKey;

    public String create(String userEmailId) 
    {
        Date expiredDate = Date.from(Instant.now().plus(10, ChronoUnit.HOURS));
        String jwt = null;
        try 
        {
            Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
            jwt = Jwts.builder()
                .signWith(key, SignatureAlgorithm.HS256)
                .setSubject(userEmailId)
                .compact();
        }
        catch(Exception exception)
        {
            exception.printStackTrace();
            return null;
        }
        return jwt;
    }
    /* 3차 프로젝트 분석완료 */

    //Date expiredDate = Date.from(Instant.now().plus(10, ChronoUnit.SECONDS));
    //.setIssuedAt(new Date())
    //.setExpiration(expiredDate)

    public String validate(String jwt) 
    {
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        String userEmailId = null;
        try 
        {
            userEmailId = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwt)
                .getBody()
                .getSubject();
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return null;
        }
        return userEmailId;
    }
}
/* 분석 완료 */