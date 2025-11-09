// loader.mjs
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('ts-node/esm', pathToFileURL('./'));

// Add .ts extension support
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);