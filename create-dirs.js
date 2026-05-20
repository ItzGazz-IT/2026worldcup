const fs = require('fs');
const path = require('path');

const basePath = 'C:\\Users\\gareth.vandenaardweg\\Downloads\\OfficeWorldCup';

const directories = [
    path.join(basePath, 'src'),
    path.join(basePath, 'src', 'data'),
    path.join(basePath, 'src', 'firebase'),
    path.join(basePath, 'src', 'utils'),
    path.join(basePath, 'src', 'components'),
    path.join(basePath, 'src', 'pages')
];

console.log('Creating directories...\n');

directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log('✓ Created: ' + dir);
    } else {
        console.log('✓ Already exists: ' + dir);
    }
});

console.log('\nVerifying all directories exist:\n');

let allExist = true;
directories.forEach(dir => {
    const exists = fs.existsSync(dir);
    const status = exists ? '✓' : '✗';
    console.log(status + ' ' + dir);
    if (!exists) allExist = false;
});

if (allExist) {
    console.log('\n✓ All directories created successfully!');
    process.exit(0);
} else {
    console.log('\n✗ Some directories failed to create');
    process.exit(1);
}
