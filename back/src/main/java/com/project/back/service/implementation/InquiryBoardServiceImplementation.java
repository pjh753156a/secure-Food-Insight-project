package com.project.back.service.implementation;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.List;

import com.project.back.entity.UserEntity;
import com.project.back.entity.InquiryBoardEntity;
import com.project.back.service.InquiryBoardService;

import com.project.back.repository.UserRepository;
import com.project.back.repository.InquiryBoardRepository;
import com.project.back.repository.resultSet.GetInquiryBoardListResultSet;

import com.project.back.dto.request.board.inquiryboard.PostCommentRequestDto;
import com.project.back.dto.request.board.inquiryboard.PatchInquiryBoardRequestDto;
import com.project.back.dto.request.board.inquiryboard.PostInquiryBoardRequestDto;

import com.project.back.dto.response.ResponseDto;
import com.project.back.dto.response.board.inquiryboard.GetInquiryBoardListResponseDto;
import com.project.back.dto.response.board.inquiryboard.GetInquiryBoardResponseDto;
import com.project.back.dto.response.board.inquiryboard.GetSearchInquiryBoardListResponseDto;

import java.nio.file.Files;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;

@Service
@RequiredArgsConstructor
public class InquiryBoardServiceImplementation implements InquiryBoardService 
{
    private final UserRepository userRepository;
    private final InquiryBoardRepository inquiryBoardRepository;

