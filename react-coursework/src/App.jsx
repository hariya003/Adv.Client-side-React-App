import { useMemo, useState } from "react";
import propertiesData from "./data/properties.json";
import TypeFilter from "./components/TypeFilter";
import ListingView from "./components/ListingView";
import SavedList from "./components/SavedList";

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
  const [showSaved, setShowSaved] = useState(false);

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

  if (showSaved) {
    return (
      <SavedList
        items={savedItems}
        onRemove={(id) =>
          setSavedItems(savedItems.filter((x) => x.id !== id))
        }
        onOpenListing={(p) => {
          setActiveListing(p);
          setShowSaved(false);
        }}
        onBack={() => setShowSaved(false)}
      />
    );
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
    <div style={{ padding: "20px" }}>
      <h1>Estate App</h1>

      <button onClick={() => setShowSaved(true)}>
        Saved ({savedItems.length})
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

      <p>Showing {visibleProperties.length} properties</p>

      {visibleProperties.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "12px" }}>
          <h2>{p.type}</h2>
          <p>£{p.price.toLocaleString()}</p>
          <p>{p.bedrooms} bedrooms</p>
          <p>{p.location}</p>

          <button onClick={() => setActiveListing(p)}>View</button>
          <button onClick={() => saveListing(p)} style={{ marginLeft: "10px" }}>
            ❤️ Save
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;