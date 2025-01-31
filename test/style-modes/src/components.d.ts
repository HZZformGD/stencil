/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "stencil-hotfix/internal";
export namespace Components {
    interface AppRoot {
    }
    interface ScopedMode {
        /**
          * This is the mode
         */
        "mode"?: 'buford' | 'griff';
    }
    interface ShadowMode {
        /**
          * This is the mode
         */
        "mode"?: 'buford' | 'griff';
    }
}
declare global {
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLScopedModeElement extends Components.ScopedMode, HTMLStencilElement {
    }
    var HTMLScopedModeElement: {
        prototype: HTMLScopedModeElement;
        new (): HTMLScopedModeElement;
    };
    interface HTMLShadowModeElement extends Components.ShadowMode, HTMLStencilElement {
    }
    var HTMLShadowModeElement: {
        prototype: HTMLShadowModeElement;
        new (): HTMLShadowModeElement;
    };
    interface HTMLElementTagNameMap {
        "app-root": HTMLAppRootElement;
        "scoped-mode": HTMLScopedModeElement;
        "shadow-mode": HTMLShadowModeElement;
    }
}
declare namespace LocalJSX {
    interface AppRoot {
    }
    interface ScopedMode {
        /**
          * This is the mode
         */
        "mode"?: 'buford' | 'griff';
    }
    interface ShadowMode {
        /**
          * This is the mode
         */
        "mode"?: 'buford' | 'griff';
    }
    interface IntrinsicElements {
        "app-root": AppRoot;
        "scoped-mode": ScopedMode;
        "shadow-mode": ShadowMode;
    }
}
export { LocalJSX as JSX };
declare module "stencil-hotfix" {
    export namespace JSX {
        interface IntrinsicElements {
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "scoped-mode": LocalJSX.ScopedMode & JSXBase.HTMLAttributes<HTMLScopedModeElement>;
            "shadow-mode": LocalJSX.ShadowMode & JSXBase.HTMLAttributes<HTMLShadowModeElement>;
        }
    }
}
