// import { Application } from "./application";
import {Container, InstanceLoader} from "./injector";
import { DependenciesScanner } from "./dependencies-scanner";
// import { ExpressAdapter } from '../platform-express/express.adapter';

export class FactoryStatic {
    public async create(module: any) {
        const container = new Container();
        await this.initialize(module, container);

        const httpServer = new ExpressAdapter()
        container.setHttpAdapter(httpServer);
        const instance = new Application(
            container,
            httpServer,
            applicationConfig,
        );

        return instance;
    }

    private async initialize(
        module: any,
        container: Container,
    ) {
        const instanceLoader = new InstanceLoader(container)
        const dependenciesScanner = new DependenciesScanner(container);

        await dependenciesScanner.scan(module);
        await instanceLoader.createInstancesOfDependencies();
    }
}

export const Factory = new FactoryStatic();