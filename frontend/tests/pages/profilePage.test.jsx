import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { ProfilePage } from "../../src/pages/Profile/ProfilePage";
import { createPost, getUserPosts } from "../../src/services/posts";
import { useNavigate } from "react-router-dom";

import userEvent from "@testing-library/user-event";
import { getMe } from "../../src/services/users";

// Mocking the getPosts service
vi.mock("../../src/services/posts", () => {
  const getUserPostsMock = vi.fn();
  const createPostMock = vi.fn();
  return { getUserPosts: getUserPostsMock, createPost: createPostMock };
});

vi.mock("../../src/services/users", () => {
  const getMeMock = vi.fn();
  return { getMe: getMeMock };
});

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

describe("Profile Page", () => {
  beforeEach(() => {
    window.localStorage.removeItem("token");
  });

  test("It displays posts from the backend", async () => {
    window.localStorage.setItem("token", "testToken");

    const mockUser = { id: "user123", firstname: "Test", lastname: "User", email: "test@example.com" }
    const mockPosts = [{ _id: "12345", message: "Test Post 1", date: "2025-10-10T11:37:04.662Z" }];
    
    getMe.mockResolvedValue(mockUser);
    getUserPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });

    render(<ProfilePage />);

    const post = await screen.findByText("Test Post 1 - 10/10/2025");
    expect(post).toBeDefined();

  });

  test("It navigates to login if no token is present", async () => {
    render(<ProfilePage />);
    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test("createPost creates post and appears on feed", async () => {
  window.localStorage.setItem("token", "testToken");

  getUserPosts.mockResolvedValueOnce({ posts: [], token: "newToken" });

  getUserPosts.mockResolvedValueOnce({ posts: [{ _id: "1", message: "Hello World", date: "2025-10-10T11:37:04.662Z" }], token: "newToken" });

  createPost.mockResolvedValueOnce({ _id: "1", message: "Hello World", date: "2025-10-10T11:37:04.662Z" });

  render(<ProfilePage />);

  const input = screen.getByPlaceholderText("What's on your mind??");
  await userEvent.type(input, "Hello World");

  const submit = screen.getByRole("button", { name: /submit/i });
  await userEvent.click(submit);

  const post = await screen.findByText("Hello World - 10/10/2025");
  expect(post).toBeDefined();

})
});
