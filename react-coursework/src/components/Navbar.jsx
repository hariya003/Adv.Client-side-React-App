import { useMemo } from "react";
import "./Navbar.css";

function dateToInputValue(d) {
  if (!d) return "";
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function inputValueToDate(value) {
  if (!value) return null;
  const [y, m, d] = String(value).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export default function Navbar({
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

  // optional (if you want suggestions)
  postcodeAreas = [],
}) {
  const uniquePostcodes = useMemo(() => {
    const set = new Set(
      (postcodeAreas || []).map((p) => String(p || "").trim()).filter(Boolean)
    );
    return Array.from(set).sort();
  }, [postcodeAreas]);

  function handleSubmit(e) {
    e.preventDefault();

    // call parent search (App ignores argument if it doesn’t use it)
    onSearch?.({
      type: typeValue && typeValue !== "Any" ? typeValue : "",
      minPrice: minPriceValue ?? null,
      maxPrice: maxPriceValue ?? null,
      minBeds: minBedsValue ?? null,
      maxBeds: maxBedsValue ?? null,
      postcode: postcodeValue ? String(postcodeValue) : "",
      addedAfter: addedAfterValue ?? null,
      addedBefore: addedBeforeValue ?? null,
    });
  }

  function handleReset() {
    onClear?.();
  }

  return (
    <section className="widget card" aria-label="Search filters">
      <div className="widget__head">
        <h2 className="widget__title">Search Filters</h2>
        <p className="widget__sub">Use the filters below, then press Search.</p>
      </div>

      <form onSubmit={handleSubmit} className="widget__grid">
        <div className="field">
          <label className="field__label" htmlFor="type">
            Property type
          </label>

          <select
            id="type"
            className="field__control"
            value={typeValue ?? "Any"}
            onChange={(e) => onTypeChange?.(e.target.value)}
          >
            <option value="Any">Any</option>
            <option value="House">House</option>
            <option value="Flat">Flat</option>
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="minPrice">
            Min price (£)
          </label>
          <input
            id="minPrice"
            className="field__control"
            type="number"
            inputMode="numeric"
            value={minPriceValue ?? ""}
            onChange={(e) =>
              onMinPriceChange?.(e.target.value === "" ? null : Number(e.target.value))
            }
            placeholder="e.g. 200000"
            min="0"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="maxPrice">
            Max price (£)
          </label>
          <input
            id="maxPrice"
            className="field__control"
            type="number"
            inputMode="numeric"
            value={maxPriceValue ?? ""}
            onChange={(e) =>
              onMaxPriceChange?.(e.target.value === "" ? null : Number(e.target.value))
            }
            placeholder="e.g. 750000"
            min="0"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="minBeds">
            Min bedrooms
          </label>
          <input
            id="minBeds"
            className="field__control"
            type="number"
            inputMode="numeric"
            value={minBedsValue ?? ""}
            onChange={(e) =>
              onMinBedsChange?.(e.target.value === "" ? null : Number(e.target.value))
            }
            placeholder="e.g. 2"
            min="0"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="maxBeds">
            Max bedrooms
          </label>
          <input
            id="maxBeds"
            className="field__control"
            type="number"
            inputMode="numeric"
            value={maxBedsValue ?? ""}
            onChange={(e) =>
              onMaxBedsChange?.(e.target.value === "" ? null : Number(e.target.value))
            }
            placeholder="e.g. 4"
            min="0"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="postcode">
            Location / postcode
          </label>

          <input
            id="postcode"
            className="field__control"
            list="postcodeAreas"
            value={postcodeValue ?? ""}
            onChange={(e) => onPostcodeChange?.(e.target.value)}
            placeholder="e.g. BR5 / London / Manchester"
          />

          <datalist id="postcodeAreas">
            {uniquePostcodes.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>

        {/* ✅ Added After first (as you asked) */}
        <div className="field">
          <label className="field__label" htmlFor="addedAfter">
            Added after
          </label>
          <input
            id="addedAfter"
            className="field__control"
            type="date"
            value={dateToInputValue(addedAfterValue)}
            onChange={(e) => onAddedAfterChange?.(inputValueToDate(e.target.value))}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="addedBefore">
            Added before
          </label>
          <input
            id="addedBefore"
            className="field__control"
            type="date"
            value={dateToInputValue(addedBeforeValue)}
            onChange={(e) => onAddedBeforeChange?.(inputValueToDate(e.target.value))}
          />
        </div>

        <div className="field field--actions">
          <div className="btnRow">
            <button className="btn btn--primary" type="submit">
              Search
            </button>
            <button className="btn" type="button" onClick={handleReset}>
              Clear filters
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}