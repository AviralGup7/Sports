import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const workspaceRoot = process.cwd();
const nextEnvPath = resolve(workspaceRoot, "next-env.d.ts");
const tsconfigPath = resolve(workspaceRoot, "tsconfig.json");

const defaultNextEnv = `/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference types="next/navigation-types/compat/navigation" />
/// <reference path="./.next/types/routes.d.ts" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
`;

const tsconfig = JSON.parse(readFileSync(tsconfigPath, "utf8"));
tsconfig.include = ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"];

writeFileSync(nextEnvPath, defaultNextEnv);
writeFileSync(tsconfigPath, `${JSON.stringify(tsconfig, null, 2)}\n`);
