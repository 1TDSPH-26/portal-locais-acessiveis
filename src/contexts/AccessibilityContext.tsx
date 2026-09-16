import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

type ContrastMode = "normal" | "high";

interface AccessibilityContextValue {
  fontScale: number;
  contrast: ContrastMode;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleContrast: () => void;
  resetAccessibility: () => void;
}

const AccessibilityContext =
  createContext<AccessibilityContextValue | null>(null);

const min_Font_Scale = 1;
const max_Font_Scale = 1.5;
const font_Step = 0.1;

export function AccessibilityProvider({
  children,
}: PropsWithChildren) {
  const [fontScale, setFontScale] = useState(min_Font_Scale);
  const [contrast, setContrast] = useState<ContrastMode>("normal");

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--accessibility-font-scale",
      String(fontScale),
    );

    document.documentElement.dataset.contrast = contrast;
  }, [fontScale, contrast]);

  const value = useMemo(
    () => ({
      fontScale,
      contrast,

      increaseFontSize: () => {
        setFontScale((current) =>
          Math.min(current + font_Step, max_Font_Scale),
        );
      },

      decreaseFontSize: () => {
        setFontScale((current) =>
          Math.max(current - font_Step, min_Font_Scale),
        );
      },

      toggleContrast: () => {
        setContrast((current) =>
          current === "normal" ? "high" : "normal",
        );
      },

      resetAccessibility: () => {
        setFontScale(min_Font_Scale);
        setContrast("normal");
      },
    }),
    [fontScale, contrast],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error(
      "useAccessibility deve ser utilizado dentro de AccessibilityProvider",
    );
  }

  return context;
}
