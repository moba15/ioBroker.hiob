const fs = require('fs');

let content = fs.readFileSync('blocks/hiob.ts', 'utf8');

content = content.replace(
    /const m = instances\[i\]\.match\(\/\^system\\\.adapter\\\.hiob\(\?:\-dev\)\?\\\.(\\\d\+)\$\/\);\n\s+if \(m\) \{\n\s+const n = parseInt\(m\[1\], 10\);\n\s+options\.push\(\[`hiob\.\$\{n\}`\, `\.\$\{n\}`\]\);\n\s+\}/,
    `const m = instances[i].match(/^system\\.adapter\\.(hiob(?:-dev)?)\\.(\\d+)$/);
            if (m) {
                const adapter = m[1];
                const n = parseInt(m[2], 10);
                options.push([\`\${adapter}.\${n}\`, \`\${adapter}.\${n}\`]);
            }`
);

content = content.replace(
    /for \(let n = 0; n <= 4; n\+\+\) \{\n\s+options\.push\(\[`hiob\.\$\{n\}`\, `\.\$\{n\}`\]\);\n\s+\}/,
    `for (let n = 0; n <= 4; n++) {
            options.push([\`hiob.\${n}\`, \`hiob.\${n}\`]);
        }`
);

content = content.replace(
    /const m = id\.match\(\/\^hiob\(\?:\-dev\)\?\\\.(\\\d\+)\\\.devices\\\.\[\^\.\]\+\(\?:\\\.\.\+\)\?\$\/\);/,
    `const m = id.match(/^(hiob(?:-dev)?)\\.(\\d+)\\.devices\\.([^.]+)(?:\\..+)?$/);`
);

content = content.replace(
    /if \(m\) \{\n\s+const instNum = m\[1\];\n\s+const deviceId = m\[2\];/,
    `if (m) {
                const adapter = m[1];
                const instNum = m[2];
                const deviceId = m[3];`
);

content = content.replace(
    /if \(selectedInstance && selectedInstance !== `\.\$\{instNum\}`\) \{/,
    `if (selectedInstance && selectedInstance !== \`\${adapter}.\${instNum}\`) {`
);

content = content.replace(
    /const lines = \[`sendTo\('hiob\$\{instance\}', 'send', \{\\n`\];/,
    `const lines = [\`sendTo('\${instance || 'hiob.0'}', 'send', {\\n\`];`
);

fs.writeFileSync('blocks/hiob.ts', content, 'utf8');
