import { Preset } from "@pandacss/types";
import { createConditions } from "./conditions";

const definePreset = <T extends Preset>(preset: T) => preset;

export interface PresetOptions {
  /**
   * Assign a prefix for the conditions. This will disable merging with `@pandacss/preset-base` conditions.
   */
  prefix?: string;
  /**
   * Merge React Aria Components base variants with `@pandacss/preset-base` conditions.
   * @default true
   */
  includePandaPresetBase?: boolean;
  /**
   * Add new variants for Tailwind-like group and peer combinators, such as `_groupFocusWithin` and `_peerSelected`.
   * `@pandacss/preset-base` provides a few that won't be overridden to support RAC if this is set to `false`.
   * @default true
   */
  includeCombinators?: boolean;
}

const createPreset = (options: PresetOptions = {}): Preset =>
  definePreset({
    name: 'pandacss-react-aria-components',
    conditions: {
      extend: createConditions(options),
    },
  });

export default createPreset;
