import { alpha } from '@mui/material/styles';

// Function to generate alpha shades for a given color
const withAlphas = (color) => {
  return {
    ...color,
    alpha4: alpha(color.main, 0.04),
    alpha8: alpha(color.main, 0.08),
    alpha12: alpha(color.main, 0.12),
    alpha30: alpha(color.main, 0.30),
    alpha50: alpha(color.main, 0.50)
  };
};

export const neutral = {
  50: '#F8F9FA', // Very light gray
  100: '#F3F4F6', // Light gray
  200: '#E5E7EB', // Medium light gray
  300: '#D2D6DB', // Medium gray
  400: '#9DA4AE', // Medium dark gray
  500: '#6C737F', // Dark gray
  600: '#4D5761', // very dark gray
  700: '#2F3746', // Almost black
  800: '#1C2536', //Darker black
  900: '#111927' // Darkest black
};

export const indigo = withAlphas({
  lightest: '#F5F7FF', // Very light blue
  light: '#EBEEFE', // Light blue
  main: '#6366F1', // Indigo blue
  dark: '#4338CA', // Dark blue
  darkest: '#312E81', // Very dark blue
  contrastText: '#FFFFFF' // White
});

export const teal = withAlphas({
  lightest: '#E0F2F1', // very light teal
  light: '#B2DFDB', // Light teal
  main: '#26A69A', // Teal
  dark: '#00796B', // Dark teal
  darkest: '#004D40', // Very dark teal
  contrastText: '#FFFFFF' // White
});

export const orange = withAlphas({
  lightest: '#FFF3E0', // Very light orange
  light: '#FFCC80',  // Light orange
  main: '#FF5722', // Orange
  dark: '#E64A19', // Dark orange
  darkest: '#BF360C', // Very dark orange
  contrastText: '#FFFFFF' // White
});

export const amber = withAlphas({
  lightest: '#FFF8E1', // Very light amber
  light: '#FFD54F', // Light amber
  main: '#FFC107', // Amber
  dark: '#FFA000', // Dark amber
  darkest: '#FF6F00', // Very dark amber
  contrastText: '#FFFFFF' // White
});

export const blue = withAlphas({
  lightest: '#E8EAF6', // Very light blue
  light: '#7986CB', // Light blue
  main: '#3F51B5', // Blue
  dark: '#303F9F', // Dark blue
  darkest: '#1A237E', // Very dark blue
  contrastText: '#FFFFFF' // White
});


export const success = withAlphas({
  lightest: '#F0FDF9', // Very light green
  light: '#3FC79A', // Light green
  main: '#10B981', // Green
  dark: '#0B815A', // Dark green
  darkest: '#134E48', // Very dark green
  contrastText: '#FFFFFF' // White
});

export const info = withAlphas({
  lightest: '#ECFDFF', // Very light blue
  light: '#CFF9FE', // Light blue
  main: '#06AED4', // Info blue
  dark: '#0E7090', // Dark blue
  darkest: '#164C63', // Very dark blue
  contrastText: '#FFFFFF' // White
});

export const warning = withAlphas({
  lightest: '#FFFAEB', // Very light yellow
  light: '#FEF0C7', // Light yellow
  main: '#F79009', // Warning yellow
  dark: '#B54708', // Dark yellow
  darkest: '#7A2E0E', // Very dark yellow
  contrastText: '#FFFFFF' // White
});

export const error = withAlphas({
  lightest: '#FEF3F2', // Very light red
  light: '#FEE4E2', // Light red
  main: '#F04438', // Warning red
  dark: '#B42318', // Dark red
  darkest: '#7A271A', // Very dark red
  contrastText: '#FFFFFF' // White
});

export const gray = withAlphas({
  lightest: '#F5F5F5', // Very light gray
  light: '#CCCCCC', // Light gray
  main: '#9E9E9E', // Gray
  dark: '#757575', // Dark gray
  darkest: '#424242', // Very dark gray
  contrastText: '#FFFFFF' // White
});
