/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "stencil-hotfix/internal";
export namespace Components {
    interface HelloVdom {
    }
}
declare global {
    interface HTMLHelloVdomElement extends Components.HelloVdom, HTMLStencilElement {
    }
    var HTMLHelloVdomElement: {
        prototype: HTMLHelloVdomElement;
        new (): HTMLHelloVdomElement;
    };
    interface HTMLElementTagNameMap {
        "hello-vdom": HTMLHelloVdomElement;
    }
}
declare namespace LocalJSX {
    interface HelloVdom {
    }
    interface IntrinsicElements {
        "hello-vdom": HelloVdom;
    }
}
export { LocalJSX as JSX };
declare module "stencil-hotfix" {
    export namespace JSX {
        interface IntrinsicElements {
            "hello-vdom": LocalJSX.HelloVdom & JSXBase.HTMLAttributes<HTMLHelloVdomElement>;
        }
    }
}
