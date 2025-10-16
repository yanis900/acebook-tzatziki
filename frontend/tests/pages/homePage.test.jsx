import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HomePage } from "../../src/pages/Home/HomePage";
import { vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("HomePage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renders the main heading", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const heading = screen.getByRole("heading", {
      name: /welcome to tzatziki!/i,
    });

    expect(heading).toBeDefined(); // Using Vitest's built-in matcher
  });

  test("renders the Sign Up button and navigates on click", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const signUpButton = screen.getByRole("button", { name: /sign up/i });
    expect(signUpButton).toBeDefined();

    fireEvent.click(signUpButton);
    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });

  test("renders the Log In button and navigates on click", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const loginButton = screen.getByRole("button", { name: /log in/i });
    expect(loginButton).toBeDefined();

    fireEvent.click(loginButton);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
