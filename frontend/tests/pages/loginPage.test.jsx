import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { useNavigate } from "react-router-dom";
import { login } from "../../src/services/authentication";

import { LoginPage } from "../../src/pages/Login/LoginPage";

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const locationMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  const useLocationMock = () => locationMock
  return { useNavigate: useNavigateMock, useLocation: useLocationMock };
});

// Mocking the login service
vi.mock("../../src/services/authentication", () => {
  const loginMock = vi.fn();
  return { login: loginMock };
});

// Reusable function for filling out login form
async function completeLoginForm() {
  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "Password1!");
  await user.click(submitButtonEl);
}

describe("Login Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("allows a user to login", async () => {
    render(<LoginPage />);

    await completeLoginForm();

    expect(login).toHaveBeenCalledWith("test@email.com", "Password1!");
  });

  test("navigates to /posts on successful login", async () => {
    render(<LoginPage />);

    login.mockResolvedValue("secrettoken123");
    const navigateMock = useNavigate();

    await completeLoginForm();

    expect(navigateMock).toHaveBeenCalledWith("/posts", { state: { message: "Login Successful" } });
  });

  test("navigates to /login on unsuccessful login", async () => {
    render(<LoginPage />);

    login.mockRejectedValue(new Error("Error logging in"));
    const navigateMock = useNavigate();

    await completeLoginForm();

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
});
