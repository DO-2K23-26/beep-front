import { Config } from "@markdoc/markdoc";
import Callout from "../ui/custom-markdown/Callout";



export interface Callout {
    render: string;
    children: string[];
    attributes: {
        type: {
            type: StringConstructor;
            default: string;
            matches: ["caution", "check", "note", "warning"];
            errorLevel: 'critical';
        };
        title: {
            type: StringConstructor;
        };
    };

}

export const callout: Callout = {
    render: 'Callout',
    children: ['paragraph', 'tag', 'list'],
    attributes: {
      type: {
        type: String,
        default: 'note',
        matches: ['caution', 'check', 'note', 'warning'],
        errorLevel: 'critical'
      },
      title: {
        type: String
      }
    }
  };


export const config: Config = {
    tags: {
        callout
    }
};

export const markdownComponents = {
    Callout: Callout
}