import { SamartHomeHandyBis } from "../main";

export class TemplateManager {
    adapter: SamartHomeHandyBis;
    constructor(adapter: SamartHomeHandyBis) {
        this.adapter = adapter;
    }

    public async uploadTemplateSetting(
        name: string,
        devices: string,
        screens: string,
        widgets: string,
        /* _client: Client, */
    ): Promise<void> {
        if (devices != null) {
            await this.adapter.setStateAsync("settings." + name + ".devices", devices, true);
        }
        if (screens != null) {
            await this.adapter.setStateAsync("settings." + name + ".screens", screens, true);
        }
        if (widgets != null) {
            await this.adapter.setStateAsync("settings." + name + ".widgets", widgets, true);
        }
    }

    public async getTemplateSettings(
        name: string,
    ): Promise<{ screens: any; widgets: any; devices: any } | { [index: string]: never }> {
        let temp = await this.adapter.getStateAsync("settings." + name + ".devices");
        if (temp == null) {
            return {};
        }
        const devicesJSON = temp.val;
        temp = await this.adapter.getStateAsync("settings." + name + ".screens");
        if (temp == null) {
            return {};
        }
        const screensJSON = temp.val;
        temp = await this.adapter.getStateAsync("settings." + name + ".widgets");
        if (temp == null) {
            return {};
        }
        const widgetsJSON = temp.val;

        this.adapter.log.debug("WIDGETS " + widgetsJSON);

        return { screens: screensJSON, widgets: widgetsJSON, devices: devicesJSON };
    }

    public async fetchTemplateSettings(): Promise<string[]> {
        const settings = await this.adapter.getAdapterObjectsAsync();
        this.adapter.log.debug("Fetch Templates");
        const list = [];
        for (const id in settings) {
            const splitted = id.split(".");
            if (splitted[3] == null || splitted[2] != "settings" || splitted.length > 4) continue;
            this.adapter.log.debug("Settings: " + id);
            list.push(splitted[3]);
        }

        return list;
    }

    public async createNewTemplateSetting(templateSettings: TemplateSettings): Promise<void> {
        await this.adapter.setObjectNotExistsAsync("settings", {
            type: "channel",
            common: {
                name: "Settings",
            },
            native: {},
        });
        await this.adapter.setObjectNotExistsAsync("settings." + templateSettings.name, {
            type: "folder",
            common: {
                name: templateSettings.name,
                read: true,
                write: true,
            },
            native: {},
        });

        await this.adapter.setObjectNotExistsAsync("settings." + templateSettings.name + ".devices", {
            type: "state",
            common: {
                name: templateSettings.name + " devices",
                type: "string",
                role: "json",
                def: "{}",
                read: true,
                write: true,
            },
            native: {},
        });

        await this.adapter.setObjectNotExistsAsync("settings." + templateSettings.name + ".widgets", {
            type: "state",
            common: {
                name: templateSettings.name + " widgets",
                type: "string",
                role: "json",
                def: "{}",
                read: true,
                write: true,
            },
            native: {},
        });

        await this.adapter.setObjectNotExistsAsync("settings." + templateSettings.name + ".screens", {
            type: "state",
            common: {
                name: templateSettings.name + " screens",
                type: "string",
                role: "json",
                def: "{}",
                read: true,
                write: true,
            },
            native: {},
        });
    }
}

export class TemplateSettings {
    name;
    constructor(name: string) {
        this.name = name;
    }
}
