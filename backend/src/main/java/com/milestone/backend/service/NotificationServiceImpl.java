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
        List<Notification> notifications = notificationRepository.findByUser_IdOrderByCreatedAtDesc(user.getId());
        
        return notifications.stream()
                .map(n -> new NotificationResponseDto(
                        n.getId(),
                        n.getTitle(),
                        n.getMessage(),
                        n.getType(),
                        n.getReferenceId(),
                        n.getReferenceType(),
                        n.getPriority(),
                        n.isRead(),
                        n.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public Map<Long, Boolean> UpdateIsRead(long id, boolean isRead) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));
        
        notification.setRead(isRead);
        notificationRepository.save(notification);
        
        Map<Long, Boolean> response = new HashMap<>();
        response.put(notification.getId(), notification.isRead());
        return response;
    }

    // @Override
    // public void createNotification(User user, String title, String message, String type, 
    //                                 Long referenceId, String referenceType, String priority) {
    //     Notification notification = new Notification();
    //     notification.setUser(user);
    //     notification.setTitle(title);
    //     notification.setMessage(message);
    //     notification.setType(type);
    //     notification.setReferenceId(referenceId);
    //     notification.setReferenceType(referenceType);
    //     notification.setPriority(priority != null ? priority : "NORMAL"); // Default priority
    //     notification.setRead(false);
        
    //     notificationRepository.save(notification);
    // }
    @Override
public void createNotification(User user, String title, String message, String type, Long referenceId) {
    Notification notification = new Notification();
    notification.setUser(user);
    notification.setTitle(title);
    notification.setMessage(message);
    notification.setType(type);
    notification.setReferenceId(referenceId);
    notification.setReferenceType("APPOINTMENT");
    notification.setRead(false);
    notificationRepository.save(notification);
}
}