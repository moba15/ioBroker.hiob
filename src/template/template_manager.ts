import { HiobTs } from "../main";
import { Client } from "../server/client";

export class TemplateManager {

    adapter: HiobTs
    constructor(adapter: HiobTs) {
        this.adapter = adapter;
    }

    public async uploadTemplateSetting(name: string, devices: string, screens: string, widgets: string, client: Client) : Promise<void>{
		if(devices != null) {
			await this.adapter.setStateAsync("settings." + name + ".devices", devices);
		}
		if(screens != null) {
			await this.adapter.setStateAsync("settings." + name + ".screens", screens);
		}
		if(widgets != null) {
			await this.adapter.setStateAsync("settings." + name + ".widgets", widgets);
		}
	}


    public async getTemplateSettings(name: string) : Promise<{screens: any, widgets: any, devices: any} | { [index: string]: never }> {
		let temp = (await this.adapter.getStateAsync("settings." + name + ".devices"));
		if(temp == null) {
			return {};
		}
		const devicesJSON = temp.val ;
		temp = (await this.adapter.getStateAsync("settings." + name + ".screens"));
		if(temp == null) {
			return {};
		}
		const screensJSON = temp.val;
		temp = (await this.adapter.getStateAsync("settings." + name + ".widgets"));
		if(temp == null) {
			return {};
		}
		const widgetsJSON = temp.val;

		this.adapter.log.debug("WIDGETS " + widgetsJSON);

		return {"screens": screensJSON, "widgets": widgetsJSON, "devices": devicesJSON};

	}


    public async fetchTemplateSettings() : Promise<string[]> {
		const settings = await this.adapter.getAdapterObjectsAsync();
		this.adapter.log.debug("Fetch Templates");
		const list = [];
		for (const id in settings) {
			const splitted = id.split(".");
			if(splitted[2] != "settings" || splitted.length > 4)
				continue;
			this.adapter.log.debug("Settings: " + id);
			list.push(splitted[3]);
		}


		return list;

	}


    public async createNewTemplateSetting(templateSettings: TemplateSettings, client: Client) : Promise<void>{
		await this.adapter.setObjectNotExistsAsync("settings." + templateSettings.name, {
			type: "folder",
			common: {
				name: templateSettings.name,
				read: true,
				write: true
			},
			native: {},
		});

		await this.adapter.setObjectNotExistsAsync("settings." + templateSettings.name + ".devices", {
			type: "state",
			common: {
				name: templateSettings.name + " devices",
				type: "string",
				role: "indicator.json",
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
				role: "indicator.json",
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
				role: "indicator.json",
				def: "{}",
				read: true,
				write: true,
			},
			native: {},
		});

	}
}

export class TemplateSettings {
	name
	constructor(name: string) {
		this.name = name;
	}

}