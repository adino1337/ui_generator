export default function getThemesStyle(theme) {
  const lightTheme = {
    bgSvetlejsia: "#413543",
    bgTmavsia: "#2D2727",
    field: "#8F43EE",
    secondary: "#F0EB8D",
    textPrimary: "white",
    textSecondary: "whitesmoke"
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
