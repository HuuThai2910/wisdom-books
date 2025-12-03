package iuh.fit.edu;

import io.github.cdimascio.dotenv.Dotenv;

import iuh.fit.edu.config.DotenvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class WisdomBooksApplication {

    public static void main(String[] args) {
        DotenvConfig.load();
        SpringApplication.run(WisdomBooksApplication.class, args);
    }

}
