declare module "gsap/SplitText" {
  export class SplitText {
    constructor(target: any, vars?: any);
    split(vars?: any): this;
    revert(): this;
    chars: HTMLElement[];
    words: HTMLElement[];
    lines: HTMLElement[];
    masks?: HTMLElement[];
    [key: string]: any;
  }
}
