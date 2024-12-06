import * as React from "react";

/**
 * This is copied from
 * https://github.com/davidhu2000/react-spinners/
 *
 *
 */

interface LengthObject {
  value: number;
  unit: string;
}

const cssUnit: { [unit: string]: boolean } = {
  cm: true,
  mm: true,
  in: true,
  px: true,
  pt: true,
  pc: true,
  em: true,
  ex: true,
  ch: true,
  rem: true,
  vw: true,
  vh: true,
  vmin: true,
  vmax: true,
  "%": true,
};

/**
 * If size is a number, append px to the value as default unit.
 * If size is a string, validate against list of valid units.
 * If unit is valid, return size as is.
 * If unit is invalid, console warn issue, replace with px as the unit.
 *
 * @param {(number | string)} size
 * @return {LengthObject} LengthObject
 */
export function parseLengthAndUnit(size: number | string): LengthObject {
  if (typeof size === "number") {
    return {
      value: size,
      unit: "px",
    };
  }
  let value: number;
  const valueString: string = (size.match(/^[0-9.]*/) || "").toString();
  if (valueString.includes(".")) {
    value = parseFloat(valueString);
  } else {
    value = parseInt(valueString, 10);
  }

  const unit: string = (size.match(/[^0-9]*$/) || "").toString();

  if (cssUnit[unit]) {
    return {
      value,
      unit,
    };
  }

  console.warn(
    `React Spinners: ${size} is not a valid css value. Defaulting to ${value}px.`
  );

  return {
    value,
    unit: "px",
  };
}

/**
 * Take value as an input and return valid css value
 *
 * @param {(number | string)} value
 * @return {string} valid css value
 */
export function cssValue(value: number | string): string {
  const lengthWithunit = parseLengthAndUnit(value);

  return `${lengthWithunit.value}${lengthWithunit.unit}`;
}

export const createAnimation = (
  loaderName: string,
  frames: string,
  suffix: string
): string => {
  const animationName = `react-spinners-${loaderName}-${suffix}`;

  if (typeof window == "undefined" || !window.document) {
    return animationName;
  }

  const styleEl = document.createElement("style");
  document.head.appendChild(styleEl);
  const styleSheet = styleEl.sheet;

  const keyFrames = `
      @keyframes ${animationName} {
        ${frames}
      }
    `;

  if (styleSheet) {
    styleSheet.insertRule(keyFrames, 0);
  }

  return animationName;
};

import { CSSProperties, DetailedHTMLProps, HTMLAttributes } from "react";

export type LengthType = number | string;

interface CommonProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  color?: string;
  loading?: boolean;
  cssOverride?: CSSProperties;
  speedMultiplier?: number;
}

export interface LoaderHeightWidthProps extends CommonProps {
  height?: LengthType;
  width?: LengthType;
}

export interface LoaderSizeProps extends CommonProps {
  size?: LengthType;
}

export interface LoaderSizeMarginProps extends CommonProps {
  size?: LengthType;
  margin?: LengthType;
}

export interface LoaderHeightWidthRadiusProps extends CommonProps {
  height?: LengthType;
  width?: LengthType;
  radius?: LengthType;
  margin?: LengthType;
}

enum BasicColors {
  maroon = "#800000",
  red = "#FF0000",
  orange = "#FFA500",
  yellow = "#FFFF00",
  olive = "#808000",
  green = "#008000",
  purple = "#800080",
  fuchsia = "#FF00FF",
  lime = "#00FF00",
  teal = "#008080",
  aqua = "#00FFFF",
  blue = "#0000FF",
  navy = "#000080",
  black = "#000000",
  gray = "#808080",
  silver = "#C0C0C0",
  white = "#FFFFFF",
}

const handleRgbColorString = (color: string, opacity: number): string => {
  // rgb(a)(255 255 255 / 80%)
  if (color.includes("/")) {
    return color.replace("rgb(", "rgba(");
  }

  const rgbValues = color
    .substring(color.startsWith("rgba(") ? 5 : 4, color.length - 1)
    .trim();
  const splittedByCommas = rgbValues.split(",");

  // rgb(a)(255, 255, 255, 0.8)
  if (splittedByCommas.length === 4) {
    return color.replace("rgb(", "rgba(");
  }

  // rgb(a)(255, 255, 255)
  if (splittedByCommas.length === 3) {
    return `rgba(${rgbValues}, ${opacity})`;
  }

  // rgb(a)(255 255 255)
  return `rgba(${rgbValues} / ${opacity})`;
};

export const calculateRgba = (color: string, opacity: number): string => {
  if (color.startsWith("rgb")) {
    return handleRgbColorString(color, opacity);
  }

  if (Object.keys(BasicColors).includes(color)) {
    color = BasicColors[color as keyof typeof BasicColors];
  }

  if (color[0] === "#") {
    color = color.slice(1);
  }

  if (color.length === 3) {
    let res = "";
    color.split("").forEach((c: string) => {
      res += c;
      res += c;
    });
    color = res;
  }

  const rgbValues: string = (color.match(/.{2}/g) || [])
    .map((hex: string) => parseInt(hex, 16))
    .join(", ");

  return `rgba(${rgbValues}, ${opacity})`;
};

const long = createAnimation(
  "BarLoader",
  `0% {left: -35%;right: 100%} 60% {left: 100%;right: -90%} 100% {left: 100%;right: -90%}`,
  "long"
);

const short = createAnimation(
  "BarLoader",
  `0% {left: -200%;right: 100%} 60% {left: 107%;right: -8%} 100% {left: 107%;right: -8%}`,
  "short"
);

function BarLoader({
  loading = true,
  color = "#0a66c2",
  speedMultiplier = 1,
  cssOverride = {},
  height = 4,
  width = 100,
  ...additionalprops
}: LoaderHeightWidthProps): JSX.Element | null {
  const wrapper: React.CSSProperties = {
    display: "inherit",
    position: "relative",
    width: cssValue(width),
    height: cssValue(height),
    overflow: "hidden",
    backgroundColor: calculateRgba(color, 0.2),
    backgroundClip: "padding-box",
    ...cssOverride,
  };

  const style = (i: number): React.CSSProperties => {
    return {
      position: "absolute",
      height: cssValue(height),
      overflow: "hidden",
      backgroundColor: color,
      backgroundClip: "padding-box",
      display: "block",
      borderRadius: 2,
      willChange: "left, right",
      animationFillMode: "forwards",
      animation: `${i === 1 ? long : short} ${2.1 / speedMultiplier}s ${i === 2 ? `${1.15 / speedMultiplier}s` : ""} ${
        i === 1
          ? "cubic-bezier(0.65, 0.815, 0.735, 0.395)"
          : "cubic-bezier(0.165, 0.84, 0.44, 1)"
      } infinite`,
    };
  };

  if (!loading) {
    return null;
  }

  return (
    <span style={wrapper} {...additionalprops}>
      <span style={style(1)} />
      <span style={style(2)} />
    </span>
  );
}

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-[400px]">
      <h1 className="flex items-center justify-center text-4xl font-extrabold text-[#0a66c2]">
        Link
        <img src="/images/linkedin.png" alt="logo" width={40} height={40} />
        Purry
      </h1>
      <BarLoader />
    </div>
  );
}
