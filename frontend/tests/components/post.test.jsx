import { render, screen } from "@testing-library/react";

import Post from "../../src/components/Post";

describe("Post", () => {
  test("displays the message as an article", async () => {
    const testPost = { _id: "123", message: "test message", date: "2025-10-10T11:37:04.662Z" };
    render(<Post post={testPost} />);

    const post = await screen.findByText(/test message.*4 days ago/, { exact: false });
    expect(post).toBeDefined()
  });
});
