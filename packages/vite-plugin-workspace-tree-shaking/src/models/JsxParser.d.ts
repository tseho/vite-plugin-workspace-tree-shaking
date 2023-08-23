import {SourceFileInfo} from './SourceFileInfo';

export type JsxParser = (content: string) => Promise<SourceFileInfo>;
