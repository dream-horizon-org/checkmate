import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

const SITE = "https://checkmate.dreamsportslabs.com";

export default defineConfig({
  site: SITE,
  integrations: [
    starlight({
      title: "Checkmate",
      favicon: "./public/favicon.svg",
      tableOfContents: {
        maxHeadingLevel: 5,
      },
      pagination: true,
      titleDelimiter: "/",
      description: "Remix Application for managing your test cases and runs",
      logo: {
        dark: "./src/assets/checkmate-dark.svg",
        light: "./src/assets/checkmate-light.svg",
        alt: "Checkmate",
      },
      social: {
        github: "https://github.com/ds-horizon/checkmate",
        discord: "https://discord.gg/wBQXeYAKNc",
      },
      sidebar: [
        {
          label: "Introduction",
          items: [
            "project/introduction",
          ],
        },
        {
          label: "Setup",
          items: [
            "project/setup",
          ],
        },
        {
          label: "User Guide",
          items: [
            {
              label: "Projects",
              items: ["guides/projects"],
            },
            {
              label: "Tests",
              items: ["guides/tests/tests", "guides/tests/bulk-addition"],
            },
            {
              label: "Runs",
              items: ["guides/runs/runs", "guides/runs/run-detail"],
            },
            {
              label: "Users",
              items: ["guides/user-settings", "project/rbac"],
            },
          ],
        },
        {
          label: "Developer Docs",
          items: [
            {
              label: "Application",
              items: [
                "tech/architecture",
                "tech/database",
              ],
            },
            {
              label: "API Documentation",
              items: [
                "guides/api",
                "guides/api/authentication",
                "guides/api/examples",
                "guides/api/openapi",
              ],
            },
          ],
        },
      ],
      customCss: ["./src/tailwind.css", "@fontsource-variable/inter"],
      components: {
        Head: "./src/overrides/head.astro",
      },
    }),
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
});
