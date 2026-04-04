import fs from 'node:fs';
import path from 'node:path';

type Mode = 'dev' | 'release';

type Identity = {
    packageName: string;
    adapterName: string;
    title: string;
    adminHeader: string;
};

const IDENTITIES: Record<Mode, Identity> = {
    dev: {
        packageName: 'iobroker.hiob-dev',
        adapterName: 'hiob-dev',
        title: 'HioB Dev',
        adminHeader: 'hiob-dev adapter settings',
    },
    release: {
        packageName: 'iobroker.hiob',
        adapterName: 'hiob',
        title: 'HioB APP',
        adminHeader: 'hiob adapter settings',
    },
};

const ROOT = process.cwd();

function resolveFromRoot(...parts: string[]): string {
    return path.join(ROOT, ...parts);
}

function readJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function writeJsonIfChanged(filePath: string, value: unknown): boolean {
    const next = `${JSON.stringify(value, null, 2)}\n`;
    const current = fs.readFileSync(filePath, 'utf8');
    if (current === next) {
        return false;
    }
    fs.writeFileSync(filePath, next, 'utf8');
    return true;
}

function writeTextIfChanged(filePath: string, value: string): boolean {
    const current = fs.readFileSync(filePath, 'utf8');
    if (current === value) {
        return false;
    }
    fs.writeFileSync(filePath, value, 'utf8');
    return true;
}

function updatePackageJson(identity: Identity): boolean {
    const filePath = resolveFromRoot('package.json');
    const packageJson = readJson<Record<string, unknown>>(filePath);
    packageJson.name = identity.packageName;
    return writeJsonIfChanged(filePath, packageJson);
}

function updateIoPackage(identity: Identity): boolean {
    const filePath = resolveFromRoot('io-package.json');
    const ioPackage = readJson<Record<string, any>>(filePath);

    ioPackage.common = ioPackage.common ?? {};
    ioPackage.common.name = identity.adapterName;
    ioPackage.common.title = identity.title;

    const titleLang = ioPackage.common.titleLang ?? {};
    const langKeys = Object.keys(titleLang);
    if (langKeys.length === 0) {
        titleLang.en = identity.title;
    } else {
        for (const key of langKeys) {
            titleLang[key] = identity.title;
        }
    }
    ioPackage.common.titleLang = titleLang;

    return writeJsonIfChanged(filePath, ioPackage);
}

function replaceAdapterIdentity(content: string, adapterName: string): string {
    return content
        .replace(/(adapterName\s*=\s*['"])(hiob|hiob-testing|hiob-dev)(['"])/g, `$1${adapterName}$3`)
        .replace(/(name\s*:\s*['"])(hiob|hiob-testing|hiob-dev)(['"])/g, `$1${adapterName}$3`);
}

function updateMainFiles(identity: Identity): string[] {
    const files = [resolveFromRoot('src', 'main.ts'), resolveFromRoot('build', 'main.js')];
    const changed: string[] = [];

    for (const filePath of files) {
        if (!fs.existsSync(filePath)) {
            continue;
        }
        const current = fs.readFileSync(filePath, 'utf8');
        const next = replaceAdapterIdentity(current, identity.adapterName);
        if (writeTextIfChanged(filePath, next)) {
            changed.push(path.relative(ROOT, filePath));
        }
    }

    return changed;
}

function updateAdminHeader(identity: Identity): boolean {
    const filePath = resolveFromRoot('admin', 'jsonConfig.json');
    if (!fs.existsSync(filePath)) {
        return false;
    }

    const adminConfig = readJson<Record<string, any>>(filePath);
    adminConfig.items = adminConfig.items ?? {};
    adminConfig.items._headerAdapter = adminConfig.items._headerAdapter ?? {};
    adminConfig.items._headerAdapter.text = identity.adminHeader;

    return writeJsonIfChanged(filePath, adminConfig);
}

function parseMode(): Mode {
    const mode = process.argv[2];
    if (mode === 'dev' || mode === 'release') {
        return mode;
    }

    console.error('Usage: ts-node scripts/toggle-identity.ts <dev|release>');
    process.exit(1);
}

function main(): void {
    const mode = parseMode();
    const identity = IDENTITIES[mode];
    const touched: string[] = [];

    if (updatePackageJson(identity)) {
        touched.push('package.json');
    }
    if (updateIoPackage(identity)) {
        touched.push('io-package.json');
    }
    touched.push(...updateMainFiles(identity));
    if (updateAdminHeader(identity)) {
        touched.push(path.join('admin', 'jsonConfig.json'));
    }

    if (touched.length === 0) {
        console.log(`Identity already set to ${mode}. No changes needed.`);
        return;
    }

    console.log(`Switched identity to ${mode}. Updated files:`);
    for (const file of touched) {
        console.log(`- ${file}`);
    }
}

main();
