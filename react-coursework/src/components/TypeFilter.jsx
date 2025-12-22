function TypeFilter({ value, onChangeType }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label>
        Filter by type:{" "}
        <select value={value} onChange={(e) => onChangeType(e.target.value)}>
          <option value="Any">Any</option>
          <option value="House">House</option>
          <option value="Flat">Flat</option>
        </select>
      </label>
    </div>
  );
}

export default TypeFilter;
