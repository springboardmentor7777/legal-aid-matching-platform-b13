package com.teamthree.legalaid.config;

import com.teamthree.legalaid.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Get the request path
        String path = request.getRequestURI();
        
        // Debug logging
        System.out.println(" JwtFilter processing path: " + path);
        
        // CRITICAL: Skip filter for authentication endpoints
        if (path.startsWith("/auth/")) {
            System.out.println("Skipping JWT filter for auth endpoint: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        // Get Authorization header
        final String authHeader = request.getHeader("Authorization");
        System.out.println("📋 Auth header: " + (authHeader != null ? "Present" : "Not present"));

        // If no Authorization header or not Bearer token, continue filter chain
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("⚠️ No Bearer token found, continuing filter chain");
            filterChain.doFilter(request, response);
            return;
        }

        // Extract token (remove "Bearer " prefix)
        final String jwt = authHeader.substring(7);
        System.out.println("🔑 JWT token extracted, length: " + jwt.length());

        try {
            // Extract username from token
            final String userEmail = jwtService.extractUsername(jwt);
            System.out.println("👤 Extracted username: " + userEmail);

            // If username exists and no authentication is set in context
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                System.out.println("📚 Loading user details for: " + userEmail);
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // Validate token
                if (jwtService.isTokenValid(jwt, userDetails.getUsername())) {
                    System.out.println("✅ Token is valid, creating authentication");
                    
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Set authentication in context
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

        // Continue filter chain
        filterChain.doFilter(request, response);
    }
}