import system, {
  pad,
  gap,
  radius,
  shadow,
  font,
  browserStyles
} from "@-ui/system";
import styles from "@-ui/react";

const color = {
  dark: "#1d2326",
  med: "#373b3e",
  light: "#f2fafe"
};

export const variables = {
  color
};

styles.variables(variables);

system.use({
  pad: pad(),
  gap: gap(),
  font: font(
    {
      color: {
        body: color.dark
      },
      family: {
        brand: "Quantico, sans-serif",
        body: "Nunito, sans-serif"
      }
    },
    {
      logo: ({ font: { color, family } }) => `
          font-size: 1.5rem;
          font-weight: 900;
          font-family: ${family.brand};
          letter-spacing: -0.075em;
          color: ${color.body};
        `,
      body: ({ font: { color, family } }) => `
          font-size: 1rem;
          font-family: ${family.body};
          letter-spacing: -0.025em;
          color: ${color.body};
        `
    }
  ),
  radius: radius(),
  shadow: shadow()
});

styles.global(
  ({ color }) => `
      html,
      body {
        ${system.font.css("body")};
        background-color: ${color.light};
      }
  
      ${browserStyles}
    `
);

export const style = styles({
  masonic: `
      padding: 8px;
      width: 100%;
      max-width: 960px;
      margin: 163px auto;
    `,
  container: `
      min-height: 100vh;
      width: 100%;
    `,
  minify: ({ pad, color }) => `
      padding: ${pad.md};
      background-color: ${color.dark};
      color: ${color.light};
    `,
  header: ({ pad }) => `
      ${system.font.css("logo")};
      top: 0;
      position: fixed;
      padding: ${pad.xl};
      z-index: 1000;
      width: 100%;
      text-align: center;
      transition: padding 200ms ease-in-out, background-color 200ms 200ms linear;
    `,
  card: ({ shadow, color, pad, radius }) => `
      display: flex;
      flex-direction: column;
      background: ${color.dark};
      border-radius: ${radius.lg};
      justify-content: center;
      align-items: center;
      transition: transform 100ms ease-in-out;
      width: 100%;
  
      span:last-of-type {
        color: #fff;
        padding: ${pad.md};
      }
  
      &:hover {
        position: relative;
        background: ${color.light};
        transform: scale(1.125);
        z-index: 1000;
        box-shadow: ${shadow.lg};
  
        span:last-of-type {
          color: ${color.dark};
          padding: ${pad.md};
        }
      }
    `,
  img: ({ radius }) => `
      width: 100%;
      display: block;
      border-top-left-radius: ${radius.md};
      border-top-right-radius: ${radius.md};
      display: block;
    `
});

export { default as system } from "@-ui/system";
export { default as styles } from "@-ui/react";
