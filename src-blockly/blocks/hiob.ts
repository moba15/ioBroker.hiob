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

    Blockly.Blocks.hiob_mutator = {
        init: function (this: any): void {
            this.appendDummyInput().appendField('Options');
            this.setNextStatement(true, null);
            this.setColour(Blockly.Sendto.HUE);
        },
    };

    ['title', 'groupKey', 'locked', 'id'].forEach(field => {
        Blockly.Blocks[`hiob_${field}`] = {
            init: function (this: any): void {
                this.appendDummyInput().appendField(field);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(Blockly.Sendto.HUE);
            },
        };
    });

    Blockly.Blocks.hiob = {
        init: function (this: any): void {
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

            this.appendValueInput('message').appendField(Blockly.Translate('hiob_message'));

            this.appendDummyInput('LOG')
                .appendField(Blockly.Translate('hiob_log'))
                .appendField(new Blockly.FieldDropdown(logLevelOptions()), 'LOG');

            this.setInputsInline(false);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);

            this.setColour(Blockly.Sendto.HUE);
            this.setTooltip(Blockly.Translate('hiob_tooltip'));
            this.setHelpUrl('https://github.com/moba15/ioBroker.hiob/blob/main/README.md');
            if (Blockly.icons) {
                this.setMutator(
                    new Blockly.icons.MutatorIcon(['hiob_title', 'hiob_groupKey', 'hiob_locked', 'hiob_id'], this),
                );
            } else if (Blockly.Mutator) {
                this.setMutator(new Blockly.Mutator(['hiob_title', 'hiob_groupKey', 'hiob_locked', 'hiob_id'], this));
            }
        },
        mutationToDom: function (this: any): HTMLElement {
            const container = document.createElement('mutation');
            container.setAttribute('title', this.title_ ? 'true' : 'false');
            container.setAttribute('groupKey', this.groupKey_ ? 'true' : 'false');
            container.setAttribute('locked', this.locked_ ? 'true' : 'false');
            container.setAttribute('id', this.id_ ? 'true' : 'false');
            return container;
        },
        domToMutation: function (this: any, xmlElement: HTMLElement): void {
            this.title_ = xmlElement.getAttribute('title') === 'true';
            this.groupKey_ = xmlElement.getAttribute('groupKey') === 'true';
            this.locked_ = xmlElement.getAttribute('locked') === 'true';
            this.id_ = xmlElement.getAttribute('id') === 'true';
            this.updateShape_();
        },
        decompose: function (this: any, workspace: any): Block {
            const containerBlock = workspace.newBlock('hiob_mutator');
            containerBlock.initSvg();
            let connection = containerBlock.nextConnection;

            ['title', 'groupKey', 'locked', 'id'].forEach(field => {
                if (this[`${field}_`]) {
                    const itemBlock = workspace.newBlock(`hiob_${field}`);
                    itemBlock.initSvg();
                    connection.connect(itemBlock.previousConnection);
                    connection = itemBlock.nextConnection;
                }
            });

            return containerBlock;
        },
        compose: function (this: any, containerBlock: any): void {
            this.title_ = false;
            this.groupKey_ = false;
            this.locked_ = false;
            this.id_ = false;

            let itemBlock = containerBlock.nextConnection.targetBlock();
            while (itemBlock) {
                const field = itemBlock.type.replace('hiob_', '');
                this[`${field}_`] = true;
                itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
            }
            this.updateShape_();

            itemBlock = containerBlock.nextConnection.targetBlock();
            while (itemBlock) {
                const field = itemBlock.type.replace('hiob_', '');
                if (itemBlock.valueConnection_ && !itemBlock.valueConnection_.isHidden()) {
                    const input = this.getInput(field);
                    if (input) {
                        input.connection.connect(itemBlock.valueConnection_);
                    }
                }
                itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
            }
        },
        saveConnections: function (this: any, containerBlock: any): void {
            let itemBlock = containerBlock.nextConnection.targetBlock();
            while (itemBlock) {
                const field = itemBlock.type.replace('hiob_', '');
                const input = this.getInput(field);
                itemBlock.valueConnection_ = input && input.connection.targetConnection;
                itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
            }
        },
        updateShape_: function (this: any): void {
            const workspace = this.workspace;
            ['title', 'groupKey', 'locked', 'id'].forEach(field => {
                if (this[`${field}_`] && !this.getInput(field)) {
                    const input = this.appendValueInput(field).appendField(field);
                    setTimeout(
                        (__input: any, __field: string) => {
                            if (!__input.connection?.isConnected()) {
                                let shadowType = 'text';
                                let fieldName = 'TEXT';
                                let value = '';

                                if (__field === 'title') {
                                    value = 'Notification';
                                } else if (__field === 'groupKey') {
                                    value = 'Group';
                                } else if (__field === 'locked') {
                                    shadowType = 'logic_boolean';
                                    fieldName = 'BOOL';
                                    value = 'FALSE';
                                } else if (__field === 'id') {
                                    value = 'my_id';
                                }

                                const shadow = workspace.newBlock(shadowType);
                                shadow.setShadow(true);
                                shadow.setFieldValue(value, fieldName);
                                shadow.initSvg();
                                if (shadow.render) {
                                    shadow.render();
                                }
                                shadow.outputConnection!.connect(__input.connection);
                            }
                        },
                        100,
                        input,
                        field,
                    );
                } else if (!this[`${field}_`] && this.getInput(field)) {
                    this.removeInput(field);
                }
            });
            if (this.getInput('LOG')) {
                this.moveInputBefore('LOG', null);
            }
        },
    };

    registerGenerator('hiob', (block: any): string => {
        const instance = block.getFieldValue('INSTANCE');
        let device = block.getFieldValue('DEVICE');
        const logLevel = block.getFieldValue('LOG');
        const message = Blockly.JavaScript.valueToCode(block, 'message', Blockly.JavaScript.ORDER_ATOMIC);

        const title =
            (block.getInput('title')
                ? Blockly.JavaScript.valueToCode(block, 'title', Blockly.JavaScript.ORDER_ATOMIC)
                : '') || "'Notification'";
        const groupKey = block.getInput('groupKey')
            ? Blockly.JavaScript.valueToCode(block, 'groupKey', Blockly.JavaScript.ORDER_ATOMIC)
            : '';
        const locked =
            (block.getInput('locked')
                ? Blockly.JavaScript.valueToCode(block, 'locked', Blockly.JavaScript.ORDER_ATOMIC)
                : '') || 'false';
        const customId = block.getInput('id')
            ? Blockly.JavaScript.valueToCode(block, 'id', Blockly.JavaScript.ORDER_ATOMIC)
            : '';

        const logText = logLine(logLevel, 'hiob', message || "'Notification'");

        const instanceStr = instance ? (instance.startsWith('.') ? `hiob${instance}` : instance) : 'hiob.0';

        const lines = [`sendTo('${instanceStr}', 'sendNotification', {\n`];

        if (device && device !== 'all') {
            const idParts = device.split('.');
            if (idParts.length > 2) {
                device = idParts[idParts.length - 1];
            }
            lines.push(`  deviceId: '${device}',\n`);
        } else {
            lines.push(`  deviceId: '',\n`);
        }

        lines.push(`  notification: {\n`);
        if (customId) {
            lines.push(`    id: String(${customId}),\n`);
        } else {
            lines.push(`    id: String(Math.floor(Math.random() * (2147483647 - 1028)) + 1028),\n`);
        }
        lines.push(`    ts: Date.now(),\n`);

        if (message) {
            lines.push(`    body: String(${message}),\n`);
        } else {
            lines.push(`    body: 'Notification',\n`);
        }

        lines.push(`    title: String(${title}),\n`);
        if (groupKey) {
            lines.push(`    group: true,\n`);
            lines.push(`    groupKey: String(${groupKey}),\n`);
        } else {
            lines.push(`    group: false,\n`);
        }
        lines.push(`    data: [],\n`);
        lines.push(`    locked: Boolean(${locked})\n`);
        lines.push(`  }\n`);
        lines.push('});\n');
        lines.push(logText);

        return lines.join('');
    });
}
