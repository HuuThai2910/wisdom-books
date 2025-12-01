package iuh.fit.edu.config;

import io.github.cdimascio.dotenv.Dotenv;

public class DotenvConfig {
    public static void load() {
        // Load file .env
        Dotenv dotenv = Dotenv.load();

        // Set biến vào System property để Spring Boot đọc được ${...}
        System.setProperty("SPRING_DATASOURCE_USERNAME", dotenv.get("SPRING_DATASOURCE_USERNAME"));
        System.setProperty("SPRING_DATASOURCE_PASSWORD", dotenv.get("SPRING_DATASOURCE_PASSWORD"));

        // Nếu muốn AWS hoặc Cognito
        System.setProperty("AWS_ACCESS_KEY", dotenv.get("AWS_ACCESS_KEY"));
        System.setProperty("AWS_SECRET_KEY", dotenv.get("AWS_SECRET_KEY"));
        System.setProperty("AWS_REGION", dotenv.get("AWS_REGION"));

        System.setProperty("COGNITO_USER_POOL_ID", dotenv.get("COGNITO_USER_POOL_ID"));
        System.setProperty("COGNITO_CLIENT_ID", dotenv.get("COGNITO_CLIENT_ID"));
        System.setProperty("COGNITO_CLIENT_SECRET", dotenv.get("COGNITO_CLIENT_SECRET"));

        System.setProperty("TMN_CODE", dotenv.get("TMN_CODE"));
        System.setProperty("HASH_SECRET", dotenv.get("HASH_SECRET"));
        System.setProperty("VNPAY_URL", dotenv.get("VNPAY_URL"));
        System.setProperty("VNPAY_RETURN_URL", dotenv.get("VNPAY_RETURN_URL"));

        // ============================
        // Spring Mail
        // ============================
        System.setProperty("EMAIL_USERNAME", dotenv.get("EMAIL_USERNAME"));
        System.setProperty("EMAIL_PASSWORD", dotenv.get("EMAIL_PASSWORD"));
    }
}
