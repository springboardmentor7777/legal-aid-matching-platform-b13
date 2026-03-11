package com.milestone.backend.dto;

import lombok.Data;

@Data
public class NotificationUpdateDto {

    private boolean isRead;

    public boolean getIsRead(){
        return this.isRead;
    }
    
}
