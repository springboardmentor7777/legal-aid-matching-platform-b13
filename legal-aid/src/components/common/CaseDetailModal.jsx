import { useEffect, useState } from "react";
import API from "../../api/axios";

// ─────────────────────────────────────────────────────────────────────────────
// CaseDetailModal
// Shows all case details including documents (FIR + case docs) to lawyer/NGO/admin
// Documents are stored as base64 in the backend — we display and allow download
// ─────────────────────────────────────────────────────────────────────────────
const CaseDetailModal = ({ caseId, onClose }) => {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [previewDoc, setPreviewDoc] = useState(null); // { data, name }

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const role = currentUser.role;

  useEffect(() => {
    if (!caseId) return;
    setLoading(true);
    setActiveTab("overview");
    API.get(`/api/cases/${caseId}`)
      .then(res => setCaseData(res.data))
      .catch(() => setCaseData(null))
      .finally(() => setLoading(false));
  }, [caseId]);

  if (!caseId) return null;

  // ── Helpers ──────────────────────────────────────────────────────────────

  // Download a base64 document
  const handleDownload = (base64Data, fileName) => {
    if (!base64Data) return;
    try {
      const link = document.createElement("a");
      link.href = base64Data; // already has data:...;base64,... prefix
      link.download = fileName || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert("Could not download file.");
    }
  };

  // Detect mime type from base64 prefix
  const getMimeType = (base64) => {
    if (!base64) return "";
    if (base64.startsWith("data:")) return base64.split(";")[0].split(":")[1];
    return "";
  };

  const isImage = (base64, name) => {
    const mime = getMimeType(base64);
    if (mime.startsWith("image/")) return true;
    const ext = (name || "").split(".").pop().toLowerCase();
    return ["jpg","jpeg","png","gif","webp"].includes(ext);
  };

  const isPdf = (base64, name) => {
    const mime = getMimeType(base64);
    if (mime === "application/pdf") return true;
    return (name || "").toLowerCase().endsWith(".pdf");
  };

  const formatDate = (dt) =>
    dt ? new Date(dt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const statusColors = {
    SUBMITTED:         { bg: "#EFF6FF", color: "#1D4ED8" },
    ACTIVE:            { bg: "#FFF7ED", color: "#C2410C" },
    RESOLVED:          { bg: "#F0FDF4", color: "#166534" },
    PENDING:           { bg: "#FFFBEB", color: "#92400E" },
    CLOSED:            { bg: "#F1F5F9", color: "#475569" },
    UNDER_INVESTIGATION:{ bg: "#F5F3FF", color: "#7C3AED" },
  };

  // Count available documents
  const docCount = (caseData?.caseDocuments?.length || 0) + (caseData?.firDocument ? 1 : 0);

  const tabs = [
    { id: "overview",  label: "Overview",        icon: "📋" },
    { id: "details",   label: "Case Details",    icon: "📄" },
    { id: "documents", label: `Documents (${docCount})`, icon: "🗂️" },
    ...(caseData?.investigatingOfficer || caseData?.firNumber
      ? [{ id: "criminal", label: "Criminal Info", icon: "🚔" }]
      : []),
  ];

  return (
    <>
      {/* Document preview overlay (on top of modal) */}
      {previewDoc && (
        <div style={s.previewOverlay} onClick={() => setPreviewDoc(null)}>
          <div style={s.previewBox} onClick={e => e.stopPropagation()}>
            <div style={s.previewHeader}>
              <span style={s.previewName}>{previewDoc.name}</span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleDownload(previewDoc.data, previewDoc.name)}
                  style={s.previewDownloadBtn}
                >
                  ⬇ Download
                </button>
                <button onClick={() => setPreviewDoc(null)} style={s.previewCloseBtn}>✕</button>
              </div>
            </div>
            <div style={s.previewContent}>
              {isImage(previewDoc.data, previewDoc.name) ? (
                <img src={previewDoc.data} alt={previewDoc.name} style={s.previewImg} />
              ) : isPdf(previewDoc.data, previewDoc.name) ? (
                <iframe src={previewDoc.data} style={s.previewIframe} title={previewDoc.name} />
              ) : (
                <div style={s.previewFallback}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>📄</div>
                  <p style={{ color: "#64748B", marginBottom: "16px" }}>Preview not available for this file type.</p>
                  <button
                    onClick={() => handleDownload(previewDoc.data, previewDoc.name)}
                    style={s.downloadBtnLg}
                  >
                    ⬇ Download {previewDoc.name}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main modal */}
      <div style={s.overlay} onClick={onClose}>
        <div style={s.modal} onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div style={s.header}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>📁</span>
              <div>
                <h2 style={s.headerTitle}>Case Details</h2>
                {caseData && <p style={s.headerSub}>Case #{caseData.id || caseData.caseId}</p>}
              </div>
            </div>
            <button onClick={onClose} style={s.closeBtn}>✕</button>
          </div>

          {loading ? (
            <div style={s.center}>Loading case details...</div>
          ) : !caseData ? (
            <div style={s.center}>Case not found or access denied.</div>
          ) : (
            <>
              {/* Case title + status bar */}
              <div style={s.titleBar}>
                <h3 style={s.caseTitle}>{caseData.title || caseData.caseTitle || "Untitled Case"}</h3>
                <span style={{
                  ...s.statusBadge,
                  background: statusColors[caseData.status]?.bg || "#F1F5F9",
                  color: statusColors[caseData.status]?.color || "#475569",
                }}>
                  {caseData.status || "SUBMITTED"}
                </span>
              </div>

              {/* Tab nav */}
              <div style={s.tabNav}>
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{ ...s.tabBtn, ...(activeTab === tab.id ? s.tabBtnActive : {}) }}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div style={s.tabContent}>

                {/* ── OVERVIEW TAB ── */}
                {activeTab === "overview" && (
                  <div style={s.grid2}>
                    <InfoCard label="Category"       value={caseData.category}    icon="📂" />
                    <InfoCard label="Location"       value={caseData.location}    icon="📍" />
                    <InfoCard label="Client"         value={caseData.clientName || caseData.userName} icon="👤" />
                    <InfoCard label="Contact"        value={caseData.contactInfo} icon="📞" />
                    <InfoCard label="Filed Date"     value={formatDate(caseData.filingDate)} icon="📅" />
                    <InfoCard label="Current Status" value={caseData.currentStatus} icon="📊" />
                    {caseData.lawyerName && <InfoCard label="Assigned Lawyer" value={caseData.lawyerName} icon="⚖️" />}
                    {caseData.ngoName    && <InfoCard label="Assigned NGO"    value={caseData.ngoName}    icon="🤝" />}
                    {caseData.keywords && (
                      <div style={{ ...s.infoCard, gridColumn: "1 / -1" }}>
                        <span style={s.infoLabel}>Keywords</span>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                          {caseData.keywords.split(",").map((k, i) => (
                            <span key={i} style={s.keywordTag}>{k.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {caseData.description && (
                      <div style={{ ...s.infoCard, gridColumn: "1 / -1" }}>
                        <span style={s.infoLabel}>Description</span>
                        <p style={s.descText}>{caseData.description}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── CASE DETAILS TAB ── */}
                {activeTab === "details" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                    {/* Other party */}
                    {(caseData.otherPartyName || caseData.otherPartyLocation) && (
                      <Section title="Other Party" icon="👤">
                        <div style={s.grid2}>
                          <InfoCard label="Name"           value={caseData.otherPartyName}           icon="👤" />
                          <InfoCard label="Location"       value={caseData.otherPartyLocation}       icon="📍" />
                          <InfoCard label="Contact"        value={caseData.otherPartyContact}        icon="📞" />
                          <InfoCard label="Representative" value={caseData.otherPartyRepresentative} icon="⚖️" />
                        </div>
                      </Section>
                    )}

                    {/* Incident date */}
                    {caseData.dateTime && (
                      <Section title="Incident" icon="🗓">
                        <InfoCard label="Date & Time of Incident" value={
                          new Date(caseData.dateTime).toLocaleString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })
                        } icon="🗓" />
                      </Section>
                    )}

                    {/* Witnesses */}
                    {caseData.witnesses && (
                      <Section title="Witnesses" icon="👥">
                        <div style={s.textBox}>{caseData.witnesses}</div>
                      </Section>
                    )}

                    {/* No extra details */}
                    {!caseData.otherPartyName && !caseData.dateTime && !caseData.witnesses && (
                      <div style={s.emptySection}>No additional details provided.</div>
                    )}
                  </div>
                )}

                {/* ── DOCUMENTS TAB ── */}
                {activeTab === "documents" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                    {/* FIR Document */}
                    {(caseData.firNumber || caseData.firDocument) && (
                      <Section title="FIR Information" icon="🚔">
                        {caseData.firNumber && (
                          <div style={s.firNumberBox}>
                            <span style={s.firLabel}>FIR Number</span>
                            <span style={s.firNumber}>{caseData.firNumber}</span>
                          </div>
                        )}
                        {caseData.firDocument && (
                          <DocCard
                            name={caseData.firDocumentName || "FIR Document"}
                            data={caseData.firDocument}
                            onPreview={() => setPreviewDoc({ data: caseData.firDocument, name: caseData.firDocumentName || "FIR Document" })}
                            onDownload={() => handleDownload(caseData.firDocument, caseData.firDocumentName || "fir_document")}
                          />
                        )}
                      </Section>
                    )}

                    {/* Case Documents */}
                    {caseData.caseDocuments && caseData.caseDocuments.length > 0 ? (
                      <Section title={`Case Documents (${caseData.caseDocuments.length})`} icon="📄">
                        <div style={s.docList}>
                          {caseData.caseDocuments.map((docData, i) => {
                            const docName = caseData.caseDocumentNames?.[i] || `Document ${i + 1}`;
                            return (
                              <DocCard
                                key={i}
                                name={docName}
                                data={docData}
                                onPreview={() => setPreviewDoc({ data: docData, name: docName })}
                                onDownload={() => handleDownload(docData, docName)}
                              />
                            );
                          })}
                        </div>
                      </Section>
                    ) : !caseData.firDocument && (
                      <div style={s.emptySection}>
                        <div style={{ fontSize: "40px", marginBottom: "10px" }}>🗂️</div>
                        <p>No documents uploaded for this case.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── CRIMINAL TAB ── */}
                {activeTab === "criminal" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={s.criminalBanner}>
                      🚔 This is a criminal case — sensitive information below
                    </div>
                    <div style={s.grid2}>
                      <InfoCard label="FIR Number"          value={caseData.firNumber}          icon="📋" />
                      <InfoCard label="Investigating Officer" value={caseData.investigatingOfficer} icon="👮" />
                    </div>
                    {caseData.witnesses && (
                      <Section title="Witnesses" icon="👥">
                        <div style={s.textBox}>{caseData.witnesses}</div>
                      </Section>
                    )}
                  </div>
                )}

              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Section = ({ title, icon, children }) => (
  <div style={sc.section}>
    <div style={sc.sectionTitle}>
      <span>{icon}</span>
      <span>{title}</span>
    </div>
    {children}
  </div>
);

const InfoCard = ({ label, value, icon }) => {
  if (!value) return null;
  return (
    <div style={sc.infoCard}>
      <span style={sc.infoLabel}>{label}</span>
      <span style={sc.infoValue}>{icon} {value}</span>
    </div>
  );
};

const DocCard = ({ name, data, onPreview, onDownload }) => {
  const ext = (name || "").split(".").pop().toLowerCase();
  const isImg = ["jpg","jpeg","png","gif","webp"].includes(ext);
  const isPdf = ext === "pdf";
  const isDoc = ["doc","docx"].includes(ext);

  const fileIcon = isImg ? "🖼️" : isPdf ? "📕" : isDoc ? "📝" : "📄";
  const fileColor = isImg ? "#7C3AED" : isPdf ? "#DC2626" : isDoc ? "#1D4ED8" : "#64748B";
  const fileBg    = isImg ? "#F5F3FF" : isPdf ? "#FEF2F2" : isDoc ? "#EFF6FF" : "#F8FAFC";

  return (
    <div style={sc.docCard}>
      <div style={{ ...sc.docIcon, background: fileBg, color: fileColor }}>{fileIcon}</div>
      <div style={sc.docInfo}>
        <span style={sc.docName}>{name}</span>
        <span style={sc.docType}>{ext.toUpperCase()} file</span>
      </div>
      <div style={sc.docActions}>
        <button onClick={onPreview} style={sc.previewBtn} title="Preview">👁 Preview</button>
        <button onClick={onDownload} style={sc.downloadBtn} title="Download">⬇ Download</button>
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  overlay:       { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" },
  modal:         { background: "white", borderRadius: "16px", width: "100%", maxWidth: "680px", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", overflow: "hidden" },
  header:        { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #F1F5F9", flexShrink: 0 },
  headerTitle:   { fontSize: "17px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", margin: 0 },
  headerSub:     { fontSize: "11px", color: "#94A3B8", margin: "2px 0 0 0" },
  closeBtn:      { width: "32px", height: "32px", background: "#F1F5F9", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", color: "#64748B" },
  center:        { padding: "60px", textAlign: "center", color: "#94A3B8" },

  titleBar:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 24px 0", flexShrink: 0, gap: "12px" },
  caseTitle:     { fontSize: "18px", fontWeight: "700", color: "#0F1F3D", fontFamily: "'Georgia', serif", margin: 0 },
  statusBadge:   { fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "20px", whiteSpace: "nowrap", flexShrink: 0 },

  tabNav:        { display: "flex", gap: "4px", padding: "12px 24px 0", borderBottom: "1px solid #F1F5F9", flexShrink: 0, overflowX: "auto" },
  tabBtn:        { padding: "8px 14px", border: "none", background: "none", borderRadius: "8px 8px 0 0", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", color: "#64748B", fontWeight: "600", whiteSpace: "nowrap", borderBottom: "2px solid transparent" },
  tabBtnActive:  { color: "#0F1F3D", borderBottom: "2px solid #0F1F3D", background: "#F8FAFC" },
  tabContent:    { flex: 1, overflowY: "auto", padding: "20px 24px 24px" },

  grid2:         { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  infoCard:      { background: "#F8FAFC", borderRadius: "8px", padding: "10px 12px" },
  infoLabel:     { fontSize: "10px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "4px" },
  descText:      { fontSize: "13px", color: "#374151", lineHeight: "1.6", margin: 0 },
  keywordTag:    { fontSize: "11px", color: "#1D4ED8", background: "#EFF6FF", padding: "3px 8px", borderRadius: "6px", fontWeight: "600" },
  textBox:       { background: "#F8FAFC", borderRadius: "8px", padding: "12px", fontSize: "13px", color: "#374151", lineHeight: "1.6" },
  emptySection:  { textAlign: "center", padding: "40px", color: "#94A3B8", fontSize: "13px" },

  firNumberBox:  { display: "flex", alignItems: "center", gap: "12px", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: "8px", padding: "12px 16px", marginBottom: "12px" },
  firLabel:      { fontSize: "11px", fontWeight: "700", color: "#C2410C", textTransform: "uppercase" },
  firNumber:     { fontSize: "15px", fontWeight: "700", color: "#0F1F3D", fontFamily: "monospace" },
  docList:       { display: "flex", flexDirection: "column", gap: "10px" },

  criminalBanner:{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#DC2626", textAlign: "center" },

  // Preview overlay
  previewOverlay:{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" },
  previewBox:    { background: "white", borderRadius: "12px", width: "100%", maxWidth: "800px", maxHeight: "92vh", display: "flex", flexDirection: "column", overflow: "hidden" },
  previewHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #F1F5F9", flexShrink: 0 },
  previewName:   { fontSize: "14px", fontWeight: "600", color: "#0F1F3D" },
  previewDownloadBtn: { padding: "7px 14px", background: "#0F1F3D", color: "white", border: "none", borderRadius: "7px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", fontWeight: "600" },
  previewCloseBtn:    { width: "32px", height: "32px", background: "#F1F5F9", border: "none", borderRadius: "7px", cursor: "pointer", fontSize: "13px", color: "#64748B" },
  previewContent:{ flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC" },
  previewImg:    { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
  previewIframe: { width: "100%", height: "600px", border: "none" },
  previewFallback:{ textAlign: "center", padding: "40px" },
  downloadBtnLg: { padding: "12px 24px", background: "#0F1F3D", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer", fontFamily: "inherit", fontWeight: "700" },
};

const sc = {
  section:      { background: "white", border: "1px solid #F1F5F9", borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" },
  sectionTitle: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "700", color: "#0F1F3D", marginBottom: "4px" },
  infoCard:     { background: "#F8FAFC", borderRadius: "8px", padding: "10px 12px" },
  infoLabel:    { fontSize: "10px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "3px" },
  infoValue:    { fontSize: "13px", fontWeight: "600", color: "#0F1F3D" },

  docCard:      { display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" },
  docIcon:      { width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 },
  docInfo:      { flex: 1, minWidth: 0 },
  docName:      { fontSize: "13px", fontWeight: "600", color: "#0F1F3D", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  docType:      { fontSize: "11px", color: "#94A3B8", marginTop: "2px", display: "block" },
  docActions:   { display: "flex", gap: "8px", flexShrink: 0 },
  previewBtn:   { padding: "6px 12px", background: "white", border: "1.5px solid #E2E8F0", borderRadius: "7px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", fontWeight: "600", color: "#374151" },
  downloadBtn:  { padding: "6px 12px", background: "#0F1F3D", color: "white", border: "none", borderRadius: "7px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", fontWeight: "600" },
};

export default CaseDetailModal;