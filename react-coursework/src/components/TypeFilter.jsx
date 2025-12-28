import {
  DropdownList,
  NumberPicker,
  DatePicker,
  Input
} from "react-widgets";

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
  onSearch,
  onClear
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label>Property Type</label>
      <DropdownList
        data={["Any", "House", "Flat"]}
        value={typeValue}
        onChange={onTypeChange}
      />

      <br /><br />

      <label>Min Price</label>
      <NumberPicker value={minPriceValue} onChange={onMinPriceChange} />

      <br /><br />

      <label>Max Price</label>
      <NumberPicker value={maxPriceValue} onChange={onMaxPriceChange} />

      <br /><br />

      <label>Min Bedrooms</label>
      <NumberPicker value={minBedsValue} onChange={onMinBedsChange} />

      <br /><br />

      <label>Max Bedrooms</label>
      <NumberPicker value={maxBedsValue} onChange={onMaxBedsChange} />

      <br /><br />

      <label>Location / Postcode</label>
      <Input
        value={postcodeValue}
        onChange={(e) => onPostcodeChange(e.target.value)}
      />

      <br /><br />

      <label>Added After</label>
      <DatePicker
        value={addedAfterValue}
        onChange={onAddedAfterChange}
      />

      <br /><br />

      <button type="button" onClick={onSearch}>
        Search
      </button>

      <button
        type="button"
        onClick={onClear}
        style={{ marginLeft: "10px" }}
      >
        Clear
      </button>
    </div>
  );
}

export default TypeFilter;
