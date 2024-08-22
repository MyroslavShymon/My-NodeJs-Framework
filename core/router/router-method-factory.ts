import {HttpServer, RequestMethod} from '../../common';

export class RouterMethodFactory {
    public get(target: HttpServer, requestMethod: RequestMethod): Function {
        switch (requestMethod) {
            case RequestMethod.POST:
                return target.post;
            case RequestMethod.GET:
                return target.get;
            case RequestMethod.PUT:
                return target.put;
            case RequestMethod.PATCH:
                return target.patch;
            case RequestMethod.DELETE:
                return target.delete;
            default:
                return target.get;
        }
    }
}