import {HttpServer, MODULE_METADATA} from '../../common';
import {Container, InstanceWrapper} from '../injector';
import {Resolver} from "../../common/interfaces/resolver.interface";
import {RouterExplorer} from "./routes-explorer";

export class RoutesResolver implements Resolver {
    private readonly routerExplorer: RouterExplorer;

    constructor(
        private readonly container: Container,
    ) {
        this.routerExplorer = new RouterExplorer(
            this.container,
        );
    }

    public resolve(applicationRef: any, basePath: string): void {
        const modules = this.container.getModules();
        modules.forEach(({controllers, metatype}) => {
            let path = metatype ? this.getModulePathMetadata(metatype) : undefined;
            path = path ? basePath + path : basePath;
            this.registerRouters(controllers, metatype.name, path, applicationRef);
        });
    }

    public registerRouters(
        routes: Map<string, InstanceWrapper<any>>,
        moduleName: string,
        basePath: string,
        applicationRef: HttpServer,
    ) {
        routes.forEach(instanceWrapper => {
            const {metatype} = instanceWrapper;

            const paths = this.routerExplorer.extractRouterPath(
                metatype as any,
                basePath,
            );

            paths.forEach((path: string) => {
                this.routerExplorer.explore(
                    instanceWrapper,
                    moduleName,
                    applicationRef,
                    path,
                );
            });
        });
    }

    private getModulePathMetadata(metatype: object): string | undefined {
        return Reflect.getMetadata(MODULE_METADATA.MODULE_PATH, metatype);
    }
}