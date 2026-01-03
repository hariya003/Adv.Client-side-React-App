import { useMemo, useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

function ListingView({ listing, onReturn }) {
  const allImages = useMemo(() => {
    if (listing?.images && listing.images.length > 0) return listing.images;
    if (listing?.picture) return [listing.picture];
    return [];
  }, [listing]);

  const [selectedImage, setSelectedImage] = useState(allImages[0] || "");
  const [showAll, setShowAll] = useState(false);

  const floorPlanFile =
    listing?.floorplan ||
    listing?.floorPlan ||
    listing?.floor_plan ||
    listing?.floorPlanImage ||
    "";

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    listing.location || ""
  )}&output=embed`;

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <button
        onClick={onReturn}
        style={{
          padding: "10px 14px",
          borderRadius: "10px",
          border: "1px solid rgba(15,61,46,0.25)",
          background: "#fff",
          cursor: "pointer",
          fontWeight: 800,
        }}
      >
        ← Back
      </button>

      <h2 style={{ marginTop: "14px" }}>
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
        <strong>Added:</strong> {listing.added?.month} {listing.added?.day},{" "}
        {listing.added?.year}
      </p>

      {selectedImage && (
        <div style={{ marginTop: "16px" }}>
          <img
            src={`/${selectedImage}`}
            alt="Main property"
            style={{
              width: "100%",
              maxWidth: "820px",
              height: "360px",
              objectFit: "cover",
              borderRadius: "12px",
              border: "1px solid rgba(0,0,0,0.15)",
              display: "block",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "12px",
              maxWidth: "820px",
            }}
          >
            {allImages.map((img, index) => (
              <img
                key={index}
                src={`/${img}`}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setSelectedImage(img)}
                style={{
                  width: "78px",
                  height: "58px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  cursor: "pointer",
                  border:
                    selectedImage === img
                      ? "3px solid #6ccf8e"
                      : "1px solid rgba(0,0,0,0.25)",
                }}
              />
            ))}
          </div>

          {allImages.length > 0 && (
            <button
              onClick={() => setShowAll(true)}
              style={{
                marginTop: "12px",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(15,61,46,0.25)",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              View all images
            </button>
          )}

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
                zIndex: 9999,
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  padding: "16px",
                  borderRadius: "14px",
                  width: "100%",
                  maxWidth: "980px",
                  maxHeight: "82vh",
                  overflow: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <h3 style={{ margin: 0 }}>All images</h3>
                  <button
                    onClick={() => setShowAll(false)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid rgba(0,0,0,0.15)",
                      background: "#fff1f1",
                      cursor: "pointer",
                      fontWeight: 900,
                    }}
                  >
                    Close
                  </button>
                </div>

                <div
                  style={{
                    marginTop: "12px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: "10px",
                  }}
                >
                  {allImages.map((img, i) => (
                    <img
                      key={i}
                      src={`/${img}`}
                      alt={`Image ${i + 1}`}
                      style={{
                        width: "100%",
                        height: "130px",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: "18px" }}>
        <Tabs>
          <TabList>
            <Tab>Description</Tab>
            <Tab>Floor plan</Tab>
            <Tab>Map</Tab>
          </TabList>

          <TabPanel>
            <p style={{ lineHeight: "1.6" }}>
              {String(listing.description || "").replace(/<br\s*\/?>/gi, " ")}
            </p>
          </TabPanel>

          <TabPanel>
            {floorPlanFile ? (
              <img
                src={`/${floorPlanFile}`}
                alt="Floor plan"
                style={{
                  width: "100%",
                  maxWidth: "820px",
                  maxHeight: "520px",
                  objectFit: "contain",
                  borderRadius: "12px",
                  border: "1px solid rgba(0,0,0,0.15)",
                  background: "#fff",
                  display: "block",
                }}
              />
            ) : (
              <p>No floor plan available.</p>
            )}
          </TabPanel>

          <TabPanel>
            <div
              style={{
                width: "100%",
                maxWidth: "900px",
                height: "340px",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.15)",
                background: "#fff",
              }}
            >
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