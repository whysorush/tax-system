// #!/usr/bin/env node

import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Register TypeScript loader
register('ts-node/esm', pathToFileURL('./'));

// Import and start the server
import('../server.js').then(module => {
  const app = module.default;
  const PORT = process.env.PORT || 3001;
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API is available at http://localhost:${PORT}/api`);
  });
});
