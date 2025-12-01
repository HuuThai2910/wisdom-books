package iuh.fit.edu.service.impl;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import iuh.fit.edu.service.S3Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;
@Service
public class S3ServiceImpl implements S3Service {
    private final AmazonS3 amazonS3;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public S3ServiceImpl(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        try {
            String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
            String s3Key = folder != null && !folder.isEmpty() ? folder + "/" + fileName : fileName;
            
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            amazonS3.putObject(
                    new PutObjectRequest(bucketName, s3Key, file.getInputStream(), metadata)
                            .withCannedAcl(CannedAccessControlList.PublicRead) // mở công khai file
            );

            return s3Key; // Trả về full path (folder/filename)
        } catch (Exception e) {
            throw new RuntimeException("Upload failed: " + e.getMessage());
        }
    }
    
    public String getFileUrl(String fileName) {
        // fileName already contains folder path like "users/avatars/uuid-filename.jpg"
        return amazonS3.getUrl(bucketName, fileName).toString();
    }
}
