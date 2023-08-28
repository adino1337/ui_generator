export default function getThemesStyle(theme) {
  const lightTheme = {
    bgSvetlejsia: "#fff",
    bgTmavsia: "#e2e2e2",
    field: "#1565c0",
    secondary: "#1565c0",
    textPrimary: "white",
    textSecondary: "#101010"
  };
  const darkTheme = {
    bgSvetlejsia: "#413543",
    bgTmavsia: "#2D2727",
    field: "#8F43EE",
    secondary: "#F0EB8D",
    textPrimary: "white",
    textSecondary: "whitesmoke"
  };
  switch (theme) {
    case "light":
      return lightTheme;
    case "dark":
      return darkTheme;
    default:
      return lightTheme;
  }
}
