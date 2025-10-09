import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { ProfilePage } from "../../src/pages/Profile/ProfilePage";
import { getPosts, deletePost } from "../../src/services/posts";
import { useNavigate } from "react-router-dom";

// Mock the services
vi.mock("../../src/services/posts", () => {
  const getPostsMock = vi.fn();
  const deletePostMock = vi.fn();
  return { getPosts: getPostsMock, deletePost: deletePostMock };
});

// Mock useNavigate
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock };
});

describe("ProfilePage Delete Button", () => {
  beforeEach(() => {
    window.localStorage.removeItem("token");
  });

  test("displays delete button for each post", async () => {
    window.localStorage.setItem("token", "testToken");

    const mockPosts = [
      { _id: "12345", message: "Test Post 1" },
      { _id: "6789", message: "Test Post 2" },
    ];

    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });

    render(<ProfilePage />);

    const deleteButtons = await screen.findAllByRole("button", {
      name: /delete/i,
    });

    expect(deleteButtons).toHaveLength(2);
  });
  test("shows confirmation popup when delete button is clicked", async () => {
    window.localStorage.setItem("token", "testToken");

    const mockPosts = [
      { _id: "12345", message: "Test Post 1" },
      { _id: "6789", message: "Test Post 2" },
    ];

    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });

    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<ProfilePage />);

    const deleteButtons = await screen.findAllByRole("button", {
      name: /delete/i,
    });

    await userEvent.click(deleteButtons[0]);

    expect(confirmSpy).toHaveBeenCalledWith(
      "Are you sure you want to delete this post?"
    );

    confirmSpy.mockRestore();
  });
  test("deletes post when user confirms deletion", async () => {
    window.localStorage.setItem("token", "testToken");

    const mockPosts = [
      { _id: "12345", message: "Test Post 1" },
      { _id: "6789", message: "Test Post 2" },
    ];

    getPosts.mockResolvedValueOnce({ posts: mockPosts, token: "newToken" });

    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    deletePost.mockResolvedValue({
      message: "Post deleted",
      token: "newToken",
    });

    getPosts.mockResolvedValueOnce({
      posts: [{ _id: "6789", message: "Test Post 2" }],
      token: "newToken",
    });

    render(<ProfilePage />);

    const deleteButtons = await screen.findAllByRole("button", {
      name: /delete/i,
    });

    console.log("Number of delete buttons:", deleteButtons.length);

    await userEvent.click(deleteButtons[0]);

    console.log("Confirm was called:", confirmSpy.mock.calls);
    console.log("DeletePost was called:", deletePost.mock.calls);
    console.log("DeletePost call count:", deletePost.mock.calls.length);

    expect(deletePost).toHaveBeenCalledWith("newToken", "12345");

    const remainingPosts = await screen.findAllByRole("article");
    expect(remainingPosts).toHaveLength(1);

    confirmSpy.mockRestore();
  });
});
