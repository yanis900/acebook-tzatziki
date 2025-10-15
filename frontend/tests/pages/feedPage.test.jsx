import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { FeedPage } from "../../src/pages/Feed/FeedPage";
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

describe("Feed Page", () => {
  beforeEach(() => {
    window.localStorage.removeItem("token");
  });

  test("It displays posts from the backend", async () => {
    window.localStorage.setItem("token", "testToken");

    const mockPosts = [{ _id: "12345", message: "Test Post 1", date: "2025-10-10T11:37:04.662Z"}];

    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });

    render(<FeedPage />);

    const post = await screen.findByText(/Test Post 1/, { exact: false });
    expect(post).toBeDefined()
  });

  test("It navigates to login if no token is present", async () => {
    render(<FeedPage />);
    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test.skip("createPost creates post and appears on feed", async () => {
  window.localStorage.setItem("token", "testToken");

  getPosts.mockResolvedValueOnce({ posts: [], token: "newToken" });

  getPosts.mockResolvedValueOnce({ posts: [{ _id: "1", message: "Hello World", date: "2025-10-10T11:37:04.662Z" }], token: "newToken" });

  createPost.mockResolvedValueOnce({ _id: "1", message: "Hello World", date: "2025-10-10T11:37:04.662Z" });

  render(<FeedPage />);

  const input = screen.getByPlaceholderText("What's on your mind??");
  await userEvent.type(input, "Hello World");

  const submit = screen.getByRole("button", { name: /submit/i });
  await userEvent.click(submit);

  const post = await screen.findByText(/Hello World/, { exact: false });
  expect(post).toBeDefined();

})
});