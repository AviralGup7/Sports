import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended
});

const appBoundaryRules = {
  files: ["app/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@/domain/*"],
            message: "App routes should not import domain logic directly. Go through server queries or feature screens."
          }
        ]
      }
    ]
  }
};

const sharedBoundaryRules = {
  files: ["shared/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@/features/*"],
            message: "Shared modules must not depend on feature modules."
          }
        ]
      }
    ]
  }
};

const domainBoundaryRules = {
  files: ["domain/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "react",
            message: "Domain modules must stay framework-free."
          }
        ],
        patterns: [
          {
            group: ["next/*", "@/server/*", "@/features/*", "@/shared/*"],
            message: "Domain modules must not depend on framework, server, or UI layers."
          }
        ]
      }
    ]
  }
};

const publicFeatureBoundaryRules = {
  files: ["features/public/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@/features/admin/*"],
            message: "Public features must not depend on admin feature modules."
          }
        ]
      }
    ]
  }
};

const adminFeatureBoundaryRules = {
  files: ["features/admin/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@/features/public/*"],
            message: "Admin features must not depend on public feature modules."
          }
        ]
      }
    ]
  }
};

const config = [
  {
    ignores: [".next/**", "node_modules/**", "test-results/**", "playwright-report/**"]
  },
  ...compat.extends("next/core-web-vitals"),
  appBoundaryRules,
  sharedBoundaryRules,
  domainBoundaryRules,
  publicFeatureBoundaryRules,
  adminFeatureBoundaryRules
];

export default config;
