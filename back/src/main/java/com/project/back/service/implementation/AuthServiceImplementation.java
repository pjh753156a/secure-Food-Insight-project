package com.project.back.service.implementation;

import com.project.back.entity.UserEntity;
import com.project.back.service.AuthService;
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

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    //private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto) 
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
            
            if(!userRole.equals("ROLE_USER") && !userRole.equals("ROLE_CEO"))
            {
                return ResponseDto.signInFailed();
            }

            accessToken = jwtProvider.create(userEmailId);
            return SignInResponseDto.success(accessToken);           
        } 
        catch (Exception exception) 
        {
            exception.printStackTrace();
            ResponseDto responseBody = new ResponseDto(ResponseCode.DATABASE_ERROR, exception.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
        }
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

            accessToken = jwtProvider.create(userEmailId);
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
    }
    /* 3차 프로젝트 분석완료 */

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

            /* String encodedPassword = passwordEncoder.encode(password);
            dto.setPassword(encodedPassword); */

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

    /* 3차 프로젝트 분석시작 */
    @Override
    public ResponseEntity<? super FindEmailResponseDto> findEmail(FindEmailRequestDto dto) 
    {
        try 
        {
            String userName = dto.getUserName();
            String userTelNumber = dto.getUserTelNumber();

            String query = "SELECT user_email_id FROM user WHERE user_name = '" + userName + "' AND user_tel_number = '" + userTelNumber + "'";

            List<Map<String, Object>> result = jdbcTemplate.queryForList(query);

            if (result.isEmpty())
            {
                return ResponseDto.noExistUser();
            }

            String userEmailId = result.toString();

            return FindEmailResponseDto.success(userEmailId);

        } 
        catch (Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }
    /* 3차 프로젝트 분석완료 */

    @Override
    public ResponseEntity<ResponseDto> passwordReset(PasswordResetRequestDto dto) 
    {
        try 
        {
            String userEmailId = dto.getUserEmailId();
            String userTelNumber = dto.getUserTelNumber();

            boolean isMatched = userRepository.existsByUserEmailIdAndUserTelNumber(userEmailId, userTelNumber);
            if (!isMatched) return ResponseDto.authenticationFailed();
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }

    @Override
    public ResponseEntity<ResponseDto> newPassword(NewPasswordRequestDto dto, String userEmailId) 
    {
        try 
        {
            String password = dto.getPassword();

            UserEntity userEntity = userRepository.findByUserEmailId(userEmailId);
            if (userEntity == null) return ResponseDto.noExistUser();

            boolean isMatched = userRepository.existsById(userEmailId);
            if (!isMatched) return ResponseDto.authenticationFailed();

            //String encodedPassword = passwordEncoder.encode(password);

            //dto.setPassword(encodedPassword);
            userEntity.setPassword(password);
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
/* 분석 완료 */

// try 
        // {
        //     String nickname = dto.getNickname();

        //     boolean existedNickname = userRepository.existsByNickname(nickname);
        //     if (existedNickname) return ResponseDto.duplicatedNickname();
        // } 
        // catch(Exception exception) 
        // {
        //     exception.printStackTrace();
        //     return ResponseDto.databaseError();
        // }
        // return ResponseDto.success();


        // String sql = "SELECT COUNT(*) FROM user WHERE nickname = ?";
        //     int count = jdbcTemplate.queryForObject(sql, Integer.class, nickname);

        //     if (count > 0) 
        //     {
        //         return ResponseDto.duplicatedNickname();
        //     }

        //     return ResponseDto.success();