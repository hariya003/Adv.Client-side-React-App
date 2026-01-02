import { useMemo, useState } from "react";
import propertiesData from "./data/properties.json";
import TypeFilter from "./components/TypeFilter";
import ListingView from "./components/ListingView";

function App() {
  const allProperties = propertiesData.properties;

  const [selectedType, setSelectedType] = useState("Any");
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [minBeds, setMinBeds] = useState(null);
  const [maxBeds, setMaxBeds] = useState(null);
  const [postcodeArea, setPostcodeArea] = useState("");
  const [addedAfter, setAddedAfter] = useState(null);

  const [filters, setFilters] = useState({});
  const [activeListing, setActiveListing] = useState(null);
  const [savedItems, setSavedItems] = useState([]);

  
  const visibleProperties = useMemo(() => {
    const monthMap = {
      January: 0, February: 1, March: 2, April: 3,
      May: 4, June: 5, July: 6, August: 7,
      September: 8, October: 9, November: 10, December: 11
    };

    return allProperties.filter((p) => {
      if (filters.type && filters.type !== "Any" && p.type !== filters.type)
        return false;

      if (filters.minPrice != null && p.price < filters.minPrice)
        return false;

      if (filters.maxPrice != null && p.price > filters.maxPrice)
        return false;

      if (filters.minBeds != null && p.bedrooms < filters.minBeds)
        return false;

      if (filters.maxBeds != null && p.bedrooms > filters.maxBeds)
        return false;

      if (
        filters.postcode &&
        !p.location.toLowerCase().includes(filters.postcode.toLowerCase())
      )
        return false;

      if (filters.addedAfter) {
        const m = monthMap[p.added.month];
        const d = new Date(p.added.year, m, p.added.day);
        if (d < filters.addedAfter) return false;
      }

      return true;
    });
  }, [allProperties, filters]);

  function handleSearch() {
    setFilters({
      type: selectedType,
      minPrice,
      maxPrice,
      minBeds,
      maxBeds,
      postcode: postcodeArea,
      addedAfter
    });
  }

  function handleClear() {
    setSelectedType("Any");
    setMinPrice(null);
    setMaxPrice(null);
    setMinBeds(null);
    setMaxBeds(null);
    setPostcodeArea("");
    setAddedAfter(null);
    setFilters({});
  }

  function saveListing(p) {
    if (!savedItems.some((x) => x.id === p.id)) {
      setSavedItems([...savedItems, p]);
    }
  }

  function removeSaved(id) {
    setSavedItems(savedItems.filter((x) => x.id !== id));
  }

  if (activeListing) {
    return (
      <ListingView
        listing={activeListing}
        onReturn={() => setActiveListing(null)}
      />
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        gap: "16px",
        alignItems: "flex-start"
      }}
    >
      <div style={{ flex: 1 }}>
        <h1>Estate App</h1>

        <TypeFilter
          typeValue={selectedType}
          minPriceValue={minPrice}
          maxPriceValue={maxPrice}
          minBedsValue={minBeds}
          maxBedsValue={maxBeds}
          postcodeValue={postcodeArea}
          addedAfterValue={addedAfter}
          onTypeChange={setSelectedType}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onMinBedsChange={setMinBeds}
          onMaxBedsChange={setMaxBeds}
          onPostcodeChange={setPostcodeArea}
          onAddedAfterChange={setAddedAfter}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        <p>Showing {visibleProperties.length} properties</p>

        {visibleProperties.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ccc",
              padding: "14px",
              marginBottom: "14px",
              borderRadius: "6px"
            }}
          >
            <h2>{p.type}</h2>

            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              £{p.price.toLocaleString()}
            </p>

            <p>
              <strong>Bedrooms:</strong> {p.bedrooms} |{" "}
              <strong>Tenure:</strong> {p.tenure}
            </p>

            <p>
              <strong>Location:</strong> {p.location}
            </p>

            <p>
              <strong>Added:</strong> {p.added.month} {p.added.day},{" "}
              {p.added.year}
            </p>

            <p>
              {String(p.description)
                .replace(/<br\s*\/?>/gi, " ")
                .slice(0, 160)}
              ...
            </p>

            <button onClick={() => setActiveListing(p)}>
              View Details
            </button>

            <button
              onClick={() => saveListing(p)}
              style={{ marginLeft: "10px" }}
            >
              ❤️ Save
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          width: "280px",
          minWidth: "260px",
          border: "2px solid #ddd",
          padding: "14px",
          borderRadius: "8px",
          background: "#949090ff"
        }}
      >
        <h2>Saved ({savedItems.length})</h2>

        {savedItems.length === 0 ? (
          <p>No saved properties yet.</p>
        ) : (
          savedItems.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px"
              }}
            >
              <strong>{p.type}</strong>
              <div style={{ fontSize: "14px" }}>
                £{p.price.toLocaleString()}
              </div>

              <div style={{ marginTop: "8px" }}>
                <button onClick={() => setActiveListing(p)}>
                  View
                </button>

                <button
                  onClick={() => removeSaved(p.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;