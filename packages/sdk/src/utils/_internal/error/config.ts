import { BaseError } from './base';

export type ConfigErrorType<name extends string = 'ConfigError'> = BaseError & {
	name: name;
};

export class ConfigError extends BaseError {
	override name = 'ConfigError';
}

export class InvalidProjectAccessKeyError extends ConfigError {
	override name = 'InvalidProjectAccessKeyError';
	constructor(projectAccessKey: string) {
		super(`Invalid project access key: ${projectAccessKey}`);
	}
}
