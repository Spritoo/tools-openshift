const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

// Path to the Angular environment file
const targetPath = './src/environments/environment.prod.ts';

// Generate the content for the environment.prod.ts file
const envConfigFile = `
export const environment = {
  production: true,
  apiUrl: '${process.env.NG_APP_API_URL}'
};
`;

// Write the content to the environment.prod.ts file
fs.writeFileSync(targetPath, envConfigFile, { encoding: 'utf8' });
console.log("Environment file generated at ${targetPath}");