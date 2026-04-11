-- Expand notification type constraint to support all event types
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notification_type_check;

ALTER TABLE notifications ADD CONSTRAINT notification_type_check
CHECK (type IN (
    'MATCH',
    'NEW_MATCH',
    'MATCH_ACCEPTED',
    'MATCH_REJECTED',
    'MESSAGE',
    'NEW_MESSAGE',
    'APPOINTMENT',
    'APPOINTMENT_UPDATED',
    'CASE_UPDATE',
    'SYSTEM'
));
