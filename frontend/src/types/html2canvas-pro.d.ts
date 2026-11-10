declare module "html2canvas-pro" {
  export interface Html2CanvasOptions {
    backgroundColor?: string | null;
    scale?: number;
    logging?: boolean;
    useCORS?: boolean;
    allowTaint?: boolean;
    width?: number;
    height?: number;
    windowWidth?: number;
    windowHeight?: number;
    scrollX?: number;
    scrollY?: number;
    ignoreElements?: (element: Element) => boolean;
  }

  export default function html2canvas(
    element: HTMLElement,
    options?: Html2CanvasOptions
  ): Promise<HTMLCanvasElement>;
}
