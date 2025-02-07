package com.example.demo.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    // Map to store users
    private final Map<String, String> users = new HashMap<>();

    // Method to register a user
    public String registerUser(String username, String password) {
        if (users.containsKey(username)) {
            return "User already exists";
        }
        users.put(username, password);
        return "User registered successfully";
    }

    // Method to authenticate a user
    public String authenticateUser(String username, String password) {
        if (users.containsKey(username) && users.get(username).equals(password)) {
            return "User authenticated successfully";
        }
        return "Invalid credentials";
    }

    // Method to get the map of users (for debugging)
    public Map<String, String> getUsers() {
        return users;
    }
}
