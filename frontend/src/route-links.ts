export const routePaths = {
  home: '/',
  shorten: '/shorten',
} as const

export const pageLinks = [
  { label: 'Home', to: routePaths.home },
  { label: 'Shorten a URL', to: routePaths.shorten },
] as const
