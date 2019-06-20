declare module "@tinajs/tina" {
  export function use(plugin: any): void

  type FunctionBindWith<T> = Record<string, (this: T, ...args: any[]) => void>

  export interface BaseDefinitions<T> {
    mixins: Array<Partial<T>>
    data: { [key: string]: any }
    compute: (data: { [key: string]: any }) => { [key: string]: any }
    methods: FunctionBindWith<T>
    setData(data: { [key: string]: any }): void
    /**
     * 小程序的实例
     */
    $source: any
  }

  export interface ComponentHooks {
    created: () => void
    attached: () => void
    ready: () => void
    moved: () => void
    detached: () => void
  }

  export interface ComponentDefinitions
    extends ComponentHooks,
      BaseDefinitions<ComponentDefinitions> {
    properties: { [key: string]: any }
    observers: FunctionBindWith<ComponentDefinitions>
    pageLifetimes: FunctionBindWith<ComponentDefinitions>

    triggerEvent(
      name: string,
      detail?: object,
      options?: {
        bubbles: boolean
        composed: boolean
        capturePhase: boolean
      }
    ): void
  }

  export class Component {
    static define(definitions: Partial<ComponentDefinitions>): void
    static mixin(definitions: Partial<ComponentDefinitions>): void
  }

  export interface PageHooks {
    beforeLoad: () => void
    onLoad: (options?: any) => void
    onReady: () => void
    onShow: () => void
    onHide: () => void
    onUnload: () => void
  }

  export interface PageEvents {
    onPullDownRefresh: () => void
    onReachBottom: () => void
    onShareAppMessage: (params: object) => void
    onPageScroll: ({ scrollTop: number }) => void
  }

  export interface PageDefinitions
    extends BaseDefinitions<PageDefinitions>,
      PageEvents,
      PageHooks {}

  export class Page {
    static define(definitions: Partial<PageDefinitions>): void
    static mixin(definitions: Partial<PageDefinitions>): void
  }
}
