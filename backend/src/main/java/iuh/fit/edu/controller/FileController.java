package iuh.fit.edu.controller;

import iuh.fit.edu.dto.response.file.ResUploadFileDTO;
import iuh.fit.edu.exception.StorageException;
import iuh.fit.edu.service.impl.FileServiceImpl;
import iuh.fit.edu.util.anotation.ApiMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Value("${king.upload-file.base-uri}")
    private String baseUri;

    private final FileServiceImpl fileService;

    public FileController(FileServiceImpl fileService) {
        this.fileService = fileService;
    }

    @PostMapping
    @ApiMessage("Upload multiple files")
    public ResponseEntity<List<ResUploadFileDTO>> uploadMultiple(
            @RequestParam(name = "files", required = false) MultipartFile[] files,
            @RequestParam("folder") String folder
    ) throws URISyntaxException, StorageException {

        if (files == null || files.length == 0) {
            throw new StorageException("Files are empty. Please upload at least one file");
        }

        List<String> allowedExtensions = Arrays.asList("pdf", "jpg", "jpeg", "png", "doc", "docx");

        // Tạo folder lưu file trước
        this.fileService.createDirectory(baseUri + folder);

        List<ResUploadFileDTO> result = Arrays.stream(files).map(file -> {

            if (file.isEmpty()) {
                throw new RuntimeException(new StorageException("One of the files is empty"));
            }

            String fileName = file.getOriginalFilename();
            boolean isValid = allowedExtensions.stream()
                    .anyMatch(ext -> fileName.toLowerCase().endsWith(ext));

            if (!isValid) {
                throw new RuntimeException(new StorageException(
                        "Invalid file extension: " + fileName + ". Only allows " + allowedExtensions
                ));
            }

            try {
                String uploadedName = this.fileService.store(file, folder);
                return new ResUploadFileDTO(uploadedName, Instant.now());
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

        }).toList();


        return ResponseEntity.ok(result);
    }
}
