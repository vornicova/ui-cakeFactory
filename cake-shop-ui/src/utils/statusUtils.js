export const STATUS_CLASSES = {
    NEW: "status-new",
    IN_PROGRESS: "status-in_progress",
    READY: "status-ready",
    DONE: "status-done",
    CANCELLED: "status-cancelled",
};

export const statusClass = (status) =>
    `status-pill ${STATUS_CLASSES[status] || ""}`;