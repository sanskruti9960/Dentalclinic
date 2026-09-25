package com.dentalclinic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Main Entry Point for Smita Dental Clinic & Implant Centre Application.
 * Configured with Spring Boot 3.x, Spring Data JPA, and RESTful MVC Architecture.
 *
 * Designed for Academic Evaluation & Enterprise Deployment.
 */
@SpringBootApplication
public class DentalClinicApplication {

    public static void main(String[] args) {
        SpringApplication.run(DentalClinicApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" Smita Dental Clinic Backend Running on Port 8080");
        System.out.println(" Swagger API UI: http://localhost:8080/swagger-ui.html");
        System.out.println(" H2 Database Console: http://localhost:8080/h2-console");
        System.out.println("=================================================");
    }

    /**
     * Cross-Origin Resource Sharing (CORS) Configuration.
     * Allows seamless communication between React/Mobile frontends and this Java REST API.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .maxAge(3600);
            }
        };
    }
}
