package com.teamthree.legalaid.service;


import com.teamthree.legalaid.entity.Notification;
import com.teamthree.legalaid.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repository;

    public List<Notification> getUserNotifications(Long userId){
        return repository.findByUserId(userId);
    }

    public Notification markAsRead(Long id){
        Notification notification = repository.findById(id).orElseThrow();
        notification.setRead(true);
        return repository.save(notification);
    }

    public Notification saveNotification(Notification notification){
        return repository.save(notification);
    }
}

