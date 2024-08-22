import 'reflect-metadata';
import {InjectableOptions, SCOPE_OPTIONS_METADATA} from "../common";

export function Injectable(options?: InjectableOptions): ClassDecorator {
    return (target: object) => {
        Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, options, target);
    };
}