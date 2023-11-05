/** @type {import('tailwindcss').Config} */
// const tailwindColors = require('tailwindcss/colors');
import tailwindColors from 'tailwindcss/colors';
// const colors = require('./src/colors.config.js');
import { colors } from './src/colors.config';
export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    colors: {
      ...tailwindColors,
      wm_dk_blue: {
        DEFAULT: colors.wm_dk_blue.DEFAULT,
        50: colors.wm_dk_blue[50],
        100: colors.wm_dk_blue[100],
        200: colors.wm_dk_blue[200],
        300: colors.wm_dk_blue[300],
        400: colors.wm_dk_blue[400],
        500: colors.wm_dk_blue[500],
        600: colors.wm_dk_blue[600],
        700: colors.wm_dk_blue[700],
        800: colors.wm_dk_blue[800],
        900: colors.wm_dk_blue[900]
      },
      wm_orange: {
        DEFAULT: colors.wm_orange.DEFAULT,
        50: colors.wm_orange[50],
        100: colors.wm_orange[100],
        200: colors.wm_orange[200],
        300: colors.wm_orange[300],
        400: colors.wm_orange[400],
        500: colors.wm_orange[500],
        600: colors.wm_orange[600],
        700: colors.wm_orange[700],
        800: colors.wm_orange[800],
        900: colors.wm_orange[900]
      },
      wm_lt_blue: {
        DEFAULT: colors.wm_lt_blue.DEFAULT,
        50: colors.wm_lt_blue[50],
        100: colors.wm_lt_blue[100],
        200: colors.wm_lt_blue[200],
        300: colors.wm_lt_blue[300],
        400: colors.wm_lt_blue[400],
        500: colors.wm_lt_blue[500],
        600: colors.wm_lt_blue[600],
        700: colors.wm_lt_blue[700],
        800: colors.wm_lt_blue[800],
        900: colors.wm_lt_blue[900]
      },
      wm_green: {
        DEFAULT: colors.wm_green.DEFAULT,
        50: colors.wm_green[50],
        100: colors.wm_green[100],
        200: colors.wm_green[200],
        300: colors.wm_green[300],
        400: colors.wm_green[400],
        500: colors.wm_green[500],
        600: colors.wm_green[600],
        700: colors.wm_green[700],
        800: colors.wm_green[800],
        900: colors.wm_green[900]
      },
      wm_red: {
        DEFAULT: colors.wm_red.DEFAULT,
        50: colors.wm_red[50],
        100: colors.wm_red[100],
        200: colors.wm_red[200],
        300: colors.wm_red[300],
        400: colors.wm_red[400],
        500: colors.wm_red[500],
        600: colors.wm_red[600],
        700: colors.wm_red[700],
        800: colors.wm_red[800],
        900: colors.wm_red[900]
      },
      wm_lt_grey: {
        DEFAULT: colors.wm_lt_grey.DEFAULT,
        50: colors.wm_lt_grey[50],
        100: colors.wm_lt_grey[100],
        200: colors.wm_lt_grey[200],
        300: colors.wm_lt_grey[300],
        400: colors.wm_lt_grey[400],
        500: colors.wm_lt_grey[500],
        600: colors.wm_lt_grey[600],
        700: colors.wm_lt_grey[700],
        800: colors.wm_lt_grey[800],
        900: colors.wm_lt_grey[900]
      }
    },
    extend: {}
  },
  plugins: []
};
