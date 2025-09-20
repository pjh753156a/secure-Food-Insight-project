package com.project.back.provider;

import java.util.Base64;
import java.util.Date;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import java.security.Key;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.nio.ByteBuffer;
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

    // [SECURE] 1차
    @Value("${aes.secret-key}") // AES 키 (Base64로 256bit)
    private String aesKeyB64;

    // [SECURE] 1차 accessToken: JWT 생성 후 AES-GCM으로 암호화
    public String accessTokenCreate(String userEmailId) 
    {
        Date expiredDate = Date.from(Instant.now().plus(10, ChronoUnit.HOURS));
        String jwt = null;
        try 
        {
            Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
            jwt = Jwts.builder()
                .signWith(key, SignatureAlgorithm.HS256)
                .setSubject(userEmailId)
                .setIssuedAt(new Date())
                .setExpiration(expiredDate)
                .compact();
                
                // [SECURE] 1차 JWT 문자열을 AES-GCM으로 암호화
                //jwt = encrypt(jwt); // <-- 추가
        }
        catch(Exception exception)
        {
            exception.printStackTrace();
            return null;
        }
        return jwt;
    }

    // [SECURE] 1차 csrfToken: 랜덤 바이트 생성 후 AES-GCM 암호화
    public String csrfTokenCreate()
    {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];  // 256bit 토큰
        random.nextBytes(bytes);

        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        try 
        {
            return token; //[SECURE] 1차 <-- 추가 (AES 암호화)
        } 
        catch (Exception e) 
        {
            e.printStackTrace();
            return token;
        }
    }
    /* 3차 프로젝트 분석완료 */

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

    // [SECURE] 1차 AES-GCM 암호화 메서드 (공용)
    private String encrypt(String plain) throws Exception 
    {
        byte[] keyBytes = Base64.getDecoder().decode(aesKeyB64);
        SecretKeySpec aesKey = new SecretKeySpec(keyBytes, "AES");

        byte[] iv = SecureRandom.getInstanceStrong().generateSeed(12);
        GCMParameterSpec spec = new GCMParameterSpec(128, iv);

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE, aesKey, spec);

        byte[] ct = cipher.doFinal(plain.getBytes(StandardCharsets.UTF_8));

        ByteBuffer bb = ByteBuffer.allocate(iv.length + ct.length);
        bb.put(iv).put(ct);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bb.array());
    }
}
/* 분석 완료 */
