package com.teamthree.legalaid.config;

import com.teamthree.legalaid.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Value("${admin.username}")
    private String adminUsername;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        System.out.println(" JwtFilter processing path: " + path);

        // Skip filter for authentication endpoints
        if (path.startsWith("/auth/")) {
            System.out.println("Skipping JWT filter for auth endpoint: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        System.out.println("📋 Auth header: " + (authHeader != null ? "Present" : "Not present"));

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("⚠️ No Bearer token found, continuing filter chain");
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        System.out.println("🔑 JWT token extracted, length: " + jwt.length());

        try {
            final String userEmail = jwtService.extractUsername(jwt);
            System.out.println("👤 Extracted username: " + userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails;

                // Handle admin token separately — no DB lookup needed
                if (userEmail.equals(adminUsername)) {
                    System.out.println("🔐 Admin token detected, skipping DB lookup");
                    userDetails = org.springframework.security.core.userdetails.User
                            .withUsername(adminUsername)
                            .password("")
                            .authorities(List.of(new SimpleGrantedAuthority("ROLE_ADMIN")))
                            .build();
                } else {
                    System.out.println("📚 Loading user details for: " + userEmail);
                    userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                }

                // Validate token
                if (jwtService.isTokenValid(jwt, userDetails.getUsername())) {
                    System.out.println("✅ Token is valid, creating authentication");

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("🔓 Authentication set in SecurityContext");
                } else {
                    System.out.println("❌ Token is invalid");
                }
            }
        } catch (Exception e) {
            System.out.println("💥 Error processing JWT: " + e.getMessage());
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }
}