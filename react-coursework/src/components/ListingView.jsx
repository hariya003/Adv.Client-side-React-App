import ImageGallery from "./ImageGallery";

function ListingView({ listing, onReturn }) {
  if (!listing) return null;

  const allImages =
    listing.images && listing.images.length > 0
      ? listing.images
      : listing.picture
      ? [listing.picture]
      : [];

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={onReturn} style={{ marginBottom: "12px" }}>
        ← Back to results
      </button>

      <h2>
        {listing.type} — £{listing.price.toLocaleString()}
      </h2>

      <p>
        <strong>Location:</strong> {listing.location}
      </p>

      <p>
        <strong>Bedrooms:</strong> {listing.bedrooms} |{" "}
        <strong>Tenure:</strong> {listing.tenure}
      </p>

      <p>
        <strong>Added:</strong>{" "}
        {listing.added.month} {listing.added.day},{" "}
        {listing.added.year}
      </p>

      <ImageGallery images={allImages} />

      <p style={{ marginTop: "16px", lineHeight: "1.6" }}>
        {String(listing.description || "").replace(/<br\s*\/?>/gi, " ")}
      </p>
    </div>
  );
}

export default ListingView;