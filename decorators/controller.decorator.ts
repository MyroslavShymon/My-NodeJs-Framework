import 'reflect-metadata';
import {isUndefined, PATH_METADATA} from "../common";

export function Controller(
    prefix?: string,
): ClassDecorator {
    const defaultPath = '/';

    const path = isUndefined(prefix) ? defaultPath : prefix;

    return (target: object) => {
        Reflect.defineMetadata(PATH_METADATA, path, target);
    };
}