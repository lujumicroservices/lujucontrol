const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// Define the configuration directory
const configDir = path.join(__dirname, '../config/catalog-config');

// List all configuration files in the directory
const configFiles = fs.readdirSync(configDir).filter(file => file.endsWith('.json'));

// Explicitly define which configuration files should be used
const selectedConfigs = [
  'facility-config.json',
  'fee-config.json',
  'maintenance-config.json',
  'property-config.json',
  'resident-config.json',
  'rule-config.json',
  'violation-config.json'
];

// Filter only the selected configuration files
const usedConfigs = configFiles.filter(file => selectedConfigs.includes(file));

if (usedConfigs.length === 0) {
  console.error('No valid configuration files selected!');
  process.exit(1);
}

// Define the template directory
const templateDir = path.join(__dirname, '../templates');

// List of templates to generate
const templates = [
  { template: 'catalog-templates/Api.template.ts', output: '{{moduleName}}Api.ts' },
  { template: 'catalog-templates/catalog-form/Form.template.tsx', output: '{{moduleNameLower}}-form/{{moduleName}}Form.tsx' },
  { template: 'catalog-templates/catalog-list/List.template.tsx', output: '{{moduleNameLower}}-list/{{moduleName}}List.tsx' },
  { template: 'catalog-templates/catalog-list/ListItem.template.tsx', output: '{{moduleNameLower}}-list/{{moduleName}}ListItem.tsx' },
  { template: 'catalog-templates/models/Model.template.ts', output: 'models/{{moduleName}}Model.ts' },
  { template: 'catalog-templates/AppSlice.template.ts', output: '{{moduleNameLower}}AppSlice.ts' },
  { template: 'catalog-templates/App.template.tsx', output: '{{moduleName}}App.tsx' },
  { template: 'catalog-templates/Header.template.tsx', output: '{{moduleName}}Header.tsx' },
  { template: 'catalog-templates/SidebarContent.template.tsx', output: '{{moduleName}}SidebarContent.tsx' },
  { template: 'catalog-templates/Title.template.tsx', output: '{{moduleName}}Title.tsx' },
  { template: 'catalog-templates/Page.template.tsx', output: 'page.tsx' },
  { template: 'catalog-templates/Layout.template.tsx', output: 'layout.tsx' },
  { template: 'catalog-templates/catalog-id/catalogid-catalog-page.tsx', output: '[{{moduleNameLower}}Id]/{{moduleName}}Page.tsx' },
  { template: 'catalog-templates/catalog-id/catalogid-page.tsx', output: '[{{moduleNameLower}}Id]/Page.tsx' },  
  { template: 'catalog-templates/catalog-id/edit/page.tsx', output: '[{{moduleNameLower}}Id]/edit/page.tsx' },
  { template: 'catalog-templates/catalog-id/view/catalog-view.tsx', output: '[{{moduleNameLower}}Id]/view/{{moduleName}}View.tsx' },
  { template: 'catalog-templates/catalog-id/view/page.tsx', output: '[{{moduleNameLower}}Id]/view/page.tsx' },

	{ template: 'data-templates/items/[id]/route.tsx', output: 'mock/{{moduleNameLower}}/items/[Id]/route.ts' },
	{ template: 'data-templates/items/route.tsx', output: 'mock/{{moduleNameLower}}/items/route.ts' },


];

// Process each selected configuration file
usedConfigs.forEach(configFile => {
  const configPath = path.join(configDir, configFile);
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const outputDir = path.join(__dirname, '../out', config.moduleNameLower);

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Process each template
  templates.forEach(({ template, output }) => {
    const templatePath = path.join(templateDir, template);
    const templateContent = fs.readFileSync(templatePath, 'utf8');

    // Compile the template using Handlebars
    const compiledTemplate = Handlebars.compile(templateContent);
    const renderedContent = compiledTemplate(config);

    // Render output filename
    const compiledFilename = Handlebars.compile(output);
    const outputPath = path.join(outputDir, compiledFilename(config));

    // Ensure nested directories exist
    const outputDirPath = path.dirname(outputPath);
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }

    // Write the rendered content to the output file
    fs.writeFileSync(outputPath, renderedContent);

    console.log(`Generated: ${outputPath}`);
  });
});

console.log('Module generation complete!');