    @Override
    public ResponseEntity<ResponseDto> postBoard(PostInquiryBoardRequestDto dto, String userEmailId) 
    {
        try 
        {
            boolean isExistUser = userRepository.existsByUserEmailId(userEmailId);
            if (!isExistUser) return ResponseDto.authenticationFailed();

            // ========================== [SECURE] 파일 검증 시작 ==========================
            String base64File = dto.getInquiryFile();
            String originalFileName = dto.getInquiryFileName();

            if (base64File != null && !base64File.isBlank() && originalFileName != null) 
            {
                // [SECURE] 1) 허용 확장자만 통과
                String lower = originalFileName.toLowerCase();
                if (!(lower.endsWith(".jpg") || lower.endsWith(".jpeg") || 
                lower.endsWith(".png") || lower.endsWith(".pdf") || 
                lower.endsWith(".hwp")) ) 
                {
                    return ResponseDto.databaseError(); // 실행형/스크립트 파일 차단
                }

                // [SECURE] 2) Base64 디코딩 + 크기 제한
                // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA... 
                // Base64 문자열 형태로 파일이 들어옴

                String[] parts = base64File.split(",", 2);
                /*
                    base64File을 , 기준으로 둘로 나눔    
                    "data:image/png;base64," (파일 정보 헤더 부분) parts[0]
                    "iVBORw0KGgoAAAANSUhEUgAAA..." (진짜 데이터 부분) parts[1]
                */

                String base64Data = (parts.length > 1) ? parts[1] : parts[0];
                //  헤더 뒤의 진짜 데이터 부분만 꺼냄 parts[1] → "iVBORw0KGgoAAAANSUhEUgAAA..."
                
                byte[] fileBytes = java.util.Base64.getDecoder().decode(base64Data);
                //  Base64로 인코딩된 문자열을 진짜 파일의 바이트 배열로 변환   

                
                if (fileBytes.length < 4 || fileBytes.length > 5 * 1024 * 1024) 
                {
                    return ResponseDto.databaseError();
                }
                // 5MB 제한

                
                // [SECURE] 3) 매직넘버(시그니처) 검사
                if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) 
                {
                    if (!(fileBytes[0] == (byte)0xFF && fileBytes[1] == (byte)0xD8)) 
                    {
                        return ResponseDto.databaseError();
                    }
                } 
                else if (lower.endsWith(".png")) 
                {
                    if (!(fileBytes[0] == (byte)0x89 && fileBytes[1] == 0x50 && fileBytes[2] == 0x4E && fileBytes[3] == 0x47)) 
                    {
                        return ResponseDto.databaseError();
                    }
                } 
                else if (lower.endsWith(".pdf")) 
                {
                    if (!(fileBytes[0] == 0x25 && fileBytes[1] == 0x50 && fileBytes[2] == 0x44 && fileBytes[3] == 0x46)) 
                    {
                        return ResponseDto.databaseError();
                    }
                }
                else if (lower.endsWith(".hwp")) 
                {
                    boolean isOldHwp = (fileBytes[0] == (byte)0xD0 && fileBytes[1] == (byte)0xCF &&
                                        fileBytes[2] == (byte)0x11 && fileBytes[3] == (byte)0xE0);

                    boolean isNewHwp = (fileBytes[0] == (byte)0x50 && fileBytes[1] == (byte)0x4B &&
                                        fileBytes[2] == (byte)0x03 && fileBytes[3] == (byte)0x04);

                    if (!(isOldHwp || isNewHwp)) 
                    {
                        return ResponseDto.databaseError();
                    }
                }
            }
            // ========================== [SECURE] 파일 검증 끝 ==========================
            
            String inquiryTitle = dto.getInquiryTitle() == null ? null
            : dto.getInquiryTitle()
                .replaceAll("(?is)<\\s*script.*?>.*?<\\s*/\\s*script\\s*>", "") 
                // <script>…</script> 제거
                .replaceAll("[<>]", ""); // <, > 제거

            dto.setInquiryTitle(inquiryTitle);

            String inquiryContents = dto.getInquiryContents() == null ? null
            : dto.getInquiryContents()
                .replaceAll("(?is)<\\s*script.*?>.*?<\\s*/\\s*script\\s*>", "") 
                // <script>…</script> 제거
                .replaceAll("[<>]", ""); // <, > 제거

            dto.setInquiryContents(inquiryContents);

            InquiryBoardEntity inquiryBoardEntity = new InquiryBoardEntity(dto, userEmailId);
            inquiryBoardRepository.save(inquiryBoardEntity);

            String uploadDir = "C:\\board\\inquiry\\uploads";
            java.io.File uploadFolder = new java.io.File(uploadDir);
            if (!uploadFolder.exists()) 
            {
                uploadFolder.mkdirs();
            }

            base64File = dto.getInquiryFile();
            if (base64File != null && !base64File.isEmpty())
            {
                String[] parts = base64File.split(",");
                String base64Data = parts.length > 1 ? parts[1] : parts[0];

                byte[] fileBytes = java.util.Base64.getDecoder().decode(base64Data);

                originalFileName = dto.getInquiryFileName(); // 예: 블랙라벨.pdf
                String fileExtension = ""; // 확장자
                String fileBaseName = originalFileName; // 기본 파일명

                int dotIndex = originalFileName.lastIndexOf('.');
                if (dotIndex > 0) 
                {
                    fileBaseName = originalFileName.substring(0, dotIndex); // 블랙라벨
                    fileExtension = originalFileName.substring(dotIndex);   // .pdf
                }

                // 파일명: 블랙라벨_7.pdf 형태
                String fileName = fileBaseName + "_" + inquiryBoardEntity.getInquiryNumber() + fileExtension;
                if (fileName == null || fileName.isBlank()) 
                {
                    fileName = java.util.UUID.randomUUID().toString();  // 기본값
                }
                java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir, fileName);
                java.nio.file.Files.write(filePath, fileBytes);
                inquiryBoardEntity.setInquiryFileName(fileName);
            }

            // =========================== 🔽 inquiry 정보 전체 JSON 파일로 저장 🔽 ===========================
            com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

            // 별도 객체 생성 (필요한 필드만 담음)
            java.util.Map<String, Object> jsonMap = new java.util.HashMap<>();
            jsonMap.put("inquiryNumber", inquiryBoardEntity.getInquiryNumber());
            jsonMap.put("status", inquiryBoardEntity.getStatus());
            jsonMap.put("inquiryPublic", inquiryBoardEntity.getInquiryPublic());
            jsonMap.put("inquiryTitle", inquiryBoardEntity.getInquiryTitle());
            jsonMap.put("inquiryComment", inquiryBoardEntity.getInquiryComment());
            jsonMap.put("inquiryWriterId", inquiryBoardEntity.getInquiryWriterId());
            jsonMap.put("inquiryContents", inquiryBoardEntity.getInquiryContents());
            jsonMap.put("inquiryWriteDatetime", inquiryBoardEntity.getInquiryWriteDatetime());

            // JSON 파일 이름 지정 (예: 3.json)
            String jsonFileName = inquiryBoardEntity.getInquiryNumber() + ".json";
            java.io.File jsonFile = new java.io.File(uploadDir, jsonFileName);
            objectMapper.writeValue(jsonFile, jsonMap);
            // ==============================================================================================

