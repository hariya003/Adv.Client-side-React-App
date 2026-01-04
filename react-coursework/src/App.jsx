import { useMemo, useState, useEffect } from "react";
import propertiesData from "./data/properties.json";
import ListingView from "./components/ListingView";
import Navbar from "./components/Navbar";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import "./App.css";

function App() {
  const allProperties = propertiesData.properties;

  const [selectedType, setSelectedType] = useState("Any");
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [minBeds, setMinBeds] = useState(null);
  const [maxBeds, setMaxBeds] = useState(null);
  const [postcodeArea, setPostcodeArea] = useState("");
  const [addedAfter, setAddedAfter] = useState(null);
  const [addedBefore, setAddedBefore] = useState(null);

  const [filters, setFilters] = useState({});
  const [activeListing, setActiveListing] = useState(null);

  const [savedItems, setSavedItems] = useState(() => {
    try {
      const raw = window.localStorage.getItem("propertyPointSaved");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "propertyPointSaved",
        JSON.stringify(savedItems)
      );
    } catch {
    }
  }, [savedItems]);

  const monthMap = useMemo(
    () => ({
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
    }),
    []
  );

  function toDateOnly(d) {
    if (!d) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function getAddedDate(p) {
    const m = monthMap[p.added?.month];
    if (typeof m === "number") return new Date(p.added.year, m, p.added.day);
    return new Date(`${p.added?.month} ${p.added?.day}, ${p.added?.year}`);
  }

  const visibleProperties = useMemo(() => {
    const after = toDateOnly(filters.addedAfter);
    const before = toDateOnly(filters.addedBefore);

    return allProperties.filter((p) => {
      if (filters.type && filters.type !== "Any" && p.type !== filters.type)
        return false;

      if (filters.minPrice != null && p.price < filters.minPrice) return false;
      if (filters.maxPrice != null && p.price > filters.maxPrice) return false;
      if (filters.minBeds != null && p.bedrooms < filters.minBeds) return false;
      if (filters.maxBeds != null && p.bedrooms > filters.maxBeds) return false;

      if (filters.postcode) {
        const needle = String(filters.postcode).toLowerCase().trim();
        const hay = String(p.location).toLowerCase();
        if (needle && !hay.includes(needle)) return false;
      }

      if (after || before) {
        const added = toDateOnly(getAddedDate(p));
        if (after && added < after) return false;
        if (before && added > before) return false;
      }

      return true;
    });
  }, [allProperties, filters, monthMap]);

  function handleSearch() {
    setFilters({
      type: selectedType,
      minPrice,
      maxPrice,
      minBeds,
      maxBeds,
      postcode: postcodeArea,
      addedAfter,
      addedBefore,
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
    setAddedBefore(null);
    setFilters({});
  }

  function saveListing(property) {
    if (savedItems.some((p) => String(p.id) === String(property.id))) return;
    setSavedItems([...savedItems, property]);
  }

  function removeSaved(id) {
    setSavedItems(savedItems.filter((p) => String(p.id) !== String(id)));
  }

  function clearSaved() {
    setSavedItems([]);
  }

  function onDragStartProperty(e, property) {
    e.dataTransfer.setData("text/propertyId", String(property.id));
    e.dataTransfer.effectAllowed = "copy";
  }

  function onDropAddToSaved(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/propertyId");
    if (!id) return;

    const found = allProperties.find((p) => String(p.id) === String(id));
    if (found) saveListing(found);
  }

  function onDragStartSaved(e, property) {
    e.dataTransfer.setData("text/savedId", String(property.id));
    e.dataTransfer.effectAllowed = "move";
  }

  function onDropRemoveSaved(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/savedId");
    if (!id) return;
    removeSaved(id);
  }

  function navigateTo(sectionId) {
    if (activeListing) setActiveListing(null);

    requestAnimationFrame(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (activeListing) {
    return (
      <div className="app">
        <SiteHeader savedCount={savedItems.length} onNavigate={navigateTo} />

        <main className="app-shell">
          <ListingView
            listing={activeListing}
            onReturn={() => setActiveListing(null)}
          />
        </main>

        <SiteFooter onNavigate={navigateTo} />
      </div>
    );
  }

  return (
    <div className="app">
      <SiteHeader savedCount={savedItems.length} onNavigate={navigateTo} />

      <main className="app-shell">
        <section id="browse" className="browse-top">
          <h1 className="app-title">Property Point</h1>

          <Navbar
            typeValue={selectedType}
            minPriceValue={minPrice}
            maxPriceValue={maxPrice}
            minBedsValue={minBeds}
            maxBedsValue={maxBeds}
            postcodeValue={postcodeArea}
            addedAfterValue={addedAfter}
            addedBeforeValue={addedBefore}
            onTypeChange={setSelectedType}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            onMinBedsChange={setMinBeds}
            onMaxBedsChange={setMaxBeds}
            onPostcodeChange={setPostcodeArea}
            onAddedAfterChange={setAddedAfter}
            onAddedBeforeChange={setAddedBefore}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </section>

        <section className="main-content">
          <div className="property-list">
            <div className="section-head">
              <h2 className="section-title">Browse Properties</h2>
              <div className="section-meta">
                Showing {visibleProperties.length} results
              </div>
            </div>

            {visibleProperties.length === 0 ? (
              <p className="empty-state">
                No properties match your filters. Try clearing filters.
              </p>
            ) : (
              visibleProperties.map((property) => {
                const isSaved = savedItems.some(
                  (p) => String(p.id) === String(property.id)
                );
                const addedLabel = `${property.added.month} ${property.added.day}, ${property.added.year}`;
                const imgSrc = property.picture ? `/${property.picture}` : "";

                return (
                  <article
                    key={property.id}
                    className="property-card"
                    draggable
                    onDragStart={(e) => onDragStartProperty(e, property)}
                  >
                    <div className="property-card__media">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={`${property.type} thumbnail`}
                          className="property-card__img"
                          loading="lazy"
                        />
                      ) : (
                        <div className="property-card__imgFallback">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="property-card__body">
                      <div className="property-card__top">
                        <h3 className="property-card__title">{property.type}</h3>
                        <div className="property-card__price">
                          £{property.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="property-card__meta">
                        <span>
                          <strong>Bedrooms:</strong> {property.bedrooms}
                        </span>
                        <span>
                          <strong>Tenure:</strong> {property.tenure}
                        </span>
                        <span>
                          <strong>Added:</strong> {addedLabel}
                        </span>
                      </div>

                      <p className="property-card__location">{property.location}</p>

                      <p className="property-card__desc">
                        {String(property.description || "").substring(0, 120)}…
                      </p>

                      <div className="btnRow">
                        <button
                          className="btn-solid"
                          type="button"
                          onClick={() => setActiveListing(property)}
                        >
                          View Details
                        </button>

                        <button
                          className="btn-ghost"
                          type="button"
                          onClick={() => saveListing(property)}
                          disabled={isSaved}
                          title="You can also drag the card into Saved"
                        >
                          ❤️ {isSaved ? "Saved" : "Save"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          <aside
            id="saved"
            className="saved-panel"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropAddToSaved}
          >
            <div className="saved-head">
              <h3>Saved ({savedItems.length})</h3>
              <button
                className="link-btn"
                type="button"
                onClick={clearSaved}
                disabled={!savedItems.length}
              >
                Clear
              </button>
            </div>

            <p className="saved-hint">
              ✅ Add favourites by either pressing <strong>❤️ Save</strong> or{" "}
              <strong>dragging</strong> a property card into this panel.
            </p>

            {savedItems.length === 0 ? (
              <p className="saved-empty">No saved properties yet.</p>
            ) : (
              savedItems.map((p) => (
                <div
                  key={p.id}
                  className="saved-item"
                  draggable
                  onDragStart={(e) => onDragStartSaved(e, p)}
                >
                  <div className="saved-item__title">{p.type}</div>
                  <div className="saved-item__meta">{p.location}</div>

                  <div className="saved-actions">
                    <button type="button" onClick={() => setActiveListing(p)}>
                      View
                    </button>
                    <button type="button" onClick={() => removeSaved(p.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}

            <div
              className="remove-zone"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDropRemoveSaved(e);
              }}
            >
              🗑️ Drag a saved item here to remove
            </div>
          </aside>
        </section>

        <section id="about" className="about">
          <div className="about-head">
            <h2 className="about-title">Your property journey</h2>
            <p className="about-lead">
              Browse listings like a real estate portal, open details in one click,
              and build your shortlist using favourites.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-card">
              <h3>1) Discover</h3>
              <ul>
                <li>Scan through listings with a clean layout.</li>
                <li>See key info at a glance: beds, tenure, added date.</li>
                <li>Use postcode search to narrow quickly.</li>
              </ul>
            </div>

            <div className="about-card">
              <h3>2) Compare</h3>
              <ul>
                <li>Open <strong>View Details</strong> for deeper info.</li>
                <li>Switch tabs for description, floor plan and map.</li>
                <li>Browse images using the gallery + modal.</li>
              </ul>
            </div>

            <div className="about-card">
              <h3>3) Shortlist</h3>
              <ul>
                <li>Save favourites using ❤️ or drag & drop.</li>
                <li>Manage your shortlist in the Saved panel.</li>
                <li>Remove items with Delete or drag-to-bin.</li>
              </ul>
            </div>
          </div>

          <div className="about-cta">
            <div>
              <h3 className="about-cta-title">Tip</h3>
              <p className="about-cta-text">
                Try saving a property both ways (button + drag) to see the full interaction model.
              </p>
            </div>

            <div className="about-tags">
              <span className="tag">Shortlist</span>
              <span className="tag">Gallery</span>
              <span className="tag">Tabs</span>
              <span className="tag">Filters</span>
              <span className="tag">Drag & Drop</span>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter onNavigate={navigateTo} />
    </div>
  );
}

export default App;