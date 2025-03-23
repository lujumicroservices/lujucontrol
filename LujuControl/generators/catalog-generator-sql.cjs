const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// Define directories
const configDir = path.join(__dirname, '../config/catalog-config');
const sqlOutputDir = path.join(__dirname, '../generated-sql');
const sqlOutputFile = path.join(sqlOutputDir, 'all-tables.sql');

// Ensure the SQL output directory exists
if (!fs.existsSync(sqlOutputDir)) {
  fs.mkdirSync(sqlOutputDir, { recursive: true });
}

// List all configuration files in the directory
const configFiles = fs.readdirSync(configDir).filter(file => file.endsWith('.json'));

// Explicitly define which configuration files should be used
const selectedConfigs = [
	'players-config.json',
  'settings-config.json',
	'payments-config.json',
	'users-config.json'  
];

// Filter only the selected configuration files
const usedConfigs = configFiles.filter(file => selectedConfigs.includes(file));

if (usedConfigs.length === 0) {
  console.error('No valid configuration files selected!');
  process.exit(1);
}

// Function to generate SQL schema
function generateSQLSchema(moduleName, fields) {
  let createSQL = `\n-- Table: ${moduleName}\nCREATE TABLE IF NOT EXISTS ${moduleName} (\n  id UUID PRIMARY KEY,\n`;
  let alterSQL = `\n-- Alter Table: ${moduleName}\nALTER TABLE ${moduleName} `;

  let alterCommands = [];
  fields.forEach(field => {
    let fieldType = 'TEXT';
    let nullable = 'NULL';

    if (field.type === 'string' && field.validation) {
      const match = field.validation.match(/max\((\d+)\)/);
      const length = match ? match[1] : 255;
      fieldType = `VARCHAR(${length})`;
    } else if (field.type === 'integer') {
      fieldType = 'INTEGER';
    } else if (field.type === 'float') {
      fieldType = 'FLOAT';
    } else if (field.type === 'boolean') {
      fieldType = 'BOOLEAN';
    }

    createSQL += `  ${field.name} ${fieldType} ${nullable},\n`;
    alterCommands.push(`ADD COLUMN IF NOT EXISTS ${field.name} ${fieldType} ${nullable}`);
  });

  createSQL = createSQL.slice(0, -2) + '\n);';
  alterSQL += alterCommands.join(', ') + ';';

  return `${createSQL}\n${alterSQL}`;
}

// Initialize consolidated SQL content
let consolidatedSQL = "-- Auto-generated SQL schema\n\n";

usedConfigs.forEach(configFile => {
  const configPath = path.join(configDir, configFile);
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const moduleName = config.moduleNameLower; // Assuming `moduleNameLower` is the table name
  const fields = config.fields || [];

  consolidatedSQL += generateSQLSchema(moduleName, fields) + "\n";
});

// Write consolidated SQL file
fs.writeFileSync(sqlOutputFile, consolidatedSQL);
console.log(`Generated SQL script: ${sqlOutputFile}`);
