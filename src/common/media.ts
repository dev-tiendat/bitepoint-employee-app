export const MediaQueryBreakpoints = {
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400,
};

export const MediaQuery = {
  MOBILE: `@media (max-width: ${MediaQueryBreakpoints.SM}px)`,
  SM: `@media (min-width: ${MediaQueryBreakpoints.SM}px) and (max-width: ${MediaQueryBreakpoints.MD}px)`,
  MD: `@media (min-width: ${MediaQueryBreakpoints.MD}px) and (max-width: ${MediaQueryBreakpoints.LG}px)`,
  LG: `@media (min-width: ${MediaQueryBreakpoints.LG}px) and (max-width: ${MediaQueryBreakpoints.XL}px)`,
  XL: `@media (min-width: ${MediaQueryBreakpoints.XL}px) and (max-width: ${MediaQueryBreakpoints.XXL}px)`,
  XXL: `@media (min-width: ${MediaQueryBreakpoints.XXL}px)`,
  DESKTOP: `@media (min-width: ${MediaQueryBreakpoints.SM}px)`,
  MIN_MD: `@media (min-width: ${MediaQueryBreakpoints.MD}px)`,
  MIN_LG: `@media (min-width: ${MediaQueryBreakpoints.LG}px)`,
  XXL_XL: `@media (min-width: ${MediaQueryBreakpoints.XL}px)`,
  MOBILE_SM: `@media (max-width: ${MediaQueryBreakpoints.MD}px)`,
  MOBILE_SM_MD: `@media (max-width: ${MediaQueryBreakpoints.LG}px)`,
};
