import StatusBadge from "./StatusBadge";

export default function ApplicationStatus({ application }) {
  if (!application) return null;

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <h3 className="card-title" style={{ marginBottom: 0 }}>
          Application Status
        </h3>
        <StatusBadge status={application.status} />
      </div>

      <div className="detail-row">
        <span className="detail-label">Applicant</span>
        <span className="detail-value">{application.applicant || "—"}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Application Type</span>
        <span className="detail-value">{application.type || "—"}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Passport Number</span>
        <span className="detail-value">{application.passport}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">VFS Reference</span>
        <span className="detail-value">{application.vfs_ref}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Permit Number</span>
        <span className="detail-value">{application.permit_number || "—"}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Valid Until</span>
        <span className="detail-value">{application.valid_until || "—"}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Submitted On</span>
        <span className="detail-value">{application.submitted || "—"}</span>
      </div>
    </div>
  );
}
