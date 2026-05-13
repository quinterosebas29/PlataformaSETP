// Tokens de tipografía del design system SETP SM

export const typography = {
  display: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '26px',
    lineHeight: '1.2',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '21px',
    lineHeight: '1.3',
  },
  etaLarge: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '22px',
    lineHeight: '1.2',
  },
  body: {
    fontFamily: 'var(--font-body)',
    fontWeight: 400,
    fontSize: '15px',
    lineHeight: '1.5',
  },
  bodySmall: {
    fontFamily: 'var(--font-body)',
    fontWeight: 400,
    fontSize: '13px',
    lineHeight: '1.4',
  },
  button: {
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: '15px',
    lineHeight: '1',
  },
} as const;
