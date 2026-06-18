export default function StatusBadge({ status }) {
  const map = {
    Approved: { cls: "status-approved", label: "Approved" },
    "Under Process": { cls: "status-process", label: "Under Process" },
    Rejected: { cls: "status-rejected", label: "Rejected" },
  };

  const config = map[status] || { cls: "status-process", label: status };

  return (
    <span className={`status-badge ${config.cls}`}>
      <span className="status-dot" />
      {config.label}
    </span>
  );
}
