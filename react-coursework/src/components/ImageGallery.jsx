import { useState } from "react";

function ImageGallery({ images = [] }) {
  const safeImages = images.filter(Boolean);
  const [selected, setSelected] = useState(safeImages[0] || "");
  const [showAll, setShowAll] = useState(false);

  if (safeImages.length === 0) return null;

  return (
    <div style={{ marginTop: "12px" }}>
      <img
        src={`/${selected}`}
        alt="Main property"
        style={{
          width: "100%",
          maxWidth: "700px",
          height: "320px",
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
          marginTop: "10px",
        }}
      >
        {safeImages.map((img) => (
          <img
            key={img}
            src={`/${img}`}
            alt="Thumbnail"
            onClick={() => setSelected(img)}
            style={{
              width: "76px",
              height: "56px",
              objectFit: "cover",
              borderRadius: "10px",
              cursor: "pointer",
              border:
                selected === img
                  ? "3px solid #6ccf8e" // green highlight
                  : "1px solid rgba(0,0,0,0.25)",
            }}
          />
        ))}
      </div>

      <button style={{ marginTop: "10px" }} onClick={() => setShowAll(true)}>
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
            zIndex: 9999,
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
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <h3 style={{ margin: 0 }}>All images</h3>
              <button onClick={() => setShowAll(false)}>Close</button>
            </div>

            <div
              style={{
                marginTop: "12px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "10px",
              }}
            >
              {safeImages.map((img) => (
                <img
                  key={img}
                  src={`/${img}`}
                  alt="All"
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGallery;