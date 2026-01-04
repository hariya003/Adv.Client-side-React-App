import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import propertiesData from "../data/properties.json";

function makeDataTransfer() {
  const store = {};
  return {
    setData: (type, val) => {
      store[type] = String(val);
    },
    getData: (type) => store[type] || "",
    clearData: (type) => {
      if (type) delete store[type];
      else Object.keys(store).forEach((k) => delete store[k]);
    },
    dropEffect: "move",
    effectAllowed: "all",
    files: [],
    items: [],
    types: [],
  };
}

beforeEach(() => {
  window.localStorage.clear();
});

test("renders page and shows correct initial results count", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { level: 1, name: /Property Point/i })
  ).toBeInTheDocument();

  const total = propertiesData.properties.length;

  expect(
    screen.getByText(new RegExp(`Showing\\s+${total}\\s+results`, "i"))
  ).toBeInTheDocument();
});

test("saving via ❤️ Save button adds one item to Saved panel", async () => {
  render(<App />);
  const user = userEvent.setup();

  const saveButtons = screen.getAllByRole("button").filter((b) =>
    /save/i.test(b.textContent || "")
  );

  const firstSave = saveButtons.find((b) => (b.textContent || "").includes("❤️"));
  expect(firstSave).toBeTruthy();

  await user.click(firstSave);

  expect(screen.getByRole("heading", { name: /Saved\s*\(1\)/i })).toBeInTheDocument();
});

test("dragging a property card into Saved panel adds it (drag & drop)", () => {
  render(<App />);

  const firstCard = document.querySelector(".property-card");
  expect(firstCard).toBeTruthy();

  const savedPanel = document.querySelector(".saved-panel");
  expect(savedPanel).toBeTruthy();

  const dt = makeDataTransfer();

  fireEvent.dragStart(firstCard, { dataTransfer: dt });
  fireEvent.dragOver(savedPanel, { dataTransfer: dt });
  fireEvent.drop(savedPanel, { dataTransfer: dt });

  expect(screen.getByRole("heading", { name: /Saved\s*\(1\)/i })).toBeInTheDocument();
});

test("dragging a saved item into the remove zone removes it", async () => {
  render(<App />);
  const user = userEvent.setup();

  const firstSave = screen
    .getAllByRole("button")
    .find((b) => (b.textContent || "").includes("❤️"));
  await user.click(firstSave);

  expect(screen.getByRole("heading", { name: /Saved\s*\(1\)/i })).toBeInTheDocument();

  const savedItem = document.querySelector(".saved-item");
  expect(savedItem).toBeTruthy();

  const removeZone = document.querySelector(".remove-zone");
  expect(removeZone).toBeTruthy();

  const dt = makeDataTransfer();

  fireEvent.dragStart(savedItem, { dataTransfer: dt });
  fireEvent.dragOver(removeZone, { dataTransfer: dt });
  fireEvent.drop(removeZone, { dataTransfer: dt });

  expect(screen.getByRole("heading", { name: /Saved\s*\(0\)/i })).toBeInTheDocument();
});

test('View Details opens listing page and "← Back" returns to results', async () => {
  render(<App />);
  const user = userEvent.setup();

  const viewButtons = screen.getAllByRole("button", { name: /View Details/i });
  expect(viewButtons.length).toBeGreaterThan(0);

  await user.click(viewButtons[0]);

  const backBtn = screen.getByRole("button", { name: /Back/i });
  expect(backBtn).toBeInTheDocument();

  await user.click(backBtn);

  expect(
    screen.getByRole("heading", { name: /Browse Properties/i })
  ).toBeInTheDocument();
});