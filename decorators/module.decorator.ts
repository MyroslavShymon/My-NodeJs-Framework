import 'reflect-metadata';
import {MODULE_METADATA} from "../common";

const metadataKeys = [
    MODULE_METADATA.IMPORTS,
    MODULE_METADATA.EXPORTS,
    MODULE_METADATA.CONTROLLERS,
    MODULE_METADATA.PROVIDERS,
];

export function validateModuleKeys(keys: string[]) {
    const validateKey = (key: string) => {
        if (metadataKeys.includes(key)) {
            return;
        }
        throw new Error(`NOT INVALID KEY: ${key}`);
    };
    keys.forEach(validateKey);
}

export function Module(metadata: any): ClassDecorator {
    const propsKeys = Object.keys(metadata);
    validateModuleKeys(propsKeys);

    return (target: Function) => {
        for (const property in metadata) {
            if (metadata.hasOwnProperty(property)) {
                Reflect.defineMetadata(property, (metadata as any)[property], target);
            }
        }
    };
}