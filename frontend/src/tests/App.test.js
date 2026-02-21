import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import AddEvent from "../components/AddEvent";
import ViewEvent from "../components/ViewEvents";
import UpdateEvent from "../components/UpdateEvent";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
jest.mock("axios");

beforeEach(() => {
  jest.clearAllMocks();
  window.alert = jest.fn();
});

describe("Event Management", () => {
  // 1
  test("React_BuildUIComponents_renders AddEvent form fields", () => {
    render(<AddEvent />, { wrapper: MemoryRouter });
    expect(screen.getByPlaceholderText(/event title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/location/i)).toBeInTheDocument();
  });

 
  // 3
  test("React_APIIntegration_TestingAndAPIDocumentation_renders events in ViewEvent", async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ id: 1, title: "Music Fest", description: "Fun", date: "2025-09-01", location: "LA", contactNumber: "123", organizerName: "Jane" }]
    });
    render(<ViewEvent />, { wrapper: MemoryRouter });
    expect(await screen.findByText(/Music Fest/i)).toBeInTheDocument();
  });

  // 4
  test("React_APIIntegration_TestingAndAPIDocumentation_deletes event from ViewEvent", async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ id: 1, title: "Workshop", description: "Learn", date: "2025-09-02", location: "SF", contactNumber: "456", organizerName: "Bob" }]
    });
    axios.delete.mockResolvedValueOnce({});
    render(<ViewEvent />, { wrapper: MemoryRouter });
    fireEvent.click(await screen.findByText(/delete/i));
    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
    expect(window.alert).toHaveBeenCalledWith("Event deleted successfully!");
  });

  // 5
  test("React_APIIntegration_TestingAndAPIDocumentation_renders multiple events in ViewEvent", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, title: "Event A", description: "Desc A", date: "2025-10-01", location: "NY", contactNumber: "111", organizerName: "Alice" },
        { id: 2, title: "Event B", description: "Desc B", date: "2025-10-02", location: "LA", contactNumber: "222", organizerName: "Bob" }
      ]
    });
    render(<ViewEvent />, { wrapper: MemoryRouter });
    expect(await screen.findByText(/Event A/i)).toBeInTheDocument();
    expect(await screen.findByText(/Event B/i)).toBeInTheDocument();
  });

  // 6
  test("React_APIIntegration_TestingAndAPIDocumentation_loads UpdateEvent with existing event data", async () => {
    axios.get.mockResolvedValueOnce({
      data: { title: "Edit Me", description: "Old Desc", date: "2025-08-15", location: "Paris", contactNumber: "333", organizerName: "Charlie" }
    });
    render(
      <MemoryRouter initialEntries={["/update/1"]}>
        <Routes>
          <Route path="/update/:id" element={<UpdateEvent />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByDisplayValue(/Edit Me/i)).toBeInTheDocument();
  });

  describe("Home Component", () => {
    test("React_BuildUIComponents_renders heading, description, and links", () => {
      render(<Home />, { wrapper: MemoryRouter });
  
      expect(screen.getByText(/Neighborhood Event Hub/i)).toBeInTheDocument();
      expect(screen.getByText(/Welcome! Manage your local events easily./i)).toBeInTheDocument();
    });
  });
});