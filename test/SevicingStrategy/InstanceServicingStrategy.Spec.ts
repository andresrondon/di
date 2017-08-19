/// <reference path="../../typings/index.d.ts" />

import * as assert from 'assert'
import { IMock, Mock, It, Times } from 'typemoq'

import { ResolutionContext } from "../../source/ResolutionContext";
import { InstanceServicingStrategy } from "../../source/ServicingStrategy/InstanceServicingStrategy";
import { IContainer } from "../../source/IContainer";
import { ServicingError } from "../../source/Errors/ServicingError"

describe('The [InstanceServicingStrategy]', function() {
    it('should return an instance of the given reference target.', function() {
        class IntatiableFunction {};

        let resolutionContext:ResolutionContext = new ResolutionContext();
    
        let instanceServicingStrategy:InstanceServicingStrategy = new InstanceServicingStrategy();
        let servicingResult:any = instanceServicingStrategy.serve(resolutionContext, IntatiableFunction);

        assert.ok(servicingResult instanceof IntatiableFunction,
                 `The served instance is [${typeof servicingResult}] when it should be [${typeof IntatiableFunction}]`);
    })

    it('should return an instance of the given reference target and resolve its dependencies with the context origin container.', function() {        
        class IntatiableFunctionWithArgument { constructor(argument1:string) {} };

        let resolutionContext:ResolutionContext = new ResolutionContext();
        let containerMock:IMock<IContainer> = Mock.ofType<IContainer>();        
        containerMock.setup(x => x.resolve('argument1', It.isAny())).returns(() => {});
        resolutionContext.originContainer = containerMock.object;
    
        let instanceServicingStrategy:InstanceServicingStrategy = new InstanceServicingStrategy();
        let servicingResult:any = instanceServicingStrategy.serve(resolutionContext, IntatiableFunctionWithArgument);

        assert.ok(servicingResult instanceof IntatiableFunctionWithArgument,
                 `The served instance is [${typeof servicingResult}] when it should be [${typeof IntatiableFunctionWithArgument}]`);

        containerMock.verify(x => x.resolve('argument1', It.isAny()), Times.once());
    })  
    
    it('should throw an error if the given metadata reference target is not argumentable as a function, class or lambda.', function() { 
        assert.throws(() => {
            let resolutionContext:ResolutionContext = new ResolutionContext();

            let instanceServicingStrategy:InstanceServicingStrategy = new InstanceServicingStrategy();
            let servicingResult:any = instanceServicingStrategy.serve(resolutionContext, {});
        }, ServicingError);
    })

    require('./CommonArgumentableServicig.Test')(() => new InstanceServicingStrategy());
})