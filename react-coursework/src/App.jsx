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
  const [addedAfter, setAddedAfter] = useState(""); // YYYY-MM-DD from <input type="date" />

  const [activeListing, setActiveListing] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [isSavedViewOpen, setIsSavedViewOpen] = useState(false);

  const visibleProperties = useMemo(() => {
    const pc = postcodeArea.trim().toLowerCase();

    const monthToIndex = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const afterDate = addedAfter ? new Date(addedAfter) : null;

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

      const matchesAddedAfter = (() => {
        if (!afterDate) return true;

        const mIndex = monthToIndex[property.added.month];
        if (mIndex === undefined) return true; // fail-safe: if month text is unexpected, don't hide items

        const propDate = new Date(property.added.year, mIndex, property.added.day);
        return propDate >= afterDate;
      })();

      return (
        matchesType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMinBeds &&
        matchesMaxBeds &&
        matchesPostcode &&
        matchesAddedAfter
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
    addedAfter,
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
    if (!savedItems.some((x) => x.id === item.id)) {
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

      <button
        onClick={() => {
          setSelectedType("Any");
          setMinPrice("");
          setMaxPrice("");
          setMinBeds("");
          setMaxBeds("");
          setPostcodeArea("");
          setAddedAfter("");
        }}
        style={{ marginLeft: "10px", marginBottom: "12px" }}
      >
        Clear Filters
      </button>

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
      />

      <p>
        Showing <strong>{visibleProperties.length}</strong> property/properties
      </p>

      {visibleProperties.map((property) => (
        <div
          key={property.id}
          style={{
            border: "1px solid #ccc",
            padding: "14px",
            marginBottom: "14px",
          }}
        >
          <h2 style={{ marginBottom: "6px" }}>{property.type}</h2>

          <p style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 6px" }}>
            £{property.price.toLocaleString()}
          </p>

          <p style={{ margin: "0 0 6px" }}>
            <strong>Bedrooms:</strong> {property.bedrooms} {" | "}
            <strong>Tenure:</strong> {property.tenure}
          </p>

          <p style={{ margin: "0 0 6px" }}>
            <strong>Location:</strong> {property.location}
          </p>

          <p style={{ margin: "0 0 10px" }}>
            <strong>Added:</strong> {property.added.month} {property.added.day},{" "}
            {property.added.year}
          </p>

          <p style={{ margin: "0 0 12px" }}>
            {String(property.description)
              .replace(/<br\s*\/?>/gi, " ")
              .slice(0, 160)}
            ...
          </p>

          <button onClick={() => openListing(property)}>View Listing</button>

          <button
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
