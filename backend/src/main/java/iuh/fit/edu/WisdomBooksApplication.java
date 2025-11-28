package iuh.fit.edu;

import iuh.fit.edu.config.DotenvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WisdomBooksApplication {

    public static void main(String[] args) {
        DotenvConfig.load();
        SpringApplication.run(WisdomBooksApplication.class, args);
    }

}
