import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { ProfilePage } from "../../src/pages/Profile/ProfilePage";
import { getPosts, createPost } from "../../src/services/posts";
import { useNavigate } from "react-router-dom";

import userEvent from "@testing-library/user-event";

// Mocking the getPosts service
vi.mock("../../src/services/posts", () => {
  const getPostsMock = vi.fn();
  const createPostMock = vi.fn();
  return { getPosts: getPostsMock, createPost: createPostMock };
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

    const mockPosts = [{ _id: "12345", message: "Test Post 1" }];

    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });

    render(<ProfilePage />);

    const post = await screen.findByRole("article");
    expect(post.textContent).toEqual("Test Post 1");
  });

  test("It navigates to login if no token is present", async () => {
    render(<ProfilePage />);
    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test("createPost creates post and appears on feed", async () => {
  window.localStorage.setItem("token", "testToken");

  getPosts.mockResolvedValueOnce({ posts: [], token: "newToken" });

  getPosts.mockResolvedValueOnce({ posts: [{ _id: "1", message: "Hello World" }], token: "newToken" });

  createPost.mockResolvedValueOnce({ _id: "1", message: "Hello World" });

  render(<ProfilePage />);

  const input = screen.getByPlaceholderText("What's on your mind??");
  await userEvent.type(input, "Hello World");

  const submit = screen.getByRole("button", { name: /submit/i });
  await userEvent.click(submit);

  const post = await screen.findByText("Hello World");
  expect(post).toBeDefined();

})
});