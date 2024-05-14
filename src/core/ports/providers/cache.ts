export type CacheSetOptions<T> = {
	key: string;
	value: T;
	ttlInSeconds?: number;
};

export interface ICacheProvider {
	del(key: string): Promise<void>;
	get<T>(key: string): Promise<T | null>;
	set<T>(options: CacheSetOptions<T>): Promise<void>;
	flush(): Promise<void>;
}

export const ICacheProvider = 'ICacheProvider';
