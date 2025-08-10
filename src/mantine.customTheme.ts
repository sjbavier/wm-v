import { createTheme, MantineThemeOverride, MantineTheme } from '@mantine/core';
import { colors } from './colors.config';

export const customTheme: MantineThemeOverride = createTheme({
  fontFamily: 'Hind Siliguri, sans-serif',
  colors: {
    wm_dk_blue: [
      colors.wm_dk_blue[50],
      colors.wm_dk_blue[100],
      colors.wm_dk_blue[200],
      colors.wm_dk_blue[300],
      colors.wm_dk_blue[400],
      colors.wm_dk_blue[500],
      colors.wm_dk_blue[600],
      colors.wm_dk_blue[700],
      colors.wm_dk_blue[800],
      colors.wm_dk_blue[900]
    ],
    wm_orange: [
      colors.wm_orange[50],
      colors.wm_orange[100],
      colors.wm_orange[200],
      colors.wm_orange[300],
      colors.wm_orange[400],
      colors.wm_orange[500],
      colors.wm_orange[600],
      colors.wm_orange[700],
      colors.wm_orange[800],
      colors.wm_orange[900]
    ],
    wm_lt_blue: [
      colors.wm_lt_blue[50],
      colors.wm_lt_blue[100],
      colors.wm_lt_blue[200],
      colors.wm_lt_blue[300],
      colors.wm_lt_blue[400],
      colors.wm_lt_blue[500],
      colors.wm_lt_blue[600],
      colors.wm_lt_blue[700],
      colors.wm_lt_blue[800],
      colors.wm_lt_blue[900]
    ],
    wm_green: [
      colors.wm_green[50],
      colors.wm_green[100],
      colors.wm_green[200],
      colors.wm_green[300],
      colors.wm_green[400],
      colors.wm_green[500],
      colors.wm_green[600],
      colors.wm_green[700],
      colors.wm_green[800],
      colors.wm_green[900]
    ],
    wm_red: [
      colors.wm_red[50],
      colors.wm_red[100],
      colors.wm_red[200],
      colors.wm_red[300],
      colors.wm_red[400],
      colors.wm_red[500],
      colors.wm_red[600],
      colors.wm_red[700],
      colors.wm_red[800],
      colors.wm_red[900]
    ],
    wm_lt_grey: [
      colors.wm_lt_grey[50],
      colors.wm_lt_grey[100],
      colors.wm_lt_grey[200],
      colors.wm_lt_grey[300],
      colors.wm_lt_grey[400],
      colors.wm_lt_grey[500],
      colors.wm_lt_grey[600],
      colors.wm_lt_grey[700],
      colors.wm_lt_grey[800],
      colors.wm_lt_grey[900]
    ]
  },
  primaryColor: 'wm_green',
  globalStyles: (theme) => ({
    ':root': {
      '--shade-1': theme.colors.wm_dk_blue[7], // approximate to var(--shade-1) used in styled components
      '--mantine-color-green-3': theme.colors.wm_green[3],
      '--mantine-color-green-5': theme.colors.wm_green[5],
      '--mantine-color-green-6': theme.colors.wm_green[6]
    }
  }),
  components: {
    Input: {
      styles: {
        input: {
          borderRadius: 12,
          backgroundColor: 'var(--shade-1)',
          borderColor: 'rgba(25, 154, 102, 0.5)', // wm_green[6] rgba approximation
          color: 'rgba(25, 154, 102, 0.2)', // wm_green[5] lighten approximation
          '&:hover': {
            borderColor: 'rgba(25, 154, 102, 0.88)',
            color: 'rgba(25, 154, 102, 0.3)',
            backgroundColor: 'transparent'
          }
        }
      }
    },
    Slider: {
      styles: {
        bar: {
          backgroundColor: 'rgba(25, 154, 102, 0.88)',
          '&:hover': {
            backgroundColor: 'rgba(25, 154, 102, 0.66)'
          }
        },
        thumb: {
          borderColor: 'rgba(25, 154, 102, 0.88)'
        }
      }
    },
    CloseButton: {
      styles: {
        root: {
          backgroundColor: 'transparent',
          borderColor: 'rgba(25, 154, 102, 0.5)',
          color: 'rgba(25, 154, 102, 0.2)',
          '&:hover': {
            borderColor: 'rgba(25, 154, 102, 0.88)',
            color: 'rgba(25, 154, 102, 0.3)',
            backgroundColor: 'transparent'
          }
        }
      }
    }
  }
});
