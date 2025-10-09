import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { useNavigate } from "react-router-dom";
import { signup } from "../../src/services/authentication";

import { SignupPage } from "../../src/pages/Signup/SignupPage";

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

// Mocking the signup service
vi.mock("../../src/services/authentication", () => {
  const signupMock = vi.fn();
  return { signup: signupMock };
});

vi.mock("../../src/services/users", () => {
  return {
    getUser: vi.fn().mockResolvedValue(null),
  };
});

// Reusable function for filling out signup form
async function completeSignupForm() {
  const user = userEvent.setup();

  const firstnameInputEl = screen.getByLabelText("Firstname:");
  const lastnameInputEl = screen.getByLabelText("Lastname:");
  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const confirmPasswordInputEl = screen.getByLabelText("Confirm Password:");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(firstnameInputEl, "John");
  await user.type(lastnameInputEl, "Doe");
  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "1234678A!");
  await user.type(confirmPasswordInputEl, "1234678A!");
  await user.click(submitButtonEl);
}

describe("Signup Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("allows a user to signup", async () => {
    render(<SignupPage />);

    await completeSignupForm();

    expect(signup).toHaveBeenCalledWith("John", "Doe", "test@email.com", "1234678A!");
  });

  test("navigates to /login on successful signup", async () => {
    render(<SignupPage />);
    const navigateMock = useNavigate();

    await completeSignupForm();

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test("navigates to /signup on unsuccessful signup", async () => {
    render(<SignupPage />);
    const navigateMock = useNavigate();

    signup.mockRejectedValue(new Error("Error signing up"));
    await completeSignupForm();

    expect(navigateMock).toHaveBeenCalledWith("/signup");
  });
});
