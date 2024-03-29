// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
	namespace ioBroker {
		interface AdapterConfig {
			port: number;
			useCert: boolean;
			certPath: string;
			keyPath: string
		}
	}
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};