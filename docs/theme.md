# Using the Custom Mantine Theme in Your Project

This document explains how to use the custom Mantine theme defined in `src/mantine.customTheme.ts` throughout your React project.

## Overview

The custom theme provides:

- Branded color palettes (e.g., `wm_green`, `wm_dk_blue`, etc.)
- A custom font family (`Hind Siliguri, sans-serif`)
- Global CSS variables for consistent shading (e.g., `--shade-1`)
- Component style overrides for Mantine components like `Input`, `Slider`, and `CloseButton`

The theme is integrated via Mantine's `MantineProvider` at the root of your app.

## How to Use the Theme

### 1. Accessing Theme Colors and Fonts

You can access theme colors and fonts in your components using Mantine's `useMantineTheme` hook or via the `theme` object in style functions.

Example using `useMantineTheme`:

```tsx
import { useMantineTheme } from '@mantine/core';

function MyComponent() {
  const theme = useMantineTheme();

  return (
    <div
      style={{ color: theme.colors.wm_green[6], fontFamily: theme.fontFamily }}
    >
      This text uses the custom green color and font.
    </div>
  );
}
```

### 2. Using Theme Colors in Styled Components or CSS

The theme defines global CSS variables for some colors and shades. You can use these variables in your styled-components or CSS:

```css
background-color: var(--shade-1);
color: var(--mantine-color-green-6);
```

### 3. Styling Mantine Components

The theme customizes Mantine components like `Input`, `Slider`, and `CloseButton`. When you use these components, they will automatically use the theme styles.

Example:

```tsx
import { Input, Slider, CloseButton } from '@mantine/core';

function Search() {
  return (
    <>
      <Input placeholder="Search..." />
      <Slider min={0} max={100} />
      <CloseButton aria-label="Close" />
    </>
  );
}
```

### 4. Overriding or Extending Theme Styles

If you need to customize styles further, you can use Mantine's `sx` prop or `styles` prop on components.

Example:

```tsx
<Input
  placeholder="Search..."
  sx={(theme) => ({
    borderRadius: 20,
    backgroundColor: theme.colors.wm_green[1]
  })}
/>
```

### 5. Using Theme in CSS-in-JS

When using styled-components or other CSS-in-JS libraries, you can combine theme values with your styles by accessing the theme via Mantine's `useMantineTheme` or by using CSS variables.

Example with styled-components:

```tsx
import styled from 'styled-components';
import { useMantineTheme } from '@mantine/core';

const StyledDiv = styled.div`
  background-color: var(--shade-1);
  color: var(--mantine-color-green-6);
  font-family: 'Hind Siliguri', sans-serif;
`;

function MyComponent() {
  return <StyledDiv>Styled with theme variables</StyledDiv>;
}
```

## Summary

- The custom theme is applied globally via `MantineProvider`.
- Use `useMantineTheme` to access theme values in your components.
- Use global CSS variables for consistent colors in styled-components or CSS.
- Mantine components automatically use the theme styles.
- Override styles with `sx` or `styles` props as needed.

This approach ensures a consistent, maintainable, and branded UI across your app.

For more details, see the [Mantine theming documentation](https://mantine.dev/theming/theme-object/).
