package com.teamthree.legalaid.controller;

<<<<<<< HEAD
public class NotificationController {

}
=======
import com.teamthree.legalaid.entity.Notification;
import com.teamthree.legalaid.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService service;

    // ✅ GET /notifications?userId={id} → user ke notifications fetch karne ke liye
    @GetMapping
    public List<Notification> getNotifications(@RequestParam Long userId) {
        return service.getUserNotifications(userId);
    }

    
    @PutMapping("/{id}/read")
    public Notification readNotification(@PathVariable Long id) {
        return service.markAsRead(id);
    }

    @PostMapping
    public Notification createNotification(@RequestBody Notification notification) {
        return service.saveNotification(notification);
    }
   
}
>>>>>>> 1105205 (Added notification APIs)
