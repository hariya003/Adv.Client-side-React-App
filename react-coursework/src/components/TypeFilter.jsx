function TypeFilter({
  typeValue,
  minPriceValue,
  maxPriceValue,
  minBedsValue,
  maxBedsValue,
  postcodeValue,
  addedAfterValue,
  onTypeChange,
  onMinPriceChange,
  onMaxPriceChange,
  onMinBedsChange,
  onMaxBedsChange,
  onPostcodeChange,
  onAddedAfterChange,
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label>
        Type:{" "}
        <select value={typeValue} onChange={(e) => onTypeChange(e.target.value)}>
          <option value="Any">Any</option>
          <option value="House">House</option>
          <option value="Flat">Flat</option>
        </select>
      </label>

      <br /><br />

      <label>
        Min price:{" "}
        <input
          type="number"
          value={minPriceValue}
          onChange={(e) => onMinPriceChange(e.target.value)}
          placeholder="e.g. 200000"
        />
      </label>

      <br /><br />

      <label>
        Max price:{" "}
        <input
          type="number"
          value={maxPriceValue}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          placeholder="e.g. 800000"
        />
      </label>

      <br /><br />

      <label>
        Min bedrooms:{" "}
        <input
          type="number"
          value={minBedsValue}
          onChange={(e) => onMinBedsChange(e.target.value)}
          placeholder="e.g. 2"
        />
      </label>

      <br /><br />

      <label>
        Max bedrooms:{" "}
        <input
          type="number"
          value={maxBedsValue}
          onChange={(e) => onMaxBedsChange(e.target.value)}
          placeholder="e.g. 4"
        />
      </label>

      <br /><br />

      <label>
        Postcode area:{" "}
        <input
          type="text"
          value={postcodeValue}
          onChange={(e) => onPostcodeChange(e.target.value)}
          placeholder="e.g. BR5"
        />
      </label>

      <br /><br />

      <label>
        Added after:{" "}
        <input
          type="date"
          value={addedAfterValue}
          onChange={(e) => onAddedAfterChange(e.target.value)}
        />
      </label>
    </div>
  );
}

export default TypeFilter;
