function SavedList({
  items,
  onRemove,
  onClear,
  onView,
  onDragStartSaved,
  onDropAddToSaved,
  onDropRemoveSaved,
}) {
  return (
    <div
      className="saved-panel"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDropAddToSaved}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
        <h3 style={{ margin: 0 }}>Saved ({items.length})</h3>

        <button
          onClick={onClear}
          disabled={items.length === 0}
          style={{
            border: "1px solid rgba(15,61,46,0.2)",
            background: "#f3faf6",
            color: "#0f3d2e",
            padding: "8px 12px",
            borderRadius: "10px",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          Clear all
        </button>
      </div>

      <p className="saved-empty" style={{ marginTop: 8 }}>
        Drag a property card here to save.
      </p>

      {items.length === 0 ? (
        <p className="saved-empty">No saved properties</p>
      ) : (
        items.map((p) => (
          <div
            key={p.id}
            className="saved-item"
            draggable
            onDragStart={(e) => onDragStartSaved(e, p)}
          >
            <strong>{p.type}</strong>
            <div className="meta">{p.location}</div>

            <div className="saved-actions">
              <button onClick={() => onView(p)}>View</button>
              <button onClick={() => onRemove(p.id)}>Delete</button>
            </div>
          </div>
        ))
      )}

      {/* ✅ remove zone */}
      <div
        className="removeZone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDropRemoveSaved}
      >
        🗑️ Drag a saved item here to remove
      </div>
    </div>
  );
}

export default SavedList;