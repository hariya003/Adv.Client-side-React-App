import propertiesData from "./data/properties.json";

function App() {
  const propertyList = propertiesData.properties;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Available Properties</h1>

      {propertyList.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "12px"
          }}
        >
          <h2>{item.type}</h2>
          <p><strong>Location:</strong> {item.location}</p>
          <p><strong>Bedrooms:</strong> {item.bedrooms}</p>
          <p>
            <strong>Price:</strong> £{item.price.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
