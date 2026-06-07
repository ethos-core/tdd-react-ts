import { describe, expect, it } from "vitest";
import { generateConfig } from "../formatConfig";

describe("generateConfig", () => {
	it("generates default config", () => {
		expect(generateConfig()).toMatchInlineSnapshot(`
      {
        "api": {
          "baseUrl": "http://localhost:3000",
          "timeout": 5000,
        },
        "features": {
          "darkMode": false,
          "notifications": true,
        },
        "version": "1.0.0",
      }
    `);
	});

	it("overrides with custom config", () => {
		const config = generateConfig({ api: { timeout: 10000 } });
		expect(config.api.timeout).toMatchInlineSnapshot(`10000`);
	});
});
