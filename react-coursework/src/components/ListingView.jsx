function ListingView({ listing, onReturn }) {
  if (!listing) return null;

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px" }}>
      <button onClick={onReturn} style={{ marginBottom: "12px" }}>
        Back to Results
      </button>

      <h2>{listing.type}</h2>
      <p>
        <strong>Location:</strong> {listing.location}
      </p>
      <p>
        <strong>Bedrooms:</strong> {listing.bedrooms}
      </p>
      <p>
        <strong>Price:</strong> £{listing.price.toLocaleString()}
      </p>
      <p>
        <strong>Tenure:</strong> {listing.tenure}
      </p>

      <h3>Description</h3>
      <p>{listing.description}</p>

      <h3>Image</h3>
      {listing.picture ? (
        <img
          src={listing.picture}
          alt={listing.type}
          style={{ width: "100%", maxWidth: "520px" }}
        />
      ) : (
        <p>No image available</p>
      )}
    </div>
  );
}

export default ListingView;
