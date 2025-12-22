import { useMemo, useState } from "react";
import propertiesData from "./data/properties.json";
import TypeFilter from "./components/TypeFilter";

function App() {
  const allProperties = propertiesData.properties;
  const [selectedType, setSelectedType] = useState("Any");

  const visibleProperties = useMemo(() => {
    if (selectedType === "Any") return allProperties;
    return allProperties.filter((p) => p.type === selectedType);
  }, [allProperties, selectedType]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Estate App</h1>

      <TypeFilter value={selectedType} onChangeType={setSelectedType} />

      <p>
        Showing <strong>{visibleProperties.length}</strong> property/properties
      </p>

      {visibleProperties.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "12px",
          }}
        >
          <h2>{p.type}</h2>
          <p>
            <strong>Location:</strong> {p.location}
          </p>
          <p>
            <strong>Bedrooms:</strong> {p.bedrooms}
          </p>
          <p>
            <strong>Price:</strong> £{p.price.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
