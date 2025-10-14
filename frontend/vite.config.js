import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  test: {
    globals: true,
    environment: "jsdom",

     coverage: {
      provider: "v8", // must match @vitest/coverage-v8
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{js,jsx,ts,tsx}"],
    },
  },
});
