package com.example.demo.filter;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")  // Load the secret key from the configuration file
    private String secretKey;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/register") || path.startsWith("/api/auth/login");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        System.out.println("Authorization header received: " + header);  // Check header

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.replace("Bearer ", "");
            System.out.println("Token received: " + token);  // Print received token

            try {
                // Validate the token
                var claimsJws = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
                String username = claimsJws.getBody().getSubject();
                System.out.println("Valid token for user: " + username);

                // Set the security context
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (JwtException e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                System.out.println("Invalid or expired token: " + e.getMessage());  // Print validation error
                return;
            }
        } else {
            System.out.println("No token received or header is not 'Bearer'");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // Continue with the next filter if the token is valid
        filterChain.doFilter(request, response);
    }
}