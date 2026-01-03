import { Combobox, DatePicker, DropdownList, NumberPicker } from "react-widgets";
import "./Navbar.css";

function Navbar({
  typeValue,
  minPriceValue,
  maxPriceValue,
  minBedsValue,
  maxBedsValue,
  postcodeValue,
  addedAfterValue,
  addedBeforeValue,
  onTypeChange,
  onMinPriceChange,
  onMaxPriceChange,
  onMinBedsChange,
  onMaxBedsChange,
  onPostcodeChange,
  onAddedAfterChange,
  onAddedBeforeChange,
  onSearch,
  onClear,
}) {
  const propertyTypes = ["Any", "House", "Flat"];

  return (
    <section className="filter-card" aria-label="Search filters">
      <div className="filter-head">
        <h2 className="filter-title">Search Filters</h2>
        <p className="filter-subtitle">Use the filters below, then press Search.</p>
      </div>

      <div className="filter-grid">
        <div className="filter-item">
          <label className="filter-label">Type</label>
          <DropdownList
            data={propertyTypes}
            value={typeValue}
            onChange={(val) => onTypeChange(val)}
          />
        </div>

        <div className="filter-item">
          <label className="filter-label">Min Price (£)</label>
          <NumberPicker
            value={minPriceValue}
            onChange={(val) => onMinPriceChange(val)}
            min={0}
            step={1000}
            placeholder="Min £"
          />
        </div>

        <div className="filter-item">
          <label className="filter-label">Max Price (£)</label>
          <NumberPicker
            value={maxPriceValue}
            onChange={(val) => onMaxPriceChange(val)}
            min={0}
            step={1000}
            placeholder="Max £"
          />
        </div>

        <div className="filter-item">
          <label className="filter-label">Min Beds</label>
          <NumberPicker
            value={minBedsValue}
            onChange={(val) => onMinBedsChange(val)}
            min={0}
            step={1}
            placeholder="Min"
          />
        </div>

        <div className="filter-item">
          <label className="filter-label">Max Beds</label>
          <NumberPicker
            value={maxBedsValue}
            onChange={(val) => onMaxBedsChange(val)}
            min={0}
            step={1}
            placeholder="Max"
          />
        </div>

        <div className="filter-item">
          <label className="filter-label">Postcode / Location</label>
          <Combobox
            data={[]}
            value={postcodeValue}
            onChange={(val) => onPostcodeChange(String(val ?? ""))}
            placeholder="e.g. BR6"
          />
        </div>

        <div className="filter-item">
          <label className="filter-label">Added After</label>
          <DatePicker
            value={addedAfterValue}
            onChange={(val) => onAddedAfterChange(val)}
            placeholder="Pick a date"
          />
        </div>

        <div className="filter-item">
          <label className="filter-label">Added Before</label>
          <DatePicker
            value={addedBeforeValue}
            onChange={(val) => onAddedBeforeChange(val)}
            placeholder="Pick a date"
          />
        </div>
      </div>

      <div className="filter-actions">
        <button className="btn btn-search" type="button" onClick={onSearch}>
          Search
        </button>
        <button className="btn btn-clear" type="button" onClick={onClear}>
          Clear
        </button>
      </div>
    </section>
  );
}

export default Navbar;