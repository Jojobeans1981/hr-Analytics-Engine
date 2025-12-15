const fs = require('fs');
const path = require('path');

const filePath = 'src/components/TalentRiskDashboard.tsx';

// 1. First, backup the file
function createBackup(originalPath) {
    const backupPath = `${originalPath}.backup.${Date.now()}`;
    try {
        fs.copyFileSync(originalPath, backupPath);
        console.log(`Backup created: ${backupPath}`);
        return backupPath;
    } catch (error) {
        console.error(`Failed to create backup: ${error.message}`);
        return null;
    }
}

// 2. Read and fix the file
function fixApiCall(filePath) {
    // Create backup first
    const backupPath = createBackup(filePath);
    if (!backupPath) {
        console.error('Aborting: Could not create backup');
        process.exit(1);
    }
    
    let content;
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
        process.exit(1);
    }
    
    const originalContent = content;
    
    // First, let's check what patterns exist in the file
    console.log('Checking for API patterns in file...');
    
    // Check for various possible patterns
    const patterns = [
        /fetch\(['"]\/api\/employees['"]\)/g,
        /fetch\(['"`]\/api\/employees['"`]\)/g,
        /fetch\(`\$\{API_BASE_URL\}\/employees`\)/g,
        /fetch\(`\$\{.*\}\/employees`\)/g
    ];
    
    let replacementMade = false;
    
    // Try each pattern
    for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        const matches = content.match(pattern);
        
        if (matches) {
            console.log(`Found ${matches.length} match(es) with pattern ${i + 1}:`);
            matches.forEach(match => console.log(`  - ${match}`));
            
            // Replace with environment-aware URL
            content = content.replace(
                pattern,
                "fetch(`${process.env.REACT_APP_API_URL || ''}/api/employees`)"
            );
            replacementMade = true;
            break;
        }
    }
    
    if (!replacementMade) {
        console.log('No API patterns found. Current fetch calls:');
        const allFetchCalls = content.match(/fetch\([^)]+\)/g);
        if (allFetchCalls) {
            allFetchCalls.forEach(call => console.log(`  - ${call}`));
        } else {
            console.log('  No fetch calls found in file');
        }
        
        // Ask user if they want to proceed
        console.log('\nDo you want to manually specify a replacement?');
        console.log('If not, the original file will be restored from backup.');
        console.log('Press Ctrl+C to abort, or wait 5 seconds to restore backup...');
        
        // Auto-restore after 5 seconds if no input
        setTimeout(() => {
            try {
                fs.copyFileSync(backupPath, filePath);
                console.log('File restored from backup (no changes made)');
                process.exit(0);
            } catch (error) {
                console.error('Failed to restore from backup:', error.message);
                process.exit(1);
            }
        }, 5000);
        
        // Wait for user input
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', () => {
            console.log('Manual replacement cancelled. Restoring backup...');
            try {
                fs.copyFileSync(backupPath, filePath);
                console.log('File restored from backup');
                process.exit(0);
            } catch (error) {
                console.error('Failed to restore from backup:', error.message);
                process.exit(1);
            }
        });
        return;
    }
    
    // Verify the replacement worked
    if (content === originalContent) {
        console.warn('Warning: No replacements were made. Restoring from backup...');
        try {
            fs.copyFileSync(backupPath, filePath);
            console.log('File restored from backup');
        } catch (error) {
            console.error('Failed to restore from backup:', error.message);
        }
        process.exit(0);
    }
    
    // Write the fixed content
    try {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('File updated successfully');
        
        // Verify the file is valid TypeScript
        console.log('\nVerifying file syntax...');
        const newContent = fs.readFileSync(filePath, 'utf8');
        
        // Quick syntax check for common issues
        const checks = [
            { name: 'Unclosed braces', regex: /(\{[^{}]*$|[^{]*\}[^{]*\{)/, ok: false },
            { name: 'Unclosed parentheses', regex: /(\([^()]*$|[^()]*\)[^()]*\()/, ok: false },
            { name: 'Missing semicolons', regex: /(const|let|var)\s+\w+\s*=[^;]+$/, ok: false }
        ];
        
        let hasErrors = false;
        const lines = newContent.split('\n');
        lines.forEach((line, index) => {
            checks.forEach(check => {
                if (check.regex.test(line.trim())) {
                    console.error(`  Line ${index + 1}: Possible ${check.name}: ${line.trim()}`);
                    hasErrors = true;
                }
            });
        });
        
        if (hasErrors) {
            console.error('\nPotential syntax errors detected. Consider restoring backup.');
            console.log(`Backup available at: ${backupPath}`);
        } else {
            console.log('Syntax check passed');
        }
        
    } catch (error) {
        console.error(`Error writing file: ${error.message}`);
        console.log('Attempting to restore from backup...');
        try {
            fs.copyFileSync(backupPath, filePath);
            console.log('File restored from backup');
        } catch (restoreError) {
            console.error('Failed to restore from backup:', restoreError.message);
        }
        process.exit(1);
    }
}

// 3. Run the fix
if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    console.log('Current directory:', process.cwd());
    console.log('Available files in src/components/:');
    try {
        const files = fs.readdirSync(path.dirname(filePath));
        files.forEach(file => console.log(`  - ${file}`));
    } catch (error) {
        console.error('Cannot read directory:', error.message);
    }
    process.exit(1);
}

console.log(`Fixing API calls in: ${filePath}`);
fixApiCall(filePath);