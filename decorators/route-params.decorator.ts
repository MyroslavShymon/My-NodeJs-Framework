import 'reflect-metadata';
import {isNil, isString, ROUTE_ARGS_METADATA, RouteParamtypes} from "../common";

const createPipesRouteParamDecorator = (paramtype: RouteParamtypes) => (
    data?: any,
): ParameterDecorator => (target, key, index) => {
    if (key === undefined) {
        throw new Error('Key cannot be undefined');
    }
    
    const hasParamData = isNil(data) || isString(data);
    const paramData = hasParamData ? data : undefined;
    const args =
        Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key) || {};

    Reflect.defineMetadata(
        ROUTE_ARGS_METADATA,
        {
            ...args,
            [`${paramtype}:${index}`]: {
                index,
                data: paramData,
            },
        },
        target.constructor,
        key,
    );
};

export function Body(
    property?: string,
): ParameterDecorator {
    return createPipesRouteParamDecorator(RouteParamtypes.BODY)(
        property,
    );
}

export function Param(
    property?: string,
): ParameterDecorator {
    return createPipesRouteParamDecorator(RouteParamtypes.PARAM)(
        property,
    );
}