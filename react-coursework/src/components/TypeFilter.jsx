function TypeFilter({
  typeValue,
  minValue,
  maxValue,
  onTypeChange,
  onMinChange,
  onMaxChange,
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label>
        Filter by type:{" "}
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
          value={minValue}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder="e.g. 200000"
        />
      </label>

      <br /><br />

      <label>
        Max price:{" "}
        <input
          type="number"
          value={maxValue}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder="e.g. 800000"
        />
      </label>
    </div>
  );
}

export default TypeFilter;
