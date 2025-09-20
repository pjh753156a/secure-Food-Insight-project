package com.project.back.service.implementation;

import com.project.back.entity.UserEntity;
import com.project.back.service.AuthService;

import jakarta.servlet.http.HttpServletResponse;

import com.project.back.provider.JwtProvider;
import com.project.back.provider.SmsProvider;
import com.project.back.entity.AuthNumberEntity;
import com.project.back.common.util.TelNumberAuthNumberUtil;

import com.project.back.repository.UserRepository;
import com.project.back.repository.AuthNumberRepository;
import com.project.back.dto.response.ResponseCode;
import com.project.back.dto.response.ResponseDto;
import com.project.back.dto.response.ResponseMessage;
import com.project.back.dto.response.auth.SignInResponseDto;
import com.project.back.dto.response.auth.AdminSignInResponseDto;
import com.project.back.dto.response.auth.FindEmailResponseDto;
import com.project.back.dto.response.auth.PasswordResetResponseDto;
import com.project.back.dto.request.auth.SignInRequestDto;
import com.project.back.dto.request.auth.SignUpRequestDto;
import com.project.back.dto.request.auth.FindEmailRequestDto;
import com.project.back.dto.request.auth.NewPasswordRequestDto;
import com.project.back.dto.request.auth.CheckEmailIdRequestDto;
import com.project.back.dto.request.auth.CheckNicknameRequestDto;
import com.project.back.dto.request.auth.PasswordResetRequestDto;
import com.project.back.dto.request.auth.TelNumberAuthRequestDto;
import com.project.back.dto.request.auth.CheckTelNumberAuthRequestDto;
import com.project.back.dto.request.auth.AdminSignInRequestDto;
import com.project.back.dto.request.auth.CheckBusinessRegistrationRequestDto;

import lombok.RequiredArgsConstructor;

import org.springframework.util.StringUtils;
import org.springframework.stereotype.Service;

import java.net.http.HttpHeaders;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.Duration;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
@RequiredArgsConstructor
public class AuthServiceImplementation implements AuthService 
{
    @Autowired
    private JdbcTemplate jdbcTemplate;
    private final UserRepository userRepository;

    private final AuthNumberRepository authNumberRepository;

