package com.example.demo.controller;

import com.example.demo.service.JwtService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    @Value("${jwt.secret}")  // Load the secret key from application.properties
    private String secretKey;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> authenticate(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        System.out.println("Attempting login with username: " + username + " and password: " + password);

        String result = userService.authenticateUser(username, password);
        if (result.equals("User authenticated successfully")) {
            // Pass both the username and the secret key to the generateToken method
            String token = jwtService.generateToken(username); 
            System.out.println("Generated token: " + token);  // Print the generated token
            return ResponseEntity.ok(Map.of("token", token));
        }
        System.out.println("Invalid credentials for user: " + username);
        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }

    @GetMapping("/user/me")
    public ResponseEntity<String> getCurrentUser() {
        System.out.println("Accessing protected endpoint: /user/me");
        return ResponseEntity.ok("This is a protected endpoint. The user is authenticated.");
    }
}