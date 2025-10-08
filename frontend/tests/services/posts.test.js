import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi } from "vitest";

import { getPosts, createPost } from "../../src/services/posts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("posts service", () => {
  describe("getPosts", () => {
    test("includes a token with its request", async () => {
      fetch.mockResponseOnce(JSON.stringify({ posts: [], token: "newToken" }), {
        status: 200,
      });

      await getPosts("testToken");

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/posts`);
      expect(options.method).toEqual("GET");
      expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    });

    test("rejects with an error if the status is not 200", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Something went wrong" }),
        { status: 400 }
      );

      try {
        await getPosts("testToken");
      } catch (err) {
        expect(err.message).toEqual("Unable to fetch posts");
      }
    });
  });

  describe('createPost', () => {
    test('includes a token and a message with its request', async () => {
      fetch.mockResponseOnce(JSON.stringify({
        message: 'Post created', token: 'newToken'
      }), {status: 201})

      await createPost('testToken', '')

      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/posts`);
      expect(options.method).toEqual("POST");
      expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    })

    test('responds successfully with Post created', async () => {
      fetch.mockResponseOnce(JSON.stringify({
        message: 'Post created', token: 'newToken'
      }), {status: 201})

      const data = await createPost('testToken', 'haha')

      expect(data.message).toEqual("Post created");
    })

    test("rejects with an error if the status is not 201", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Something went wrong"}),
        { status: 400 }
      );

      try {
        await createPost("testToken", '');
      } catch (err) {
        expect(err.message).toEqual("Unable to create post");
      }
    });

  })
});
