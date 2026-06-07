interface Config {
	version: string;
	api: {
		baseUrl: string;
		timeout: number;
	};
	features: {
		darkMode: boolean;
		notifications: boolean;
	};
}

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

const defaultConfig: Config = {
	version: "1.0.0",
	api: {
		baseUrl: "http://localhost:3000",
		timeout: 5000,
	},
	features: {
		darkMode: false,
		notifications: true,
	},
};

export function generateConfig(overrides?: DeepPartial<Config>): Config {
	if (!overrides) return { ...defaultConfig };

	return {
		version: overrides.version ?? defaultConfig.version,
		api: {
			...defaultConfig.api,
			...overrides.api,
		},
		features: {
			...defaultConfig.features,
			...overrides.features,
		},
	};
}
