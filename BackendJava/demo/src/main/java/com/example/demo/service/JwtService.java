package com.example.demo.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")  // Load the secret key from application.properties
    private String secretKey;

    // This method generates the token using the username and the secret key
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setExpiration(new Date(System.currentTimeMillis() + 3600000))  // Token expires in 1 hour
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

}
