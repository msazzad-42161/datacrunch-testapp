import { StatusBar, Dimensions, PixelRatio } from "react-native";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

// Function to scale values based on screen width
const scale = (size:number) => (width / 375) * size;

// Adjust pixel ratio for more precise scaling
const scaleFont = (size:number) => size * PixelRatio.getFontScale();

// Define your dynamic theme values
const COLORS = {
  accent1: "#4A90E2",   // Primary blue
  accent2: "#357ABD",   // Darker blue
  light1: "#E6F0FA",    // Very light blue
  light2: "#B3D1F7",    // Light blue
  dark1: "#2C3E50",     // Dark blue-gray
  dark2: "#1A232E",     // Even darker blue-gray
};

const SPACING = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(24),
  xxl: scale(36),
};

const FONTSIZE = {
  caption: scaleFont(10),
  body: scaleFont(12),
  subheading: scaleFont(16),
  title: scaleFont(20),
  heading: scaleFont(24),
  display: scaleFont(30),
};

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

export { COLORS, SPACING, FONTSIZE, STATUSBAR_HEIGHT };
