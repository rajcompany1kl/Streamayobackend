// scripts/generate-module.js
const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('❌ Error: Please provide a module name.');
  console.log('Usage: npm run generate:module <ModuleName>');
  process.exit(1);
}

// --- Naming Conventions ---
const pascalCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const lowerCase = (str) => str.toLowerCase();

const moduleNamePascal = pascalCase(moduleName);
const moduleNameLower = lowerCase(moduleName);

// --- Paths ---
const basePath = path.join('src', 'app', 'modules', moduleNameLower);
const paths = {
  controllers: path.join(basePath, 'controllers'),
  services: path.join(basePath, 'services'),
  entities: path.join(basePath, 'entities'),
  dto: path.join(basePath, 'dto'),
};

// --- File Content Templates ---
const templates = {
  module: `import { Module } from '@nestjs/common';
import { ${moduleNamePascal}Controller } from './controllers/${moduleNameLower}.controller';
import { ${moduleNamePascal}Service } from './services/${moduleNameLower}.service';

@Module({
  controllers: [${moduleNamePascal}Controller],
  providers: [${moduleNamePascal}Service],
})
export class ${moduleNamePascal}Module {}
`,
  controller: `import { Controller } from '@nestjs/common';
import { ${moduleNamePascal}Service } from '../services/${moduleNameLower}.service';

@Controller('${moduleNameLower}')
export class ${moduleNamePascal}Controller {
  constructor(private readonly ${moduleNameLower}Service: ${moduleNamePascal}Service) {}
}
`,
  service: `import { Injectable } from '@nestjs/common';

@Injectable()
export class ${moduleNamePascal}Service {}
`,
  entity: `export class ${moduleNamePascal} {}
`,
  dto: `export class Create${moduleNamePascal}Dto {}
`,
};

// --- File Creation Logic ---
console.log(`🚀 Creating module: ${moduleNamePascal}...`);

// Create directories
Object.values(paths).forEach((dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
});

// Create files
fs.writeFileSync(path.join(basePath, `${moduleNameLower}.module.ts`), templates.module);
fs.writeFileSync(path.join(paths.controllers, `${moduleNameLower}.controller.ts`), templates.controller);
fs.writeFileSync(path.join(paths.services, `${moduleNameLower}.service.ts`), templates.service);
fs.writeFileSync(path.join(paths.entities, `${moduleNameLower}.entity.ts`), templates.entity);
fs.writeFileSync(path.join(paths.dto, `create-${moduleNameLower}.dto.ts`), templates.dto);

console.log('✅ Done. Module structure created successfully!');