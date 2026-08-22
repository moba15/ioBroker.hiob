/**
 * `hiob` - send a notification.
 */
import type { Block } from 'blockly/core';

const Blockly = window.Blockly;

export function instanceOptions(): [string, string][] {
    const options: [string, string][] = [[Blockly.Translate('hiob_anyInstance'), '']];

    const instances = window.main?.instances;
    if (instances) {
        for (let i = 0; i < instances.length; i++) {
            const m = instances[i].match(/^system\.adapter\.(hiob(?:-dev)?)\.(\d+)$/);
            if (m) {
                const adapter = m[1];
                const n = parseInt(m[2], 10);
                options.push([`${adapter}.${n}`, `${adapter}.${n}`]);
            }
        }
    }

    if (options.length === 1) {
        for (let n = 0; n <= 4; n++) {
            options.push([`hiob.${n}`, `hiob.${n}`]);
        }
    }

    return options;
}

export function logLevelOptions(): [string, string][] {
    return [
        [Blockly.Translate('hiob_log_none'), ''],
        [Blockly.Translate('hiob_log_debug'), 'debug'],
        [Blockly.Translate('hiob_log_info'), 'log'],
        [Blockly.Translate('hiob_log_warn'), 'warn'],
        [Blockly.Translate('hiob_log_error'), 'error'],
    ];
}

export function logLine(logLevel: string, prefix: string, text: string): string {
    if (!logLevel) {
        return '';
    }
    return `console.${logLevel}('${prefix}: ' + ${text});\n`;
}

export function registerGenerator(type: string, generator: (block: Block) => string): void {
    if (Blockly.JavaScript.forBlock) {
        Blockly.JavaScript.forBlock[type] = generator;
    } else {
        Blockly.JavaScript[type] = generator;
    }
}

export function installHiob(): void {
    Blockly.Sendto.blocks.hiob = `<block type="hiob">
    <field name="INSTANCE"></field>
    <field name="DEVICE"></field>
    <field name="LOG"></field>
    <value name="message">
        <shadow type="text">
            <field name="TEXT">Hello world!</field>
        </shadow>
    </value>
</block>`;

    Blockly.Blocks.hiob = {
        init: function (this: Block): void {
            this.appendDummyInput('INSTANCE')
                .appendField(Blockly.Translate('hiob'))
                .appendField(new Blockly.FieldDropdown(instanceOptions()), 'INSTANCE');

            let deviceField;
            if (Blockly.FieldOID) {
                deviceField = new Blockly.FieldOID('', 'channel');
            } else {
                deviceField = new Blockly.FieldTextInput('');
            }

            this.appendDummyInput('DEVICE')
                .appendField(Blockly.Translate('hiob_device'))
                .appendField(deviceField, 'DEVICE');

            this.appendValueInput('message')
                .appendField(Blockly.Translate('hiob_message'));

            this.appendDummyInput('LOG')
                .appendField(Blockly.Translate('hiob_log'))
                .appendField(new Blockly.FieldDropdown(logLevelOptions()), 'LOG');

            this.setInputsInline(false);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);

            this.setColour(Blockly.Sendto.HUE);
            this.setTooltip(Blockly.Translate('hiob_tooltip'));
            this.setHelpUrl('https://github.com/moba15/ioBroker.hiob/blob/main/README.md');
        }
    };

    registerGenerator('hiob', (block: Block): string => {
        const instance = block.getFieldValue('INSTANCE');
        let device = block.getFieldValue('DEVICE');
        const logLevel = block.getFieldValue('LOG');
        const message = Blockly.JavaScript.valueToCode(block, 'message', Blockly.JavaScript.ORDER_ATOMIC);

        const logText = logLine(logLevel, 'hiob', message);

        // Instance could be hiob.0 or hiob-dev.0
        // The old code did sendTo('hiob' + instance, ...) but instanceOptions returns 'hiob.0'.
        // So we should just use instance directly if it's not empty, otherwise default to hiob.0.
        const instanceStr = instance ? (instance.startsWith('.') ? 'hiob' + instance : instance) : 'hiob.0';

        const lines = [`sendTo('${instanceStr}', 'send', {\n`];
        
        if (device && device !== 'all') {
            const idParts = device.split('.');
            if (idParts.length > 2) {
                device = idParts[idParts.length - 1]; 
            }
            lines.push(`  device: '${device}',\n`);
        }

        if (message) {
            lines.push(`  message: ${message},\n`);
        }
        lines.push('});\n');
        lines.push(logText);

        return lines.join('');
    });
}
