function SavedList({ items, onRemove, onOpenListing, onBack }) {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Saved Listings</h1>

      <button onClick={onBack} style={{ marginBottom: "12px" }}>
        Back to Search
      </button>

      <p>
        Total saved: <strong>{items.length}</strong>
      </p>

      {items.length === 0 ? (
        <p>No saved listings yet.</p>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <h2>{item.type}</h2>
            <p>
              <strong>Location:</strong> {item.location}
            </p>
            <p>
              <strong>Bedrooms:</strong> {item.bedrooms}
            </p>
            <p>
              <strong>Price:</strong> £{item.price.toLocaleString()}
            </p>

            <button type="button" onClick={() => onRemove(item.id)}>
              Remove
            </button>

            <button
              type="button"
              onClick={() => onOpenListing(item)}
              style={{ marginLeft: "10px" }}
            >
              View Listing
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default SavedList;
