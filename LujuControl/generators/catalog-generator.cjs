const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// Register 'or' helper
Handlebars.registerHelper('or', function () {
	const res = Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
	return res;
});

Handlebars.registerHelper("and", function (a, b, options) {
  return a && b;
});

// Register a custom helper: "andNot"
Handlebars.registerHelper("andNot", function (a, b, options) {
  return a && !b; // Returns true if 'a' is true and 'b' is false
});

// Register 'endsWith' helper
Handlebars.registerHelper('endsWith', function (str, suffix) {
	const res =  str.endsWith(suffix);
	return res;
});

// Register 'eq' helper for equality check
Handlebars.registerHelper('eq', function (a, b) {
	const res = a === b;
	return res;
});

Handlebars.registerHelper('eq-block', function (a, b, options) {
	if (a === b) {
		return options.fn(this); // Render the block content
	} else {
		return options.inverse(this); // Skip the block
	}
});

Handlebars.registerHelper('groupFields', function(fields) {
  const groupedFields = fields.reduce((acc, field) => {
    const group = field.group || 'Default'; // Default group if no groupname
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(field);
    return acc;
  }, {});

  // Return the grouped fields for iteration
  return groupedFields;
});


// Define the configuration directory
const configDir = path.join(__dirname, '../config/catalog-config');

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

// Define the template directory
const templateDir = path.join(__dirname, '../templates');

// List of templates to generate
const templates = [
  { template: 'catalog-templates/Api.template.ts', output: '(control-panel)/{{moduleNameLower}}/{{moduleName}}Api.ts' },
  { template: 'catalog-templates/catalog-form/Form.template.tsx', output: '(control-panel)/{{moduleNameLower}}/{{moduleNameLower}}-form/{{moduleName}}Form.tsx' },
  { template: 'catalog-templates/catalog-list/List.template.tsx', output: '(control-panel)/{{moduleNameLower}}/{{moduleNameLower}}-list/{{moduleName}}List.tsx' },
  { template: 'catalog-templates/catalog-list/ListItem.template.tsx', output: '(control-panel)/{{moduleNameLower}}/{{moduleNameLower}}-list/{{moduleName}}ListItem.tsx' },
  { template: 'catalog-templates/models/Model.template.ts', output: '(control-panel)/{{moduleNameLower}}/models/{{moduleName}}Model.ts' },
  { template: 'catalog-templates/AppSlice.template.ts', output: '(control-panel)/{{moduleNameLower}}/{{moduleNameLower}}AppSlice.ts' },
  { template: 'catalog-templates/App.template.tsx', output: '(control-panel)/{{moduleNameLower}}/{{moduleName}}App.tsx' },
  { template: 'catalog-templates/Header.template.tsx', output: '(control-panel)/{{moduleNameLower}}/{{moduleName}}Header.tsx' },
  { template: 'catalog-templates/SidebarContent.template.tsx', output: '(control-panel)/{{moduleNameLower}}/{{moduleName}}SidebarContent.tsx' },
  { template: 'catalog-templates/Title.template.tsx', output: '(control-panel)/{{moduleNameLower}}/{{moduleName}}Title.tsx' },
  { template: 'catalog-templates/Page.template.tsx', output: '(control-panel)/{{moduleNameLower}}/page.tsx' },
  { template: 'catalog-templates/Layout.template.tsx', output: '(control-panel)/{{moduleNameLower}}/layout.tsx' },
  { template: 'catalog-templates/catalog-id/catalogid-catalog-page.tsx', output: '(control-panel)/{{moduleNameLower}}/[{{moduleNameLower}}Id]/{{moduleName}}Page.tsx' },
  { template: 'catalog-templates/catalog-id/catalogid-page.tsx', output: '(control-panel)/{{moduleNameLower}}/[{{moduleNameLower}}Id]/page.tsx' },  
  { template: 'catalog-templates/catalog-id/edit/page.tsx', output: '(control-panel)/{{moduleNameLower}}/[{{moduleNameLower}}Id]/edit/page.tsx' },
  { template: 'catalog-templates/catalog-id/view/catalog-view.tsx', output: '(control-panel)/{{moduleNameLower}}/[{{moduleNameLower}}Id]/view/{{moduleName}}View.tsx' },
  { template: 'catalog-templates/catalog-id/view/page.tsx', output: '(control-panel)/{{moduleNameLower}}/[{{moduleNameLower}}Id]/view/page.tsx' },

	{ template: 'data-templates/items/[id]/route.tsx', output: 'api/mock/{{moduleNameLower}}/items/[id]/route.ts' },
	{ template: 'data-templates/items/route.tsx', output: 'api/mock/{{moduleNameLower}}/items/route.ts' },


];

// Process each selected configuration file
usedConfigs.forEach(configFile => {
  const configPath = path.join(configDir, configFile);
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const outputDir = path.join(__dirname, '../src/app');

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
