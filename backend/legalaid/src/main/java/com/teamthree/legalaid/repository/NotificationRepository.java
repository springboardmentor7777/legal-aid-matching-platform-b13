package com.teamthree.legalaid.repository;

<<<<<<< HEAD
public class NotificationRepository {

}
=======
import com.teamthree.legalaid.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserId(Long userId);
}
>>>>>>> 1105205 (Added notification APIs)
