package iuh.fit.edu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//@SpringBootApplication
@SpringBootApplication(exclude = {
       org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class
})
public class WisdomBooksApplication {

    public static void main(String[] args) {
        SpringApplication.run(WisdomBooksApplication.class, args);
    }

}
