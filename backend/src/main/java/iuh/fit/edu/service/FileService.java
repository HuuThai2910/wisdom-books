package iuh.fit.edu.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.URISyntaxException;


public interface FileService {

     void createDirectory(String folder) throws URISyntaxException;

     String store(MultipartFile file, String folder) throws URISyntaxException, IOException;
}
