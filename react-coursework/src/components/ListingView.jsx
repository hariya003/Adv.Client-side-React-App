import { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

function ListingView({ listing, onReturn }) {
  const allImages =
    listing.images && listing.images.length > 0
      ? listing.images
      : listing.picture
      ? [listing.picture]
      : [];

  const [selectedImage, setSelectedImage] = useState(allImages[0] || "");
  const [showAll, setShowAll] = useState(false);

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    listing.location
  )}&output=embed`;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={onReturn}>← Back</button>

      <h2 style={{ marginTop: "12px" }}>
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
        <strong>Added:</strong> {listing.added.month} {listing.added.day},{" "}
        {listing.added.year}
      </p>

      {selectedImage && (
        <div style={{ marginTop: "16px" }}>
          <img
            src={`/${selectedImage}`}
            alt="Main property"
            style={{
              width: "100%",
              maxWidth: "800px",
              height: "380px",
              objectFit: "cover",
              borderRadius: "10px",
              border: "1px solid #ccc",
              display: "block"
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "12px"
            }}
          >
            {allImages.map((img, index) => (
              <img
                key={index}
                src={`/${img}`}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setSelectedImage(img)}
                style={{
                  width: "90px",
                  height: "70px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border:
                    selectedImage === img
                      ? "3px solid #00bcd4"
                      : "1px solid #aaa"
                }}
              />
            ))}
          </div>

          <button style={{ marginTop: "12px" }} onClick={() => setShowAll(true)}>
            View all images
          </button>

          {showAll && (
            <div
              onClick={() => setShowAll(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.75)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                zIndex: 9999
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  padding: "16px",
                  borderRadius: "12px",
                  width: "100%",
                  maxWidth: "900px",
                  maxHeight: "80vh",
                  overflow: "auto"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <h3 style={{ margin: 0 }}>All images</h3>

                  <button
                    onClick={() => setShowAll(false)}
                    style={{
                      padding: "4px 10px",
                      fontSize: "14px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      background: "#080808ff",
                      cursor: "pointer"
                    }}
                  >
                    Close
                  </button>
                </div>

                <div
                  style={{
                    marginTop: "12px",
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: "10px"
                  }}
                >
                  {allImages.map((img, i) => (
                    <img
                      key={i}
                      src={`/${img}`}
                      alt={`Image ${i + 1}`}
                      style={{
                        width: "100%",
                        height: "140px",
                        objectFit: "cover",
                        borderRadius: "10px"
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <Tabs>
          <TabList>
            <Tab>Description</Tab>
            <Tab>Floor plan</Tab>
            <Tab>Google map</Tab>
          </TabList>

          <TabPanel>
            <p style={{ lineHeight: "1.7" }}>
              {String(listing.description || "").replace(/<br\s*\/?>/gi, " ")}
            </p>
          </TabPanel>

          <TabPanel>
            {listing.floorplan ? (
              <img
                src={`/${listing.floorplan}`}
                alt="Floor plan"
                style={{
                  width: "100%",
                  maxWidth: "800px",
                  border: "1px solid #ccc",
                  borderRadius: "8px"
                }}
              />
            ) : (
              <p>No floor plan available.</p>
            )}
          </TabPanel>

          <TabPanel>
            <div style={{ width: "100%", maxWidth: "850px", height: "360px" }}>
              <iframe
                title="Google map"
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default ListingView;