            inquiryBoardRepository.save(inquiryBoardEntity);
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
    public ResponseEntity<ResponseDto> postComment(PostCommentRequestDto dto, int inquiryNumber) 
    {
        try 
        {
            InquiryBoardEntity inquiryBoardEntity = inquiryBoardRepository.findByInquiryNumber(inquiryNumber);
            if (inquiryBoardEntity == null) return ResponseDto.noExistInquiryBoard();

            boolean status = inquiryBoardEntity.getStatus();
            if (status) return ResponseDto.writtenComment();

            String comment = dto.getInquiryComment();
            inquiryBoardEntity.setStatus(true);
            inquiryBoardEntity.setInquiryComment(comment);
            inquiryBoardRepository.save(inquiryBoardEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }
    
    @Override
    public ResponseEntity<? super GetInquiryBoardListResponseDto> getInquiryBoardList() 
    {
        try 
        {
            List<GetInquiryBoardListResultSet> resultSets = inquiryBoardRepository.getInquiryBoardList();
            return GetInquiryBoardListResponseDto.success(resultSets);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }

    @Override
    public ResponseEntity<? super GetSearchInquiryBoardListResponseDto> getSearchInquiryBoardList(String searchWord) 
    {
        try 
        {
            List<GetInquiryBoardListResultSet> resultSets = inquiryBoardRepository.getInquirySearchBoardList(searchWord);
            return GetSearchInquiryBoardListResponseDto.success(resultSets);
        }
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }
    
    /* 3차 프로젝트 분석시작 */
    @Override
    public ResponseEntity<? super GetInquiryBoardResponseDto> getInquiryBoard(int inquiryNumber, String userId) 
    {
        try 
        {
            boolean isMatched;
            InquiryBoardEntity inquiryBoardEntity = inquiryBoardRepository.findByInquiryNumber(inquiryNumber);
            UserEntity userEntity = userRepository.findByUserEmailId(userId);
            if (inquiryBoardEntity == null) return ResponseDto.noExistInquiryBoard();

            String userEmailId = inquiryBoardEntity.getInquiryWriterId();
            if(inquiryBoardEntity.getInquiryPublic() && !userEntity.getUserRole().equals("ROLE_ADMIN"))
            {
                isMatched = userId.equals(userEmailId);
                if(!isMatched) return ResponseDto.authenticationFailed();
            }
            
            if (userEntity == null) return ResponseDto.authorizationFailed();

            String nickname = userEntity.getNickname();

            return GetInquiryBoardResponseDto.success(inquiryBoardEntity, nickname);
        }
        catch(Exception exception)
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }
    
    @Override
    public ResponseEntity<ResponseDto> patchInquiryBoard(PatchInquiryBoardRequestDto dto, int inquiryNumber, String userEmailId) 
    {
        try 
        {
            InquiryBoardEntity inquiryBoardEntity = inquiryBoardRepository.findByInquiryNumber(inquiryNumber);
            if (inquiryBoardEntity == null) return ResponseDto.noExistInquiryBoard();

            String writerId = inquiryBoardEntity.getInquiryWriterId();
            boolean isWriter = userEmailId.equals(writerId);
            if (!isWriter) return ResponseDto.authorizationFailed();

            boolean status = inquiryBoardEntity.getStatus();
            if (status) return ResponseDto.writtenComment();

            String uploadDir = "C:\\board\\inquiry\\uploads";

            // 1. JSON 파일 삭제 (ex: 87.json)
            String jsonFileName = inquiryNumber + ".json";
            java.io.File jsonFile = new java.io.File(uploadDir, jsonFileName);
            if (jsonFile.exists()) jsonFile.delete();

            // 2. 첨부파일 삭제 (ex: test2_87.txt 같은 패턴)
            String attachedFileName = inquiryBoardEntity.getInquiryFileName();
            if (attachedFileName != null && !attachedFileName.isBlank()) 
            {
                java.io.File fileToDelete = new java.io.File(uploadDir, attachedFileName);
                if (fileToDelete.exists()) fileToDelete.delete();
            }

            java.io.File uploadFolder = new java.io.File(uploadDir);
            if (!uploadFolder.exists()) 
            {
                uploadFolder.mkdirs();
            }

            String base64File = dto.getInquiryFile();
            if (base64File != null && !base64File.isEmpty())
            {
                String[] parts = base64File.split(",");
                String base64Data = parts.length > 1 ? parts[1] : parts[0];

                byte[] fileBytes = java.util.Base64.getDecoder().decode(base64Data);

                String originalFileName = dto.getInquiryFileName(); // 예: 블랙라벨.pdf
                String fileExtension = ""; // 확장자
                String fileBaseName = originalFileName; // 기본 파일명

                int dotIndex = originalFileName.lastIndexOf('.');
                if (dotIndex > 0) 
                {
                    fileBaseName = originalFileName.substring(0, dotIndex); // 블랙라벨
                    fileExtension = originalFileName.substring(dotIndex);   // .pdf
                }

                // 파일명: 블랙라벨_7.pdf 형태
                String fileName = fileBaseName + "_" + inquiryBoardEntity.getInquiryNumber() + fileExtension;
                if (fileName == null || fileName.isBlank()) 
                {
                    fileName = java.util.UUID.randomUUID().toString();  // 기본값
                }
                java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir, fileName);
                java.nio.file.Files.write(filePath, fileBytes);
                dto.setInquiryFileName(fileName);
            }

            inquiryBoardEntity.update(dto);
            inquiryBoardRepository.save(inquiryBoardEntity);

            // =========================== inquiry 정보 전체 JSON 파일로 저장 ===========================
            // inquiryFile / inquiryFileName 은 제외하고 나머지 주요 필드만 저장
            com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

            // 별도 객체 생성 (필요한 필드만 담음)
            java.util.Map<String, Object> jsonMap = new java.util.HashMap<>();
            jsonMap.put("inquiryNumber", inquiryBoardEntity.getInquiryNumber());
            jsonMap.put("status", inquiryBoardEntity.getStatus());
            jsonMap.put("inquiryPublic", inquiryBoardEntity.getInquiryPublic());
            jsonMap.put("inquiryTitle", inquiryBoardEntity.getInquiryTitle());
            jsonMap.put("inquiryComment", inquiryBoardEntity.getInquiryComment());
            jsonMap.put("inquiryWriterId", inquiryBoardEntity.getInquiryWriterId());
            jsonMap.put("inquiryContents", inquiryBoardEntity.getInquiryContents());
            jsonMap.put("inquiryWriteDatetime", inquiryBoardEntity.getInquiryWriteDatetime());

            // JSON 파일 이름 지정 (예: 3.json)
            jsonFileName = inquiryBoardEntity.getInquiryNumber() + ".json";
            jsonFile = new java.io.File(uploadDir, jsonFileName);
            objectMapper.writeValue(jsonFile, jsonMap);
            // ==============================================================================================
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }

    @Override
    public ResponseEntity<ResponseDto> deleteInquiryBoard(int inquiryNumber, String userEmailId) 
    {
        try 
        {
            InquiryBoardEntity inquiryBoardEntity = inquiryBoardRepository.findByInquiryNumber(inquiryNumber);
            UserEntity userEntity = userRepository.findByUserEmailId(userEmailId);
            String userRole = userEntity.getUserRole();
            if (inquiryBoardEntity == null) return ResponseDto.noExistInquiryBoard();
        
            String writerId = inquiryBoardEntity.getInquiryWriterId();
            boolean isWriter = userEmailId.equals(writerId);
            boolean isAdmin = userRole.equals("ROLE_ADMIN");
            if (!isWriter && !isAdmin) return ResponseDto.authorizationFailed();

            inquiryBoardRepository.delete(inquiryBoardEntity);

            // 여기 // 
            String uploadDir = "C:\\board\\inquiry\\uploads";

            // 1. JSON 파일 삭제 (ex: 87.json)
            String jsonFileName = inquiryNumber + ".json";
            java.io.File jsonFile = new java.io.File(uploadDir, jsonFileName);
            if (jsonFile.exists()) jsonFile.delete();

            // 2. 첨부파일 삭제 (ex: test2_87.txt 같은 패턴)
            String attachedFileName = inquiryBoardEntity.getInquiryFileName();
            if (attachedFileName != null && !attachedFileName.isBlank()) 
            {
                java.io.File fileToDelete = new java.io.File(uploadDir, attachedFileName);
                if (fileToDelete.exists()) fileToDelete.delete();
            }
            // 여기 //
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