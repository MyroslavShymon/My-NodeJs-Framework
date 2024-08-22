import 'reflect-metadata';
import {METHOD_METADATA, PATH_METADATA, RequestMethod} from "../common";

export interface RequestMappingMetadata {
    path?: string | string[];
    method?: RequestMethod;
}

const defaultMetadata = {
    path: '/',
    method: RequestMethod.GET,
};

export const RequestMapping = (
    metadata: RequestMappingMetadata = defaultMetadata,
): MethodDecorator => {
    const pathMetadata = metadata.path;
    const path = pathMetadata && pathMetadata.length ? pathMetadata : '/';
    const requestMethod = metadata.method || RequestMethod.GET;

    return (
        target: object,
        key: string | symbol,
        descriptor: TypedPropertyDescriptor<any>,
    ) => {
        Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
        Reflect.defineMetadata(METHOD_METADATA, requestMethod, descriptor.value);
        return descriptor;
    };
};

const createMappingDecorator = (method: RequestMethod) => (
    path?: string | string[],
): MethodDecorator => {
    return RequestMapping({
        path,
        method,
    });
};

export const Post = createMappingDecorator(RequestMethod.POST);
export const Put = createMappingDecorator(RequestMethod.PUT);
export const Delete = createMappingDecorator(RequestMethod.DELETE);
export const Patch = createMappingDecorator(RequestMethod.PATCH);
export const Get = createMappingDecorator(RequestMethod.GET);