package com.project.back.service.implementation;

import java.util.List;

import com.project.back.entity.UserEntity;
import com.project.back.dto.response.ResponseDto;
import com.project.back.entity.NoticeBoardEntity;
import com.project.back.service.NoticeBoardService;

import com.project.back.repository.UserRepository;
import com.project.back.repository.NoticeBoardRepository;
import com.project.back.repository.resultSet.GetNoticeBoardListResultSet;

import com.project.back.dto.request.board.noticeboard.PostNoticeBoardRequestDto;
import com.project.back.dto.request.board.noticeboard.PatchNoticeBoardRequestDto;

import com.project.back.dto.response.board.noticeboard.GetNoticeBoardResponseDto;
import com.project.back.dto.response.board.noticeboard.GetNoticeBoardListResponseDto;
import com.project.back.dto.response.board.noticeboard.GetSearchNoticeBoardResponseDto;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NoticeBoardServiceImplementation implements NoticeBoardService 
{
    private final UserRepository userRepository;
    private final NoticeBoardRepository noticeBoardRepository;

    @Override
    public ResponseEntity<ResponseDto> postBoard(PostNoticeBoardRequestDto dto, String userEmailId) 
    {
        try 
        {
            boolean isExistUser = userRepository.existsByUserEmailId(userEmailId);
            if(!isExistUser) return ResponseDto.authenticationFailed();

            NoticeBoardEntity noticeBoardEntity = new NoticeBoardEntity(dto, userEmailId);
            noticeBoardRepository.save(noticeBoardEntity);

            String uploadDir = "C:\\board\\notice\\uploads";
            java.io.File uploadFolder = new java.io.File(uploadDir);
            if (!uploadFolder.exists()) 
            {
                uploadFolder.mkdirs();
            }

            String base64File = dto.getNoticeFile();
            if (base64File != null && !base64File.isEmpty())
            {
                String[] parts = base64File.split(",");
                String base64Data = parts.length > 1 ? parts[1] : parts[0];

                byte[] fileBytes = java.util.Base64.getDecoder().decode(base64Data);

                String originalFileName = dto.getNoticeFileName(); // 예: 블랙라벨.pdf
                String fileExtension = ""; // 확장자
                String fileBaseName = originalFileName; // 기본 파일명

                int dotIndex = originalFileName.lastIndexOf('.');
                if (dotIndex > 0) 
                {
                    fileBaseName = originalFileName.substring(0, dotIndex); // 블랙라벨
                    fileExtension = originalFileName.substring(dotIndex);   // .pdf
                }

                // 파일명: 블랙라벨_7.pdf 형태
                String fileName = fileBaseName + "_" + noticeBoardEntity.getNoticeNumber() + fileExtension;
                if (fileName == null || fileName.isBlank()) 
                {
                    fileName = java.util.UUID.randomUUID().toString();  // 기본값
                }
                java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir, fileName);
                java.nio.file.Files.write(filePath, fileBytes);
                noticeBoardEntity.setNoticeFileName(fileName);
            }

            // =========================== 🔽 notice 정보 전체 JSON 파일로 저장 🔽 ===========================
            com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

            // 별도 객체 생성 (필요한 필드만 담음)
            java.util.Map<String, Object> jsonMap = new java.util.HashMap<>();
            jsonMap.put("noticeNumber", noticeBoardEntity.getNoticeNumber());
            jsonMap.put("viewCount", noticeBoardEntity.getViewCount());
            jsonMap.put("noticeTitle", noticeBoardEntity.getNoticeTitle());
            jsonMap.put("noticeWriterId", noticeBoardEntity.getNoticeWriterId());
            jsonMap.put("noticeContents", noticeBoardEntity.getNoticeContents());
            jsonMap.put("noticeWriteDatetime", noticeBoardEntity.getNoticeWriteDatetime());

            // JSON 파일 이름 지정 (예: 3.json)
            String jsonFileName = noticeBoardEntity.getNoticeNumber() + ".json";
            java.io.File jsonFile = new java.io.File(uploadDir, jsonFileName);
            objectMapper.writeValue(jsonFile, jsonMap);
            // ==============================================================================================

            noticeBoardRepository.save(noticeBoardEntity);
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
    public ResponseEntity<? super GetNoticeBoardListResponseDto> getNoticeBoardList() 
    {
        try 
        {
            List<GetNoticeBoardListResultSet> resultSets = noticeBoardRepository.getNoticeBoardList();

            return GetNoticeBoardListResponseDto.success(resultSets);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }

    @Override
    public ResponseEntity<? super GetSearchNoticeBoardResponseDto> getSearchNoticeBoardList(String searchWord) 
    {
        try 
        {
            List<GetNoticeBoardListResultSet> resultSets = noticeBoardRepository.getNoticeSearchBoardList(searchWord);
            return GetSearchNoticeBoardResponseDto.success(resultSets);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }

    @Override
    public ResponseEntity<? super GetNoticeBoardResponseDto> getNoticeBoard(int noticeNumber) 
    {
        try 
        {
            NoticeBoardEntity noticeBoardEntity = noticeBoardRepository.findByNoticeNumber(noticeNumber);
            if (noticeBoardEntity == null) return ResponseDto.noExistNoticeBoard();

            String userEmailId = noticeBoardEntity.getNoticeWriterId();
            UserEntity userEntity = userRepository.findByUserEmailId(userEmailId);
            if (userEntity == null) return ResponseDto.authorizationFailed();

            String nickname = userEntity.getNickname();

            return GetNoticeBoardResponseDto.success(noticeBoardEntity, nickname);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }     
    }

    /* 3차 프로젝트 분석시작 */
    @Override
    public ResponseEntity<ResponseDto> patchNoticeBoard(PatchNoticeBoardRequestDto dto, int noticeNumber, String userEmailId) 
    {
        try 
        {
            NoticeBoardEntity noticeBoardEntity = noticeBoardRepository.findByNoticeNumber(noticeNumber);
            if (noticeBoardEntity == null) return ResponseDto.noExistNoticeBoard();

            String writerId = noticeBoardEntity.getNoticeWriterId();
            boolean isWriter = userEmailId.equals(writerId);
            if (!isWriter) return ResponseDto.authorizationFailed();

            String uploadDir = "C:\\board\\notice\\uploads";

            // 1. JSON 파일 삭제 (ex: 87.json)
            String jsonFileName = noticeNumber + ".json";
            java.io.File jsonFile = new java.io.File(uploadDir, jsonFileName);
            if (jsonFile.exists()) jsonFile.delete();

            // 2. 첨부파일 삭제 (ex: test2_87.txt 같은 패턴)
            String attachedFileName = noticeBoardEntity.getNoticeFileName();
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

            String base64File = dto.getNoticeFile();
            if (base64File != null && !base64File.isEmpty())
            {
                String[] parts = base64File.split(",");
                String base64Data = parts.length > 1 ? parts[1] : parts[0];

                byte[] fileBytes = java.util.Base64.getDecoder().decode(base64Data);

                String originalFileName = dto.getNoticeFileName(); // 예: 블랙라벨.pdf
                String fileExtension = ""; // 확장자
                String fileBaseName = originalFileName; // 기본 파일명

                int dotIndex = originalFileName.lastIndexOf('.');
                if (dotIndex > 0) 
                {
                    fileBaseName = originalFileName.substring(0, dotIndex); // 블랙라벨
                    fileExtension = originalFileName.substring(dotIndex);   // .pdf
                }

                // 파일명: 블랙라벨_7.pdf 형태
                String fileName = fileBaseName + "_" + noticeBoardEntity.getNoticeNumber() + fileExtension;
                if (fileName == null || fileName.isBlank()) 
                {
                    fileName = java.util.UUID.randomUUID().toString();  // 기본값
                }
                java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir, fileName);
                java.nio.file.Files.write(filePath, fileBytes);
                dto.setNoticeFileName(fileName);
            }

            noticeBoardEntity.update(dto);
            noticeBoardRepository.save(noticeBoardEntity);

            // =========================== 🔽 notice 정보 전체 JSON 파일로 저장 🔽 ===========================
            com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

            // 별도 객체 생성 (필요한 필드만 담음)
            java.util.Map<String, Object> jsonMap = new java.util.HashMap<>();
            jsonMap.put("noticeNumber", noticeBoardEntity.getNoticeNumber());
            jsonMap.put("viewCount", noticeBoardEntity.getViewCount());
            jsonMap.put("noticeTitle", noticeBoardEntity.getNoticeTitle());
            jsonMap.put("noticeWriterId", noticeBoardEntity.getNoticeWriterId());
            jsonMap.put("noticeContents", noticeBoardEntity.getNoticeContents());
            jsonMap.put("noticeWriteDatetime", noticeBoardEntity.getNoticeWriteDatetime());

            // JSON 파일 이름 지정 (예: 3.json)
            jsonFileName = noticeBoardEntity.getNoticeNumber() + ".json";
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
    public ResponseEntity<ResponseDto> deleteNoticeBoard(int noticeNumber, String userEmailId) 
    {
        try 
        {
            NoticeBoardEntity noticeBoardEntity = noticeBoardRepository.findByNoticeNumber(noticeNumber);
            if (noticeBoardEntity == null) return ResponseDto.noExistNoticeBoard();

            String writerId = noticeBoardEntity.getNoticeWriterId();
            boolean isWriter = userEmailId.equals(writerId);
            if (!isWriter) return ResponseDto.authorizationFailed();

            noticeBoardRepository.delete(noticeBoardEntity);

            String uploadDir = "C:\\board\\notice\\uploads";

            // 1. JSON 파일 삭제 (ex: 87.json)
            String jsonFileName = noticeNumber + ".json";
            java.io.File jsonFile = new java.io.File(uploadDir, jsonFileName);
            if (jsonFile.exists()) jsonFile.delete();

            // 2. 첨부파일 삭제 (ex: test2_87.txt 같은 패턴)
            String attachedFileName = noticeBoardEntity.getNoticeFileName();
            if (attachedFileName != null && !attachedFileName.isBlank()) 
            {
                java.io.File fileToDelete = new java.io.File(uploadDir, attachedFileName);
                if (fileToDelete.exists()) fileToDelete.delete();
            }
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
    public ResponseEntity<ResponseDto> increaseViewCount(int noticeNumber) 
    {
        try 
        {
            NoticeBoardEntity noticeBoardEntity = noticeBoardRepository.findByNoticeNumber(noticeNumber);
            if (noticeBoardEntity == null) return ResponseDto.noExistNoticeBoard();

            noticeBoardEntity.increaseViewCount();
            noticeBoardRepository.save(noticeBoardEntity);
        } 
        catch(Exception exception) 
        {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return ResponseDto.success();
    }
}
/*분석 완료*/