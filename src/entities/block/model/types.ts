import type { IngredientType } from '../../../shared/types';

export const BLOCK_H = 36; // py-2 min-h-9 rendered height

let _uid = 0;
export const mkBlockId = () => `b${++_uid}`;
export const mkChainId = () => `ch${++_uid}`;

export interface CBItem  { id: string; type: IngredientType }
export interface CBChain { id: string; x: number; y: number; items: CBItem[] }