    private final SmsProvider smsProvider;
    private final JwtProvider jwtProvider;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto, HttpServletResponse res) 
    {
        String accessToken = null;
        String csrfToken = null;
        try 
        {
            String userEmailId = dto.getUserEmailId();
            String password = dto.getPassword();

            UserEntity userEntity = userRepository.findByUserEmailId(userEmailId);
            if(userEntity == null) return ResponseDto.signInFailed();

            String encodedPassword = userEntity.getPassword();
            boolean isMatched = passwordEncoder.matches(password, encodedPassword);
            if(!isMatched) return ResponseDto.signInFailed();

            // [SECURE] 1차 accessToken 생성 (AES 암호화 + JWT)
            accessToken = jwtProvider.accessTokenCreate(userEmailId); // 내부에서 AES 암호화 적용

            // [SECURE] 1차 csrfToken 생성 (AES 암호화)
            csrfToken = jwtProvider.csrfTokenCreate(); // 내부에서 AES 암호화 적용
 
            if(accessToken == null) return ResponseDto.tokenCreationFailed();

            // [SECURE] 2차 accessToken 쿠키 생성 + 보안 속성 지정
            ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
            .httpOnly(true)       // JS에서 접근 차단
            .secure(true)         // HTTPS에서만 전송
            .sameSite("Strict")   // 필요에 맞게 Lax/Strict/None
            .path("/")
            .maxAge(Duration.ofHours(1))
            .build();

            res.addHeader("Set-Cookie", accessCookie.toString());

            // [SECURE] 2차 쿠키 내려줄 때 보안 속성 지정
            ResponseCookie csrf = ResponseCookie.from("csrfToken", csrfToken) 
            .httpOnly(false) 
            .secure(true) 
            .sameSite("Strict") 
            .path("/")       
            .maxAge(Duration.ofHours(1))  
            .build();

            res.addHeader("Set-Cookie", csrf.toString());
        }
        catch(Exception exception)
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return SignInResponseDto.success(accessToken, csrfToken);
    }

    @Override
    public ResponseEntity<? super AdminSignInResponseDto> AdminSignIn(AdminSignInRequestDto dto) 
    {
        String userEmailId = dto.getUserEmailId();
        String password = dto.getPassword();
        String accessToken = null;

        try 
        {
            String query = "SELECT * FROM user WHERE user_email_id = '" + userEmailId + "' AND password = '" + password + "'";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(query);

            if (result.isEmpty()) 
            {
                return ResponseDto.signInFailed();
            }

            String userRole = (String)result.get(0).get("user_role");
            
            if(!userRole.equals("ROLE_ADMIN"))
            {
                return ResponseDto.signInFailed();
            }

            accessToken = jwtProvider.accessTokenCreate(userEmailId);
            return AdminSignInResponseDto.success(accessToken);
        } 
        catch (Exception exception)
        {
            exception.printStackTrace();
            ResponseDto responseBody = new ResponseDto(ResponseCode.DATABASE_ERROR, exception.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
        }
    }
    
    @Override
    public ResponseEntity<ResponseDto> emailIdCheck(CheckEmailIdRequestDto dto) 
    {
        try 
        {
            String userEmailId = dto.getUserEmailId();

            boolean existedUser = userRepository.existsByUserEmailId(userEmailId);
            if (existedUser) return ResponseDto.duplicatedEmailId();
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }

    @Override
    public ResponseEntity<ResponseDto> nicknameCheck(CheckNicknameRequestDto dto) 
    {
        try 
        {
            String nickname = dto.getNickname();

            boolean existedNickname = userRepository.existsByNickname(nickname);
            if (existedNickname) return ResponseDto.duplicatedNickname();
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }

    @Override
    public ResponseEntity<ResponseDto> telNumberAuth(TelNumberAuthRequestDto dto) 
    {
        try 
        {
            String userTelNumber = dto.getUserTelNumber();

            String authNumber = TelNumberAuthNumberUtil.createNumber();

            AuthNumberEntity authNumberEntity = new AuthNumberEntity(userTelNumber, authNumber);
            authNumberRepository.save(authNumberEntity);
    
            smsProvider.sendAuthNumber(userTelNumber, authNumber);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }

    @Override
    public ResponseEntity<ResponseDto> telNumberAuthCheck(CheckTelNumberAuthRequestDto dto) 
    {
        try 
        {
            String userTelNumber = dto.getUserTelNumber();
            String authNumber = dto.getAuthNumber();

            boolean isMatched = authNumberRepository.existsByTelNumberAndAuthNumber(userTelNumber, authNumber);
            if (!isMatched) return ResponseDto.authenticationFailed();
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }
    /* 3차 프로젝트 분석완료 */
    
    @Override
    public ResponseEntity<ResponseDto> businessRegistrationCheck(CheckBusinessRegistrationRequestDto dto) 
    {
        try 
        {
            String businessRegistrationNumber = dto.getBusinessRegistrationNumber();

            boolean existedBusinessRegistrationNumber = userRepository.existsByBusinessRegistrationNumber(businessRegistrationNumber);
            if (existedBusinessRegistrationNumber) return ResponseDto.duplicatedBusinessRegistrationNumber();
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }

    /* 3차 프로젝트 분석시작 */
    @Override
    public ResponseEntity<ResponseDto> signUp(SignUpRequestDto dto) 
    {
        try 
        {
            String userEmailId = dto.getUserEmailId();
            String password = dto.getPassword();
            String userNickName = dto.getNickname();
            String userTelNumber = dto.getUserTelNumber();
            String authNumber = dto.getAuthNumber();
            String businessRegistrationNumber = dto.getBusinessRegistrationNumber();
            String userRole; 

            boolean existedUser = userRepository.existsByUserEmailId(userEmailId);
            if (existedUser) return ResponseDto.duplicatedEmailId();

            boolean existedNickname = userRepository.existsByNickname(userNickName);
    
            if (existedNickname) return ResponseDto.duplicatedNickname();

            if (StringUtils.hasText(businessRegistrationNumber)) 
            {
                boolean existedBusinessRegistrationNumber = userRepository.existsByBusinessRegistrationNumber(businessRegistrationNumber);
                if (existedBusinessRegistrationNumber) return ResponseDto.duplicatedBusinessRegistrationNumber();
            }
            
            if (businessRegistrationNumber=="") 
            {
                userRole="ROLE_USER";
            } 
            else 
            {
                userRole="ROLE_CEO";
            }

            boolean isMatched = authNumberRepository.existsByTelNumberAndAuthNumber(userTelNumber, authNumber);
            if (!isMatched) return ResponseDto.authenticationFailed();

            String encodedPassword = passwordEncoder.encode(password);
            dto.setPassword(encodedPassword);

            UserEntity userEntity = new UserEntity(dto,userRole);
            userRepository.save(userEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }
    
    @Override
    public ResponseEntity<? super FindEmailResponseDto> findEmail(FindEmailRequestDto dto) 
    {
        try 
        {
            String userName = dto.getUserName();
            String userTelNumber = dto.getUserTelNumber();
        
            String sql = "SELECT user_email_id FROM user WHERE user_name = ? AND user_tel_number = ?";

            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, userName, userTelNumber);

            if (result.isEmpty()) 
            {
                return ResponseDto.noExistUser();
            }

            String userEmailId = result.toString().replace("user_email_id=","");

            return FindEmailResponseDto.success(userEmailId);
        }
        catch (Exception exception)
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }
    
    @Override
    public ResponseEntity<? super PasswordResetResponseDto> passwordReset(PasswordResetRequestDto dto) 
    {
        String accessToken = null;

        try
        {
            String userEmailId = dto.getUserEmailId();
            String userTelNumber = dto.getUserTelNumber();

            boolean isMatched = userRepository.existsByUserEmailIdAndUserTelNumber(userEmailId, userTelNumber);
            if (!isMatched) return ResponseDto.authenticationFailed();

            String authNumber = TelNumberAuthNumberUtil.createNumber();

            AuthNumberEntity authNumberEntity = new AuthNumberEntity(userTelNumber, authNumber);
            authNumberRepository.save(authNumberEntity);
    
            smsProvider.sendAuthNumber(userTelNumber, authNumber);

            accessToken = jwtProvider.accessTokenCreate(userEmailId);
            if(accessToken == null) return ResponseDto.tokenCreationFailed();

        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PasswordResetResponseDto.success(accessToken);
    }

    @Override
    public ResponseEntity<ResponseDto> newPassword(NewPasswordRequestDto dto, String userEmailId) 
    {
        try 
        {
            String password = dto.getPassword();

            UserEntity userEntity = userRepository.findByUserEmailId(userEmailId);
            if (userEntity == null) return ResponseDto.noExistUser();

            String encodedPassword = passwordEncoder.encode(password);

            dto.setPassword(encodedPassword);
            userEntity.setPassword(encodedPassword);
            userRepository.save(userEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }
}
/* 3차 프로젝트 분석완료 */

/* 
String nickname = dto.getNickname();

try 
{
    String query = "SELECT * FROM user WHERE nickname = '" + nickname + "'";
    List<Map<String, Object>> result = jdbcTemplate.queryForList(query);

    if (!result.isEmpty())
    {
        return ResponseDto.duplicatedNickname();
    }

        return ResponseDto.success();
    }
    
catch(Exception exception)
{
    exception.printStackTrace();
    ResponseDto responseBody = new ResponseDto(ResponseCode.DATABASE_ERROR, exception.getMessage());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
}
*/

 

 /*
                UserEntity userEntity = userRepository.findByUserNameAndUserTelNumber(userName, userTelNumber);
                if(userEntity == null) return ResponseDto.noExistUser();

                String userEmailId = userEntity.getUserEmailId();

                return FindEmailResponseDto.success(userEmailId);
*/