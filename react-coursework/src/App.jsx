import { useMemo, useState } from "react";
import propertiesData from "./data/properties.json";
import TypeFilter from "./components/TypeFilter";
import ListingView from "./components/ListingView";
import SavedList from "./components/SavedList";

function App() {
  const allProperties = propertiesData.properties;

  // ✅ react-widgets friendly state (NumberPicker => number|null, DatePicker => Date|null)
  const [selectedType, setSelectedType] = useState("Any");
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [minBeds, setMinBeds] = useState(null);
  const [maxBeds, setMaxBeds] = useState(null);
  const [postcodeArea, setPostcodeArea] = useState("");
  const [addedAfter, setAddedAfter] = useState(null);

  // ✅ “Search button” behaviour (apply filters only when clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    selectedType: "Any",
    minPrice: null,
    maxPrice: null,
    minBeds: null,
    maxBeds: null,
    postcodeArea: "",
    addedAfter: null,
  });

  const [activeListing, setActiveListing] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [isSavedViewOpen, setIsSavedViewOpen] = useState(false);

  const visibleProperties = useMemo(() => {
    const pc = appliedFilters.postcodeArea.trim().toLowerCase();

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

    return allProperties.filter((property) => {
      const matchesType =
        appliedFilters.selectedType === "Any" ||
        property.type === appliedFilters.selectedType;

      const matchesMinPrice =
        appliedFilters.minPrice == null || property.price >= appliedFilters.minPrice;

      const matchesMaxPrice =
        appliedFilters.maxPrice == null || property.price <= appliedFilters.maxPrice;

      const matchesMinBeds =
        appliedFilters.minBeds == null || property.bedrooms >= appliedFilters.minBeds;

      const matchesMaxBeds =
        appliedFilters.maxBeds == null || property.bedrooms <= appliedFilters.maxBeds;

      const matchesPostcode =
        pc === "" || property.location.toLowerCase().includes(pc);

      const matchesAddedAfter = (() => {
        if (!appliedFilters.addedAfter) return true;

        const mIndex = monthToIndex[property.added.month];
        if (mIndex === undefined) return true;

        const propDate = new Date(property.added.year, mIndex, property.added.day);
        return propDate >= appliedFilters.addedAfter;
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
  }, [allProperties, appliedFilters]);

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

  // ✅ Search button applies current UI state into appliedFilters
  function handleSearch() {
    setAppliedFilters({
      selectedType,
      minPrice,
      maxPrice,
      minBeds,
      maxBeds,
      postcodeArea,
      addedAfter,
    });
  }

  // ✅ Clear button resets UI state AND appliedFilters
  function handleClear() {
    setSelectedType("Any");
    setMinPrice(null);
    setMaxPrice(null);
    setMinBeds(null);
    setMaxBeds(null);
    setPostcodeArea("");
    setAddedAfter(null);

    setAppliedFilters({
      selectedType: "Any",
      minPrice: null,
      maxPrice: null,
      minBeds: null,
      maxBeds: null,
      postcodeArea: "",
      addedAfter: null,
    });
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
        onClick={handleClear}
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
        onSearch={handleSearch}
        onClear={handleClear}
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
