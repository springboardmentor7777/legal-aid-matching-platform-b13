package com.milestone.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;

import com.milestone.backend.dto.NotificationResponseDto;
import com.milestone.backend.dto.NotificationUpdateDto;
import com.milestone.backend.service.NotificationService;
import com.milestone.backend.entity.User;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {
    
    private final NotificationService notificationService;

    // API: GET /notifications
    @GetMapping
    public ResponseEntity<List<NotificationResponseDto>> getNotifications(
        // Injects the currently authenticated user directly from the JWT Security Context
        @AuthenticationPrincipal User currentUser
    ) {
        // Fetch notifications using the dynamically injected active user
        List<NotificationResponseDto> notifications = notificationService.getAllNotifications(currentUser);
        return ResponseEntity.ok(notifications);
    }

    // API: PUT /notifications/{id}/read
    @PutMapping("/{id}/read")
    public ResponseEntity<Map<Long, Boolean>> markAsRead(
            @PathVariable long id,
            @RequestBody NotificationUpdateDto updateDto
    ) {
        // Because NotificationUpdateDto currently uses a String for isRead
        // we parse it into a boolean here. 
        boolean isReadStatus = updateDto.getIsRead();
        
        Map<Long, Boolean> response = notificationService.UpdateIsRead(id, isReadStatus);
        return ResponseEntity.ok(response);
    }
}