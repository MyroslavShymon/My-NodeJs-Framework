import {
    addLeadingSlash,
    Controller,
    HttpServer,
    isConstructor,
    isFunction,
    isString,
    METHOD_METADATA,
    PATH_METADATA,
    RequestMethod,
    ROUTE_ARGS_METADATA,
    RouteParamtypes,
    RouterProxyCallback,
    Type
} from '../../common';
import {Container, InstanceWrapper} from '../injector';
import {RouterMethodFactory} from "./router-method-factory";

export interface RoutePathProperties {
    path: string[];
    requestMethod: RequestMethod;
    targetCallback: RouterProxyCallback;
    methodName: string;
}

export class RouterExplorer {
    private readonly routerMethodFactory = new RouterMethodFactory();

    constructor(
        private readonly container: Container,
    ) {
    }

    public explore<T extends HttpServer = any>(
        instanceWrapper: InstanceWrapper,
        module: string,
        router: T,
        basePath: string,
    ) {
        const {instance} = instanceWrapper;
        const routePaths: RoutePathProperties[] = this.scanForPaths(instance);

        (routePaths || []).forEach((pathProperties: any) => {
            this.applyCallbackToRouter(
                router,
                pathProperties,
                instanceWrapper,
                module,
                basePath,
            );
        })
    }

    public scanForPaths(
        instance: Controller,
    ): RoutePathProperties[] {
        const instancePrototype = Object.getPrototypeOf(instance);
        let methodNames = Object.getOwnPropertyNames(instancePrototype);

        const isMethod = (prop: string) => {
            const descriptor = Object.getOwnPropertyDescriptor(instancePrototype, prop);
            if (descriptor?.set || descriptor?.get) {
                return false;
            }
            return !isConstructor(prop) && isFunction(instancePrototype[prop]);
        };

        return methodNames.filter(isMethod).map(method => this.exploreMethodMetadata(instance, instancePrototype, method))
    }

    public exploreMethodMetadata(
        instance: Controller,
        prototype: object,
        methodName: string,
    ): RoutePathProperties {
        const instanceCallback = (instance as any)[methodName];
        const prototypeCallback = (prototype as any)[methodName];
        const routePath = Reflect.getMetadata(PATH_METADATA, prototypeCallback);

        const requestMethod: RequestMethod = Reflect.getMetadata(
            METHOD_METADATA,
            prototypeCallback,
        );
        const path = isString(routePath)
            ? [addLeadingSlash(routePath)]
            : routePath.map((p: string) => addLeadingSlash(p));
        return {
            path,
            requestMethod,
            targetCallback: instanceCallback,
            methodName,
        };
    }

    public stripEndSlash(str: string) {
        return str[str.length - 1] === '/' ? str.slice(0, str.length - 1) : str;
    }

    public createCallbackProxy(
        instance: Controller,
        callback: (...args: any[]) => unknown,
        methodName: string,
    ) {
        const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, instance.constructor, methodName) || {};
        const keys = Object.keys(metadata);
        const argsLength = Math.max(...keys.map(key => metadata[key].index)) + 1

        const paramsOptions = this.exchangeKeysForValues(keys, metadata);

        const fnApplyParams = this.resolveParamsOptions(paramsOptions)
        const handler = <TRequest, TResponse>(
            args: any[],
            req: TRequest,
            res: TResponse,
            next: Function,
        ) => async () => {
            fnApplyParams && (await fnApplyParams(args, req, res, next));

            return callback.apply(instance, args);
        };
        const targetCallback = async <TRequest, TResponse>(
            req: TRequest,
            res: TResponse,
            next: Function,
        ) => {
            const args = Array.apply(null, {argsLength} as any).fill(undefined);

            const result = await handler(args, req, res, next)()
            const applicationRef = this.container.getHttpAdapterRef()
            if (!applicationRef) {
                throw new Error(`Http server not created`)
            }
            return await applicationRef.reply(res, result);
        }
        return async <TRequest, TResponse>(
            req: TRequest,
            res: TResponse,
            next: () => void,
        ) => {
            try {
                await targetCallback(req, res, next);
            } catch (e) {
                throw e
            }
        };
    }

    public resolveParamsOptions(paramsOptions: any) {
        const resolveFn = async (args: any, req: any, res: any, next: any) => {
            const resolveParamValue = async (param: any) => {
                const {index, extractValue} = param;
                const value = extractValue(req, res, next);
                args[index] = value
            }
            await Promise.all(paramsOptions.map(resolveParamValue));
        }
        return paramsOptions && paramsOptions.length ? resolveFn : null;
    }

    public exchangeKeysForValues(
        keys: string[],
        metadata: Record<number, any>,
    ): any[] {
        return keys.map((key: any) => {
            const {index, data} = metadata[key];
            const numericType = Number(key.split(':')[0]);
            const extractValue = <TRequest extends Record<string, any>, TResponse>(
                req: TRequest,
                res: TResponse,
                next: Function,
            ) =>
                this.exchangeKeyForValue(numericType, data, {
                    req,
                    res,
                    next,
                });
            return {index, extractValue, type: numericType, data}
        })
    }

    public exchangeKeyForValue<
        TRequest extends Record<string, any> = any,
        TResponse = any,
        TResult = any
    >(
        key: RouteParamtypes | string,
        data: string | object | any,
        {req, res, next}: { req: TRequest; res: TResponse; next: Function },
    ): TResult | null {
        switch (key) {
            case RouteParamtypes.BODY:
                return data && req.body ? req.body[data] : req.body;
            case RouteParamtypes.PARAM:
                return data ? req.params[data] : req.params;
            default:
                return null;
        }
    }

    public extractRouterPath(metatype: Type<Controller>, prefix = ''): string[] {
        let path = Reflect.getMetadata(PATH_METADATA, metatype);

        if (Array.isArray(path)) {
            path = path.map(p => prefix + addLeadingSlash(p));
        } else {
            path = [prefix + addLeadingSlash(path)];
        }

        return path.map((p: string) => addLeadingSlash(p));
    }

    private applyCallbackToRouter<T extends HttpServer>(
        router: T,
        pathProperties: RoutePathProperties,
        instanceWrapper: InstanceWrapper,
        moduleKey: string,
        basePath: string,
    ) {
        const {
            path: paths,
            requestMethod,
            targetCallback,
            methodName,
        } = pathProperties;
        const {instance} = instanceWrapper;

        const routerMethod = this.routerMethodFactory
            .get(router, requestMethod)
            .bind(router);

        const handler = this.createCallbackProxy(
            instance,
            targetCallback,
            methodName,
        );

        paths.forEach(path => {
            const fullPath = this.stripEndSlash(basePath) + path;
            routerMethod(this.stripEndSlash(fullPath) || '/', handler);
        });
    }
}