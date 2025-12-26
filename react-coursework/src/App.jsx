import { useMemo, useState } from "react";
import propertiesData from "./data/properties.json";
import TypeFilter from "./components/TypeFilter";
import ListingView from "./components/ListingView";
import SavedList from "./components/SavedList";

function App() {
  const allProperties = propertiesData.properties;

  const [selectedType, setSelectedType] = useState("Any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minBeds, setMinBeds] = useState("");
  const [maxBeds, setMaxBeds] = useState("");
  const [postcodeArea, setPostcodeArea] = useState("");

  const [activeListing, setActiveListing] = useState(null);

  const [savedItems, setSavedItems] = useState([]);
  const [isSavedViewOpen, setIsSavedViewOpen] = useState(false);

  const visibleProperties = useMemo(() => {
    const pc = postcodeArea.trim().toLowerCase();

    return allProperties.filter((property) => {
      const matchesType =
        selectedType === "Any" || property.type === selectedType;

      const minP = minPrice === "" ? null : Number(minPrice);
      const maxP = maxPrice === "" ? null : Number(maxPrice);
      const matchesMinPrice = minP === null || property.price >= minP;
      const matchesMaxPrice = maxP === null || property.price <= maxP;

      const minB = minBeds === "" ? null : Number(minBeds);
      const maxB = maxBeds === "" ? null : Number(maxBeds);
      const matchesMinBeds = minB === null || property.bedrooms >= minB;
      const matchesMaxBeds = maxB === null || property.bedrooms <= maxB;

      const matchesPostcode =
        pc === "" || property.location.toLowerCase().includes(pc);

      return (
        matchesType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMinBeds &&
        matchesMaxBeds &&
        matchesPostcode
      );
    });
  }, [
    allProperties,
    selectedType,
    minPrice,
    maxPrice,
    minBeds,
    maxBeds,
    postcodeArea,
  ]);

  function openSavedView() {
    setIsSavedViewOpen(true);
    setActiveListing(null);
  }

  function backToSearch() {
    setIsSavedViewOpen(false);
    setActiveListing(null);
  }

  function openListing(item) {
    setActiveListing(item);
    setIsSavedViewOpen(false);
  }

  function saveListing(item) {
    const alreadySaved = savedItems.some((x) => x.id === item.id);
    if (!alreadySaved) {
      setSavedItems([...savedItems, item]);
    }
  }

  function removeSaved(id) {
    setSavedItems(savedItems.filter((x) => x.id !== id));
  }

  function isSaved(id) {
    return savedItems.some((x) => x.id === id);
  }

  if (isSavedViewOpen) {
    return (
      <SavedList
        items={savedItems}
        onRemove={removeSaved}
        onOpenListing={openListing}
        onBack={backToSearch}
      />
    );
  }

  if (activeListing) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Estate App</h1>

        <button onClick={openSavedView} style={{ marginBottom: "12px" }}>
          Saved ({savedItems.length})
        </button>

        <ListingView listing={activeListing} onReturn={backToSearch} />

        <div style={{ marginTop: "12px" }}>
          <button
            type="button"
            onClick={() => saveListing(activeListing)}
            disabled={isSaved(activeListing.id)}
          >
            {isSaved(activeListing.id) ? "Saved ✅" : "❤️ Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Estate App</h1>

      <button onClick={openSavedView} style={{ marginBottom: "12px" }}>
        Saved ({savedItems.length})
      </button>

      <TypeFilter
        typeValue={selectedType}
        minPriceValue={minPrice}
        maxPriceValue={maxPrice}
        minBedsValue={minBeds}
        maxBedsValue={maxBeds}
        postcodeValue={postcodeArea}
        onTypeChange={setSelectedType}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onMinBedsChange={setMinBeds}
        onMaxBedsChange={setMaxBeds}
        onPostcodeChange={setPostcodeArea}
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

          <button type="button" onClick={() => setActiveListing(property)}>
            View Listing
          </button>

          <button
            type="button"
            onClick={() => saveListing(property)}
            style={{ marginLeft: "10px" }}
            disabled={isSaved(property.id)}
          >
            {isSaved(property.id) ? "Saved ✅" : "❤️ Save"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
