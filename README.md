# pandacss-react-aria-components

A [Panda](https://panda-css.com/) preset for [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html) (RAC) to make styling states of components easier, with autocompleting conditions courtesy of Panda.

## Installation

```bash
npm i -D pandacss-react-aria-components
# or
yarn add -D pandacss-react-aria-components
# or
pnpm add -D pandacss-react-aria-components
```

## Usage

Add the preset to your `panda.config.js` file.

```js
import { defineConfig } from "@pandacss/dev";
import racPreset from "pandacss-react-aria-components";

export default defineConfig({
  presets: [racPreset()],
});
```

With the preset added, you can now access all states easily.

```jsx
<div className={css({
  _selected: {
    background: "blue.500"
  },
  _disabled: {
    background: "gray.100"
  }
})}>
```

## Options

```js
// default config
export default defineConfig({
  presets: [
    racPreset({
      includePandaPresetBase: true,
      prefix: "",
      includeCombinators: true,
    }),
  ],
});
```

### Panda Preset Base (`includePandaPresetBase`)

By default, Panda provides conditions of their own within `@pandacss/preset-base` that overlap with RAC. These conditions can be merged gracefully with RAC, applying conditionally based on whether the element belongs to a RAC component.

### Prefix (`prefix`)

Assign a prefix for the conditions. This will disable merging with `@pandacss/preset-base` conditions as it is no longer necessary.

### Combinators (`includeCombinators`)

Add new variants for Tailwind-like group and peer combinators, such as `_groupFocusWithin` and `_peerSelected`. `@pandacss/preset-base` provides a few that won't be overridden to support RAC if this is set to `false`.

## Acknowledgements

- [tailwindcss-react-aria-components](https://github.com/adobe/react-spectrum/tree/main/packages/tailwindcss-react-aria-components) - forms the basis of this project
- [@pandacss/preset-base](https://github.com/chakra-ui/panda/tree/main/packages/preset-base) - source of conditions provided by the preset

## License

BSD Zero Clause License

Please note the other licenses present within the NOTICE file.
