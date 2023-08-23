import {ResolveFn} from 'vite';
import {JsxParser} from './JsxParser';

export type ParseTools = {
  resolver: ResolveFn,
  tsxParser?: JsxParser,
};
