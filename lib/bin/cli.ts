#!/usr/bin/env node

import { spawn } from "child_process";
import chokidar from "chokidar";
import debounce from "lodash.debounce";
import {
  getRegistryHash,
  clearRegistry,
  REGISTRY_PATH_DIR,
} from "../src/registry";
import { generateSitemap } from "../src/generate";

const [, , command, ...args] = process.argv;

try {
  if (command === "build") {
    clearRegistry();

    const build = spawn("next", ["build", ...args], { stdio: "inherit" });

    build.on("exit", async (code) => {
      if (code === 0) {
        console.log(
          "[next-static-sitemap] Build finished, generating sitemap..."
        );
        await generateSitemap();
        clearRegistry();
      } else {
        process.exit(code ?? 1);
      }
    });
  } else if (command === "dev") {
    clearRegistry();

    const nextDev = spawn("next", ["dev", ...args], { stdio: "inherit" });

    let lastHash = getRegistryHash();

    const regenerate = debounce(async () => {
      const currentHash = getRegistryHash();
      if (currentHash === lastHash) return;

      lastHash = currentHash;
      console.log(
        "[next-static-sitemap] Route data changed, regenerating sitemap..."
      );
      await generateSitemap();
    }, 500);

    chokidar
      .watch(REGISTRY_PATH_DIR, {
        persistent: true,
        ignoreInitial: true,
      })
      .on("all", regenerate);

    nextDev.on("exit", (code) => {
      clearRegistry();
      process.exit(code ?? 0);
    });
  } else {
    console.error("Usage: next-static-sitemap [build|dev]");
    process.exit(1);
  }
} finally {
  clearRegistry();
}
