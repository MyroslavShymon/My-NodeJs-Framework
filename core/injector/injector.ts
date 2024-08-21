import {Module} from "./module";
import {InstanceWrapper} from './instance-wrapper';
import {Type} from '../../common';

export class Injector {

    public async loadInstance<T>(
        wrapper: InstanceWrapper<T>,
        collection: Map<string, InstanceWrapper>,
        moduleRef: Module,
    ) {
        const {name} = wrapper;

        const targetWrapper = collection.get(name);
        if (!targetWrapper) {
            throw Error('TARGET WRAPPER NOT FOUNDED')
        }
        const callback = async (instances: unknown[]) => {
            await this.instantiateClass(
                instances,
                wrapper,
                targetWrapper,
            );
        }
        await this.resolveConstructorParams<T>(
            wrapper,
            moduleRef,
            callback,
        );
    }

    public async loadProvider(
        wrapper: any,
        moduleRef: Module,
    ) {
        const providers = moduleRef.providers;
        await this.loadInstance<any>(
            wrapper,
            providers,
            moduleRef,
        );
    }

    public async loadControllers(
        wrapper: any,
        moduleRef: Module,
    ) {
        const controllers = moduleRef.controllers;
        await this.loadInstance<any>(
            wrapper,
            controllers,
            moduleRef,
        );
    }

    public async resolveConstructorParams<T>(
        wrapper: InstanceWrapper<T>,
        moduleRef: Module,
        callback: (args: unknown[]) => void | Promise<void>,
    ) {
        const dependencies = Reflect.getMetadata('design:paramtypes', wrapper.metatype)

        const resolveParam = async (param: Function, index: number) => {
            try {
                let providers = moduleRef.providers
                const paramWrapper = providers.get(param.name);
                return paramWrapper?.instance
            } catch (err) {
                throw err;
            }
        };
        const instances = dependencies ? await Promise.all(dependencies.map(resolveParam)) : [];
        await callback(instances);
    }

    public async instantiateClass<T = any>(
        instances: any[],
        wrapper: InstanceWrapper,
        targetMetatype: InstanceWrapper,
    ): Promise<T> {
        const {metatype} = wrapper;

        targetMetatype.instance = instances
            ? new (metatype as Type<any>)(...instances)
            : new (metatype as Type<any>)();

        return targetMetatype.instance;
    }
}