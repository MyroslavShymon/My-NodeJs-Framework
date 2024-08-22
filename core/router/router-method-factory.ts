import {HttpServer, RequestMethod} from '../../common';

export class RouterMethodFactory {
    public get(target: HttpServer, requestMethod: RequestMethod): Function {
        switch (requestMethod) {
            case RequestMethod.POST:
                return target.post;
            case RequestMethod.GET:
                return target.get;
            default:
                return target.get;
        }
    }
}