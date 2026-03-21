import { useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const categories = ["Property", "Criminal", "Family", "Civil", "Labour", "Consumer", "Human Rights", "Other"];

const SubmitCase = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    caseTitle: "",
    description: "",
    category: "",
    keywords: "",
    dateTime: "",
    location: "",
    contactInfo: "",
    otherPartyName: "",
    otherPartyLocation: "",
    otherPartyContact: "",
    otherPartyRepresentative: "",
    investigatingOfficer: "",
    witnesses: "",
    currentStatus: "",
    firNumber: "",
    firDocument: null,
    firDocumentName: "",
    caseDocuments: [],
    caseDocumentNames: [],
  });

  const isCriminal = form.category === "criminal";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e, field, nameField) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(prev => ({ ...prev, [field]: reader.result, [nameField]: file.name }));
    reader.readAsDataURL(file);
  };

  const handleMultipleFiles = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve({ data: reader.result, name: file.name });
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then(results => {
      setForm(prev => ({
        ...prev,
        caseDocuments: results.map(r => r.data),
        caseDocumentNames: results.map(r => r.name),
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/api/cases", form);
      toast.success("Case submitted successfully!");
      navigate("/my-cases");
    } catch (err) {
      toast.error("Failed to submit case. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const SectionTitle = ({ icon, title, badge }) => (
    <div style={styles.sectionTitle}>
      <span style={styles.sectionIcon}>{icon}</span>
      <h2 style={styles.sectionText}>{title}</h2>
      {badge && <span style={styles.criminalBadge}>{badge}</span>}
    </div>
  );

  return (
    <Layout>
      <div style={styles.header}>
        <h1 style={styles.title}>Submit Legal Case</h1>
        <p style={styles.subtitle}>
          Fill in all the details below. Fields marked with <span style={styles.req}>*</span> are required.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={styles.formBody}>

          {/* ── SECTION 1: Case Information ── */}
          <div style={styles.card}>
            <SectionTitle icon="📋" title="Case Information" />

            <div style={styles.field}>
              <label style={styles.label}>Case Title <span style={styles.req}>*</span></label>
              <input name="caseTitle" value={form.caseTitle} onChange={handleChange}
                placeholder="e.g. Property dispute with neighbour" required style={styles.input}
                onFocus={e => e.target.style.borderColor = "#C9A84C"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Description — What Happened <span style={styles.req}>*</span></label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Describe the incident in detail. Include what happened, when, where and who was involved..."
                required rows={5} style={{ ...styles.input, resize: "vertical" }}
                onFocus={e => e.target.style.borderColor = "#C9A84C"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Case Category <span style={styles.req}>*</span></label>
                <select name="category" value={form.category} onChange={handleChange}
                  required style={styles.input}>
                  <option value="">Select category...</option>
                  {categories.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                </select>

              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Related Keywords / Sub-categories <span style={styles.req}>*</span></label>
                <input name="keywords" value={form.keywords} onChange={handleChange}
                  placeholder="e.g. land encroachment, boundary dispute" required style={styles.input}
                  onFocus={e => e.target.style.borderColor = "#C9A84C"}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
              </div>
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Date & Time of Incident <span style={styles.req}>*</span></label>
                <input name="dateTime" type="datetime-local" value={form.dateTime} onChange={handleChange}
                  required style={styles.input}
                  onFocus={e => e.target.style.borderColor = "#C9A84C"}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Case Location <span style={styles.req}>*</span></label>
                <input name="location" value={form.location} onChange={handleChange}
                  placeholder="e.g. Hyderabad, Telangana" required style={styles.input}
                  onFocus={e => e.target.style.borderColor = "#C9A84C"}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Your Contact Info <span style={styles.req}>*</span></label>
              <input name="contactInfo" value={form.contactInfo} onChange={handleChange}
                placeholder="Phone number or alternate email" required style={styles.input}
                onFocus={e => e.target.style.borderColor = "#C9A84C"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
            </div>
          </div>

          {/* ── SECTION 2: Other Party ── */}
          <div style={styles.card}>
            <SectionTitle icon="👤" title="Other Party Details" />

            <div style={styles.row}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Other Party Name <span style={styles.req}>*</span></label>
                <input name="otherPartyName" value={form.otherPartyName} onChange={handleChange}
                  placeholder="Full name of the other party" required style={styles.input}
                  onFocus={e => e.target.style.borderColor = "#C9A84C"}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Other Party Location</label>
                <input name="otherPartyLocation" value={form.otherPartyLocation} onChange={handleChange}
                  placeholder="City, State" style={styles.input}
                  onFocus={e => e.target.style.borderColor = "#C9A84C"}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
              </div>
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Other Party Contact Info</label>
                <input name="otherPartyContact" value={form.otherPartyContact} onChange={handleChange}
                  placeholder="Phone or email if known" style={styles.input}
                  onFocus={e => e.target.style.borderColor = "#C9A84C"}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Other Party Representative</label>
                <input name="otherPartyRepresentative" value={form.otherPartyRepresentative} onChange={handleChange}
                  placeholder="Lawyer or representative name if any" style={styles.input}
                  onFocus={e => e.target.style.borderColor = "#C9A84C"}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
              </div>
            </div>
          </div>

          {/* ── SECTION 3: Criminal Details (only if Criminal selected) ── */}
          {isCriminal && (
            <div style={{ ...styles.card, border: "2px solid #FCA5A5", background: "#FFFBFB" }}>
              <SectionTitle icon="🚔" title="Criminal Case Details" badge="Criminal Only" />
              <p style={styles.sectionNote}>
                This section is required for criminal cases. Please fill in as much detail as possible.
              </p>

              <div style={styles.row}>
                <div style={{ ...styles.field, flex: 1 }}>
                  <label style={styles.label}>Investigating Officer <span style={styles.req}>*</span></label>
                  <input name="investigatingOfficer" value={form.investigatingOfficer} onChange={handleChange}
                    placeholder="Name and badge number of investigating officer" style={styles.input}
                    onFocus={e => e.target.style.borderColor = "#EF4444"}
                    onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                </div>
                <div style={{ ...styles.field, flex: 1 }}>
                  <label style={styles.label}>Witnesses</label>
                  <input name="witnesses" value={form.witnesses} onChange={handleChange}
                    placeholder="Names of witnesses if any (comma separated)" style={styles.input}
                    onFocus={e => e.target.style.borderColor = "#EF4444"}
                    onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                </div>
              </div>
            </div>
          )}

          {/* ── SECTION 4: Current Status ── */}
          <div style={styles.card}>
            <SectionTitle icon="📊" title="Current Status" />

            <div style={styles.field}>
              <label style={styles.label}>Current Status of the Case <span style={styles.req}>*</span></label>
              <select name="currentStatus" value={form.currentStatus} onChange={handleChange}
                required style={styles.input}>
                <option value="">Select current status...</option>
                <option value="not_filed">Not Filed Yet</option>
                <option value="fir_filed">FIR Filed</option>
                <option value="under_investigation">Under Investigation</option>
                <option value="in_court">In Court</option>
                <option value="waiting_hearing">Waiting for Hearing</option>
                <option value="resolved">Resolved / Settled</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* ── SECTION 5: Evidence ── */}
          <div style={styles.card}>
            <SectionTitle icon="🗂️" title="Evidence & Documents" />

            <div style={styles.field}>
              <label style={styles.label}>
                FIR Number {isCriminal && <span style={styles.req}>*</span>}
              </label>
              <input name="firNumber" value={form.firNumber} onChange={handleChange}
                placeholder="e.g. FIR/2024/HYD/001"
                required={isCriminal} style={styles.input}
                onFocus={e => e.target.style.borderColor = "#C9A84C"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Upload FIR Document {isCriminal && <span style={styles.req}>*</span>}
              </label>
              <div style={styles.uploadBox}
                onClick={() => document.getElementById("firUpload").click()}>
                <input id="firUpload" type="file" accept=".pdf,.jpg,.jpeg,.png"
                  onChange={e => handleFileChange(e, "firDocument", "firDocumentName")}
                  style={{ display: "none" }} />
                {form.firDocumentName ? (
                  <div style={styles.uploadedFile}>
                    <span style={styles.fileIcon}>📄</span>
                    <span style={styles.fileName}>{form.firDocumentName}</span>
                    <span style={styles.fileCheck}>✅</span>
                  </div>
                ) : (
                  <div style={styles.uploadPlaceholder}>
                    <span style={styles.uploadIcon}>⬆️</span>
                    <span style={styles.uploadText}>Click to upload FIR</span>
                    <span style={styles.uploadHint}>PDF, JPG, PNG supported</span>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Case Documents <span style={styles.req}>*</span></label>
              <p style={styles.fieldHint}>Upload charge sheets, legal notices, agreements or any supporting documents</p>
              <div style={styles.uploadBox}
                onClick={() => document.getElementById("docsUpload").click()}>
                <input id="docsUpload" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  multiple onChange={handleMultipleFiles} style={{ display: "none" }} />
                {form.caseDocumentNames.length > 0 ? (
                  <div style={styles.uploadedFiles}>
                    {form.caseDocumentNames.map((name, i) => (
                      <div key={i} style={styles.uploadedFile}>
                        <span style={styles.fileIcon}>📄</span>
                        <span style={styles.fileName}>{name}</span>
                        <span style={styles.fileCheck}>✅</span>
                      </div>
                    ))}
                    <span style={styles.addMore}
                      onClick={e => { e.stopPropagation(); document.getElementById("docsUpload").click(); }}>
                      + Add more files
                    </span>
                  </div>
                ) : (
                  <div style={styles.uploadPlaceholder}>
                    <span style={styles.uploadIcon}>📁</span>
                    <span style={styles.uploadText}>Click to upload documents</span>
                    <span style={styles.uploadHint}>PDF, Word, JPG, PNG — multiple files allowed</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <div style={styles.formFooter}>
            <button type="button" onClick={() => navigate(-1)} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Submitting..." : "Submit Case →"}
            </button>
          </div>

        </div>
      </form>
    </Layout>
  );
};

const styles = {
  header: { marginBottom: "28px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", marginBottom: "6px" },
  subtitle: { fontSize: "14px", color: "#64748B" },
  req: { color: "#EF4444" },
  formBody: { display: "flex", flexDirection: "column", gap: "20px" },
  card: { background: "white", borderRadius: "12px", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  sectionTitle: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "12px", borderBottom: "2px solid #F1F5F9" },
  sectionIcon: { fontSize: "20px" },
  sectionText: { fontSize: "16px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif" },
  criminalBadge: { fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", background: "#FEE2E2", color: "#DC2626", marginLeft: "auto" },
  sectionNote: { fontSize: "13px", color: "#DC2626", marginTop: "-12px", marginBottom: "16px", fontWeight: "500" },
  criminalHint: { fontSize: "12px", color: "#DC2626", marginTop: "6px", fontWeight: "500" },
  field: { marginBottom: "18px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" },
  fieldHint: { fontSize: "12px", color: "#94A3B8", marginBottom: "8px", marginTop: "-4px" },
  input: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #E2E8F0",
    borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s", fontFamily: "inherit", color: "#1E293B"
  },
  row: { display: "flex", gap: "16px" },
  uploadBox: { border: "2px dashed #E2E8F0", borderRadius: "10px", padding: "20px", cursor: "pointer", background: "#F8FAFC" },
  uploadPlaceholder: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" },
  uploadIcon: { fontSize: "28px" },
  uploadText: { fontSize: "14px", fontWeight: "600", color: "#374151" },
  uploadHint: { fontSize: "11px", color: "#94A3B8" },
  uploadedFiles: { display: "flex", flexDirection: "column", gap: "8px" },
  uploadedFile: { display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", background: "#F0FDF4", borderRadius: "8px" },
  fileIcon: { fontSize: "16px" },
  fileName: { fontSize: "13px", color: "#166534", fontWeight: "500", flex: 1 },
  fileCheck: { fontSize: "14px" },
  addMore: { fontSize: "12px", color: "#C9A84C", fontWeight: "600", cursor: "pointer", textAlign: "center", padding: "4px" },
  formFooter: { display: "flex", justifyContent: "flex-end", gap: "12px" },
  cancelBtn: { padding: "12px 24px", border: "1.5px solid #E2E8F0", background: "white", borderRadius: "8px", fontSize: "14px", cursor: "pointer", fontFamily: "inherit", color: "#374151" },
  submitBtn: { padding: "12px 32px", background: "linear-gradient(135deg, #0F1F3D, #1a3560)", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" },
};

export default SubmitCase;