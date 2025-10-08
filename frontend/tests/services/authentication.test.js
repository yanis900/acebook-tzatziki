import createFetchMock from "vitest-fetch-mock";
import { describe, vi } from "vitest";

import { login, signup } from "../../src/services/authentication";

vi.stubEnv("VITE_BACKEND_URL", "http://localhost:3000");

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("authentication service", () => {
  describe("login", () => {
    test("calls the backend url for a token", async () => {
      const testEmail = "test@testEmail.com";
      const testPassword = "12345678";

      fetch.mockResponseOnce(JSON.stringify({ token: "testToken" }), {
        status: 201,
      });

      await login(testEmail, testPassword);

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/tokens`);
      expect(options.method).toEqual("POST");
      expect(options.body).toEqual(
        JSON.stringify({ email: testEmail, password: testPassword })
      );
      expect(options.headers["Content-Type"]).toEqual("application/json");
    });

    test("returns the token if the request was a success", async () => {
      const testEmail = "test@testEmail.com";
      const testPassword = "12345678";

      fetch.mockResponseOnce(JSON.stringify({ token: "testToken" }), {
        status: 201,
      });

      const token = await login(testEmail, testPassword);
      expect(token).toEqual("testToken");
    });

    test("throws an error if the request failed", async () => {
      const testEmail = "test@testEmail.com";
      const testPassword = "12345678";

      fetch.mockResponseOnce(JSON.stringify({ message: "Wrong Password" }), {
        status: 403,
      });

      try {
        await login(testEmail, testPassword);
      } catch (err) {
        expect(err.message).toEqual(
          "Received status 403 when logging in. Expected 201"
        );
      }
    });
  });

  describe("signup", () => {
  test("calls the backend url to create a user", async () => {
    const testFirstname = "John";
    const testLastname = "Doe";
    const testEmail = "test@testEmail.com";
    const testPassword = "12345678";

    fetch.mockResponseOnce("", { status: 201 });

    await signup(testFirstname, testLastname, testEmail, testPassword);

    const [url, options] = fetch.mock.lastCall;

    expect(url).toEqual(`${BACKEND_URL}/users`);
    expect(options.method).toEqual("POST");
    expect(options.body).toEqual(
      JSON.stringify({
        firstname: testFirstname,
        lastname: testLastname,
        email: testEmail,
        password: testPassword,
      })
    );
    expect(options.headers["Content-Type"]).toEqual("application/json");
  });

  test("returns nothing if the signup request was successful", async () => {
    const testFirstname = "John";
    const testLastname = "Doe";
    const testEmail = "test@testEmail.com";
    const testPassword = "12345678";

    fetch.mockResponseOnce("", { status: 201 });

    const result = await signup(testFirstname, testLastname, testEmail, testPassword);
    expect(result).toBeUndefined();
  });

  test("throws an error if the request failed", async () => {
    const testFirstname = "John";
    const testLastname = "Doe";
    const testEmail = "test@testEmail.com";
    const testPassword = "12345678";

    fetch.mockResponseOnce(JSON.stringify({ message: "User already exists" }), {
      status: 400,
    });

    await expect(
      signup(testFirstname, testLastname, testEmail, testPassword)
    ).rejects.toThrow("Received status 400 when signing up. Expected 201");
  });
});

});
