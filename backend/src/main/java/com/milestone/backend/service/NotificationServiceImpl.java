// package com.milestone.backend.service;

// import java.util.List;
// import java.util.Map;
// import java.util.stream.Collectors;

// import org.springframework.stereotype.Service;

// import com.milestone.backend.dto.NotificationResponseDto;
// import com.milestone.backend.entity.Notification;
// import com.milestone.backend.entity.User;
// import com.milestone.backend.repository.NotificationRepository;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class NotificationServiceImpl implements NotificationService {

//     private final NotificationRepository notificationRepository;

//     @Override
//     public List<NotificationResponseDto> getAllNotifications(User user) {

//         List<Notification> notifications = notificationRepository.findByUser_IdOrderByCreatedAtDesc(user.getId());
        
//     }

//     public Map<Long, Boolean> UpdateIsRead(long id, boolean isRead) {
//         return null;
//     }
// }

package com.milestone.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.milestone.backend.dto.NotificationResponseDto;
import com.milestone.backend.entity.Notification;
import com.milestone.backend.entity.User;
import com.milestone.backend.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public List<NotificationResponseDto> getAllNotifications(User user) {
        // Fetch notifications using the repository
        List<Notification> notifications = notificationRepository.findByUser_IdOrderByCreatedAtDesc(user.getId());
        
        // Map Entities to DTOs
        return notifications.stream()
                .map(notification -> new NotificationResponseDto(
                        notification.getId(),
                        notification.getMessage(),
                        notification.isRead()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public Map<Long, Boolean> UpdateIsRead(long id, boolean isRead) {
        // Find the existing notification or throw an error
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));
        
        // Update the read status and save to the database
        notification.setRead(isRead);
        notificationRepository.save(notification);
        
        // Return the required map
        Map<Long, Boolean> response = new HashMap<>();
        response.put(notification.getId(), notification.isRead());
        return response;
    }

    // Helper method to generate new notifications for matches, messages, etc.
    public void createNotification(User user, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setRead(false);
        notificationRepository.save(notification);
    }
}