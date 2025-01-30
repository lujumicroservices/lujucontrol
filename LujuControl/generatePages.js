import fs from 'fs';
import path from 'path';

// Get the current directory path (equivalent of __dirname in ES modules)
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Pages based on the provided list
const pages = [
  'dashboard',
  'members',
  'staff',
  'membershipplans',
  'payments/records',
  'payments/due',
  'classes/schedule',
  'classes/bookings',
  'access-control',
  'reports'
];

// Function to create the directory structure and files with default content
function generatePageStructure(page) {
  const pageDirs = page.split('/');  // Split the page path into directories
  const pageDir = path.join(__dirname, 'src', 'app', '(control-panel)', ...pageDirs);  // Build the full path
  const i18nDir = path.join(pageDir, 'i18n');
  
  // Clean up existing directory contents if necessary
  cleanUpDirectory(pageDir);
  cleanUpDirectory(i18nDir);

  // Create the directories (including nested ones)
  fs.mkdirSync(pageDir, { recursive: true });
  fs.mkdirSync(i18nDir, { recursive: true });
  
  // Extract the name of the parent folder to use as the .tsx file name
  const pageFileName = pageDirs[pageDirs.length - 1]; // Last part of the path (e.g., 'members', 'dashboard')
  
  // Add 'Page' suffix to the page file name
  const pageFileNameWithSuffix = `${capitalizeFirstLetter(pageFileName)}Page`;

  // Generate dynamic content for page.tsx and component (e.g., MembersPage.tsx)
  const pageTsxContent = `import ${pageFileNameWithSuffix} from './${pageFileNameWithSuffix}';

export default ${pageFileNameWithSuffix};
`;

  const pageComponentTsxContent = `'use client';

import DemoContent from '@fuse/core/DemoContent';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import './i18n';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function ${pageFileNameWithSuffix}() {
	const { t } = useTranslation('${pageFileName.toLowerCase()}page');

	return (
		<Root
			header={
				<div className="p-6">
					<h4>{t('TITLE')}</h4>
				</div>
			}
			content={
				<div className="p-6">
					<h4>Content</h4>
					<br />
					<DemoContent />
				</div>
			}
		/>
	);
}

export default ${pageFileNameWithSuffix};
`;

  // Create the .tsx files with the correct name (e.g., AddUserPage.tsx)
  fs.writeFileSync(path.join(pageDir, `${pageFileNameWithSuffix}.tsx`), pageComponentTsxContent);
  fs.writeFileSync(path.join(pageDir, 'page.tsx'), pageTsxContent);
  
  // Generate i18n files (ar.ts, en.ts, tr.ts, es.ts, index.ts) based on the page name
  generateI18nFiles(i18nDir, pageFileNameWithSuffix);
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to clean up the directory (delete all contents inside)
function cleanUpDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stat = fs.lstatSync(filePath);
      
      // If it's a directory, recursively delete its contents
      if (stat.isDirectory()) {
        cleanUpDirectory(filePath);  // Recursive delete
        fs.rmdirSync(filePath);      // Remove empty directory
      } else {
        fs.unlinkSync(filePath);     // Remove file
      }
    });
  }
}

// Function to generate i18n files
function generateI18nFiles(i18nDir, pageFileNameWithSuffix) {
  const arContent = `const locale = {
	TITLE: 'مثال على صفحة ${pageFileNameWithSuffix}'
};

export default locale;`;

  const enContent = `const locale = {
	TITLE: '${pageFileNameWithSuffix} Page'
};

export default locale;`;

  const trContent = `const locale = {
	TITLE: '${pageFileNameWithSuffix} Sayfası'
};

export default locale;`;

  const esContent = `const locale = {
	TITLE: 'Página de ${pageFileNameWithSuffix}'
};

export default locale;`;

  const indexContent = `import i18n from '@i18n';
import ar from './ar';
import en from './en';
import tr from './tr';
import es from './es';

i18n.addResourceBundle('en', '${pageFileNameWithSuffix.toLowerCase()}', en);
i18n.addResourceBundle('tr', '${pageFileNameWithSuffix.toLowerCase()}', tr);
i18n.addResourceBundle('ar', '${pageFileNameWithSuffix.toLowerCase()}', ar);
i18n.addResourceBundle('es', '${pageFileNameWithSuffix.toLowerCase()}', es);`;

  // Write i18n files
  fs.writeFileSync(path.join(i18nDir, 'ar.ts'), arContent);
  fs.writeFileSync(path.join(i18nDir, 'en.ts'), enContent);
  fs.writeFileSync(path.join(i18nDir, 'tr.ts'), trContent);
  fs.writeFileSync(path.join(i18nDir, 'es.ts'), esContent);
  fs.writeFileSync(path.join(i18nDir, 'index.ts'), indexContent);
}

// Generate the pages
pages.forEach(page => generatePageStructure(page));

console.log('Page structure generation complete!');
