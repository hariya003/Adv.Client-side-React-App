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
      // ignore
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

                return (
                  <article
                    key={property.id}
                    className="property-card"
                    draggable
                    onDragStart={(e) => onDragStartProperty(e, property)}
                  >
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
            <h2 className="about-title">About Property Point</h2>
            <p className="about-lead">
              Property Point is a client-side React application for browsing property
              listings, applying advanced filters, viewing details with an image gallery
              + tabs and managing saved favourites using both button clicks and drag & drop.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-card">
              <h3>What you can do</h3>
              <ul>
                <li>Filter by type, price range, bedrooms, postcode/location.</li>
                <li>
                  Filter by <strong>Date Added</strong> (After / Before to form “between”).
                </li>
                <li>Open property details with tabs (Description / Floor plan / Map).</li>
                <li>Browse a gallery (thumbnails + “View all images” modal).</li>
              </ul>
            </div>

            <div className="about-card">
              <h3>Saved / Favourites</h3>
              <ul>
                <li>Save using the <strong>❤️ Save</strong> button.</li>
                <li>Save using drag & drop (drag a card into the Saved panel).</li>
                <li>Remove using Delete or drag a saved item into the remove zone.</li>
                <li>Saved items are stored in localStorage (persist on refresh).</li>
              </ul>
            </div>

            <div className="about-card">
              <h3>Design + Security</h3>
              <ul>
                <li>Responsive layout switches below iPad landscape width.</li>
                <li>Consistent green theme, spacing, and cards for a “real site” feel.</li>
                <li>Map embed uses encodeURIComponent for safe URL building.</li>
                <li>Content Security Policy (CSP) restricts what can load.</li>
              </ul>
            </div>
          </div>

          <div className="about-cta">
            <div>
              <h3 className="about-cta-title">Quick guide</h3>
              <p className="about-cta-text">
                Use the filters to search, open “View Details”, then try saving a property
                using both methods (button + drag into Saved).
              </p>
            </div>

            <div className="about-tags">
              <span className="tag">React</span>
              <span className="tag">Filtering</span>
              <span className="tag">Tabs</span>
              <span className="tag">Gallery</span>
              <span className="tag">Drag & Drop</span>
              <span className="tag">Responsive</span>
              <span className="tag">CSP</span>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter onNavigate={navigateTo} />
    </div>
  );
}

export default App;