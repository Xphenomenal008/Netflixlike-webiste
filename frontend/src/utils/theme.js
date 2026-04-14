/**
 * Theme Configuration for Netflix Clone
 * Single source of truth for colors, spacing, and styling
 */

export const THEME = {
  colors: {
    primary: "#e50914",      // Netflix Red
    primaryDark: "#c4031f",
    primaryLight: "#f43f5e",
    secondary: "#221f1f",    // Netflix Black
    accent: "#a855f7",       // Purple accent
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
      muted: "#808080",
    },
    bg: {
      dark: "#000000",
      card: "rgba(34, 31, 31, 0.6)",
      hover: "rgba(196, 31, 50, 0.2)",
    },
    borders: {
      light: "rgba(255, 255, 255, 0.1)",
      medium: "rgba(255, 255, 255, 0.2)",
    },
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "1rem",
  },
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.5)",
    md: "0 4px 6px rgba(0, 0, 0, 0.7)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.8)",
  },
  transitions: {
    fast: "150ms ease-in-out",
    normal: "300ms ease-in-out",
    slow: "500ms ease-in-out",
  },
};

// Tailwind class generator
export const createButtonClass = (variant = "primary") => {
  const baseClasses =
    "px-4 py-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black";

  const variants = {
    primary: `bg-red-600 hover:bg-red-700 text-white ${baseClasses}`,
    secondary: `bg-slate-700 hover:bg-slate-600 text-white ${baseClasses}`,
    ghost: `bg-transparent hover:bg-white/10 text-white border border-white/20 ${baseClasses}`,
    danger: `bg-red-600 hover:bg-red-700 text-white ${baseClasses}`,
  };

  return variants[variant] || variants.primary;
};

export const createInputClass = (error = false) => {
  return `
    w-full bg-slate-700/50 hover:bg-slate-700 
    border ${error ? "border-red-500" : "border-slate-600"} 
    rounded-lg px-4 py-2 text-white placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
    transition-all duration-200
  `.trim();
};
