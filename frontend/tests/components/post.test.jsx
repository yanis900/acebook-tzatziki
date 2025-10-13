import { render, screen } from "@testing-library/react";

import Post from "../../src/components/Post";

describe("Post", () => {
  test("displays the message as an article", () => {
    const testPost = { _id: "123", message: "test message", date: "2025-10-10T11:37:04.662Z" };
    render(<Post post={testPost} />);

    const article = screen.getByRole("article");
    expect(article.textContent).toBe("test message - 3 days ago");
  });
});
