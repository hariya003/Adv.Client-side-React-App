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
          maxWidth: "750px",
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
          marginTop: "10px"
        }}
      >
        {safeImages.map((img) => (
          <img
            key={img}
            src={`/${img}`}
            alt="Thumbnail"
            onClick={() => setSelected(img)}
            style={{
              width: "90px",
              height: "70px",
              objectFit: "cover",
              borderRadius: "8px",
              cursor: "pointer",
              border:
                selected === img
                  ? "3px solid #00bcd4"
                  : "1px solid #aaa"
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
              <button onClick={() => setShowAll(false)}>Close</button>
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
              {safeImages.map((img) => (
                <img
                  key={img}
                  src={`/${img}`}
                  alt="All"
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
  );
}

export default ImageGallery;