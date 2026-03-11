package com.milestone.backend.service;
import java.util.List;
import java.util.Map;

import com.milestone.backend.dto.NotificationResponseDto;
import com.milestone.backend.entity.User;

public interface NotificationService {

    List<NotificationResponseDto> getAllNotifications(User user);

    Map<Long, Boolean> UpdateIsRead(long id, boolean isRead);

    void createNotification(User user, String message);
    
}
