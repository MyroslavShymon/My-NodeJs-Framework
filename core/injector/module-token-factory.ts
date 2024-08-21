import hash from 'object-hash';
import {v4 as uuid} from 'uuid';
import {Type} from "../../common";

export class ModuleTokenFactory {
    private readonly moduleIdsCache = new WeakMap<Type<unknown>, string>()

    public create(metatype: Type<unknown>): string {
        const moduleId = this.getModuleId(metatype);
        const opaqueToken = {
            id: moduleId,
            module: this.getModuleName(metatype),
        };
        return hash(opaqueToken, {ignoreUnknown: true});
    }

    public getModuleId(metatype: Type<unknown>): string {
        let moduleId = this.moduleIdsCache.get(metatype);
        if (moduleId) {
            return moduleId;
        }
        moduleId = uuid();
        this.moduleIdsCache.set(metatype, moduleId);
        return moduleId;
    }

    public getModuleName(metatype: Type<any>): string {
        return metatype.name;
    }
}