import { NodeType, parse } from 'node-html-parser';

export class Helpers {
  static findHTMLProp(obj: any): string {
    let propHTMLContent = '';
    for (const key in obj) {
      const doc = parse(obj[key]);
      if (doc.nodeType === NodeType.ELEMENT_NODE) {
        propHTMLContent = doc.outerHTML;
        break;
      }
    }
    return propHTMLContent;
  }
}
