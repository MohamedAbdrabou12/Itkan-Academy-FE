import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";

const plugins = [
  tailwindcss(),
  react({
    babel: {
      plugins: [["babel-plugin-react-compiler"]],
    },
  }),
];

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: plugins as any[],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src/", import.meta.url)),
      }
    ],
  },
});
