import { Inventory } from './inventory';
import { Slot } from './slot';

export type State = {
  leftInventory: Inventory;
  rightInventory: Inventory;
  itemAmount: number;
  shiftPressed: boolean;
  isBusy: boolean;
  additionalMetadata: Array<{ metadata: string; value: string }>;
  info?: {
    cash?: number;
    bank?: number;
    name?: string;
    health?: number;
    armor?: number;
    hunger?: number;
    thirst?: number;
    stress?: number;
  };
  history?: {
    leftInventory: Inventory;
    rightInventory: Inventory;
  };
};
