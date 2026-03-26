public class DeclineRequest {
    private String reason;          // must match key "reason" from frontend
    public String getReason() { return reason; }
    public void setReason(String r) { this.reason = r; }
}
