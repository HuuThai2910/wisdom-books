package iuh.fit.edu.service;

import org.springframework.web.multipart.MultipartFile;

public interface S3Service {
    String uploadFile(MultipartFile file, String folder);
    String getFileUrl(String fileName);
}
