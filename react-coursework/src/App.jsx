import { useMemo, useState } from "react";
import propertiesData from "./data/properties.json";
import TypeFilter from "./components/TypeFilter";

function App() {
  const allProperties = propertiesData.properties;

  const [selectedType, setSelectedType] = useState("Any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const visibleProperties = useMemo(() => {
    return allProperties.filter((property) => {
      const matchesType =
        selectedType === "Any" || property.type === selectedType;

      const min = minPrice === "" ? null : Number(minPrice);
      const max = maxPrice === "" ? null : Number(maxPrice);

      const matchesMin = min === null || property.price >= min;
      const matchesMax = max === null || property.price <= max;

      return matchesType && matchesMin && matchesMax;
    });
  }, [allProperties, selectedType, minPrice, maxPrice]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Estate App</h1>

      <TypeFilter
        typeValue={selectedType}
        minValue={minPrice}
        maxValue={maxPrice}
        onTypeChange={setSelectedType}
        onMinChange={setMinPrice}
        onMaxChange={setMaxPrice}
      />

      <p>
        Showing <strong>{visibleProperties.length}</strong> property/properties
      </p>

      {visibleProperties.map((property) => (
        <div
          key={property.id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "12px",
          }}
        >
          <h2>{property.type}</h2>
          <p>
            <strong>Location:</strong> {property.location}
          </p>
          <p>
            <strong>Bedrooms:</strong> {property.bedrooms}
          </p>
          <p>
            <strong>Price:</strong> £{property.price.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
