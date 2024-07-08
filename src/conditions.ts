/*!
 * Portions of the following code are based on code from panda.
 * Original licensing can be found in the NOTICE file in the root directory of this source tree.
 * See: https://github.com/chakra-ui/panda/blob/933eef8edf13db6e4ace6dc1a8d2bbbd4fad3d4a/packages/preset-base/src/conditions.ts
 */
const pandaBaseConditions: Record<string, Array<string>> = {
  hover: ["[data-hover]"],
  focus: ["[data-focus]"],
  focusVisible: ["[data-focus-visible]"],
  disabled: ["[disabled]", "[data-disabled]"],
  readOnly: ["[data-read-only]"],
  empty: ["[data-empty]"],

  indeterminate: ["[data-indeterminate]"],
  required: ["[data-required]"],
  invalid: ["[data-invalid]"],
  focusWithin: ["[data-focus-within]"],
};

/*!
 * Portions of the following code are based on code from Adobe.
 * Original licensing can be found in the NOTICE file in the root directory of this source tree.
 * See: https://github.com/adobe/react-spectrum/tree/b46d23b9919eaec8ab1f621b52beced82e88b6ca/packages/tailwindcss-react-aria-components
 */
const racAttributes = {
  boolean: {
    // Conditions
    allowsRemoving: "allows-removing",
    allowsSorting: "allows-sorting",
    allowsDragging: "allows-dragging",
    hasSubmenu: "has-submenu",

    // States
    open: "open",
    entering: "entering",
    exiting: "exiting",
    indeterminate: "indeterminate",
    placeholderShown: "placeholder",
    current: "current",
    required: "required",
    unavailable: "unavailable",
    invalid: "invalid",
    readOnly: "readonly",
    outsideMonth: "outside-month",
    outsideVisibleRange: "outside-visible-range",

    // Content
    empty: "empty",

    // Interactive states
    focusWithin: "focus-within",
    hover: "hovered",
    focus: "focused",
    focusVisible: "focus-visible",
    pressed: "pressed",
    selected: "selected",
    selectionStart: "selection-start",
    selectionEnd: "selection-end",
    dragging: "dragging",
    dropTarget: "drop-target",
    resizing: "resizing",
    disabled: "disabled",
  },
  enum: {
    placement: ["left", "right", "top", "bottom"],
    type: ["literal", "year", "month", "day"],
    layout: ["grid", "stack"],
    // redundant if using Panda Preset Base, but no harm in keeping it
    orientation: ["horizontal", "vertical"],
    selection: {
      attributeName: "selection-mode",
      values: ["single", "multiple"],
    },
    resizable: {
      attributeName: "resizable-direction",
      values: ["right", "left", "both"],
    },
    sort: {
      attributeName: "sort-direction",
      values: ["ascending", "descending"],
    },
  },
};

const nativeConditions: Record<string, string> = {
  indeterminate: ":indeterminate",
  required: ":required",
  invalid: ":invalid",
  empty: ":empty",
  focusVisible: ":focus-visible",
  focusWithin: ":focus-within",
  disabled: ":disabled",
  hover: ":hover",
  focus: ":focus",
  readOnly: ":read-only",
  open: "[open]",
};

// Conditions where both native and RAC attributes should apply.
const nativeMergeSelectors: Record<string, string> = {
  placeholderShown: ":placeholder-shown",
};

// Create the condition keys based on prefix (if any) and the attribute name
// e.g. createKey("rac", "placement", "right") => "racPlacementRight"
const createKey = (...args: Array<string>) =>
  args
    .filter(Boolean)
    .map((str, i) => (i === 0 ? str : str[0].toUpperCase() + str.slice(1)))
    .join("");

const getSelectors = (
  includePandaPresetBase: boolean,
  prefix: string,
  conditionName: string,
  attributeName: string,
  attributeValue?: string
) => {
  const baseSelector = attributeValue
    ? `[data-${attributeName}="${attributeValue}"]`
    : `[data-${attributeName}]`;
  const nativeSelector = nativeConditions[conditionName];
  const selector = nativeSelector || baseSelector;

  const pandaConditions = pandaBaseConditions[conditionName];

  const conditions =
    includePandaPresetBase && pandaConditions
      ? `:is(${selector}, ${pandaConditions.join(", ")})`
      : selector;

  // If a prefix is specified, we don't merge with Panda Preset Base conditions or native conditions.
  if (!prefix && nativeSelector) {
    return [
      `:where([data-rac])${baseSelector}`,
      `:where(:not([data-rac]))${conditions}`,
    ];
  } else if (!prefix && nativeMergeSelectors[conditionName]) {
    return [`${conditions}`, `${nativeMergeSelectors[conditionName]}`];
  } else {
    return [`${baseSelector}`];
  }
};

export const createConditions = ({
  prefix = "",
  includePandaPresetBase = true,
  includeCombinators = true,
}) => {
  const conditions: Record<string, Array<string>> = {};

  for (const [conditionName, attributeName] of Object.entries(
    racAttributes.boolean
  )) {
    conditions[conditionName] = getSelectors(
      includePandaPresetBase,
      prefix,
      conditionName,
      attributeName
    );
  }

  for (const [conditionName, value] of Object.entries(racAttributes.enum)) {
    const attributeName = Array.isArray(value)
      ? conditionName
      : value.attributeName;
    const values = Array.isArray(value) ? value : value.values;

    for (const attributeValue of values) {
      conditions[createKey(conditionName, attributeValue)] = getSelectors(
        includePandaPresetBase,
        prefix,
        null,
        attributeName,
        attributeValue
      );
    }
  }

  return Object.entries(conditions).reduce<Record<string, string>>(
    (acc, [conditionName, selectors]) => {
      acc[createKey(prefix, conditionName)] = selectors
        .map((selector) => `&${selector}`)
        .join(", ");

      if (includeCombinators) {
        acc[createKey(prefix, "group", conditionName)] = selectors
          .map((selector) => `.group${selector} &`)
          .join(", ");
        acc[createKey(prefix, "peer", conditionName)] = selectors
          .map((selector) => `.peer${selector} ~ &`)
          .join(", ");
      }

      return acc;
    },
    {}
  );
};
