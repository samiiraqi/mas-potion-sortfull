export type Theme = 'light' | 'dark' | 'ocean' | 'sunset';

interface ThemeColors {
  background: string;
  primary: string;
  secondary: string;
  text: string;
  accent: string;
}

const themes: Record<Theme, ThemeColors> = {
  light: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primary: '#667eea',
    secondary: '#764ba2',
    text: '#ffffff',
    accent: '#FFD700'
  },
  dark: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    primary: '#1a1a2e',
    secondary: '#0f3460',
    text: '#ffffff',
    accent: '#e94560'
  },
  ocean: {
    background: 'linear-gradient(135deg, #0077be 0%, #00a8cc 100%)',
    primary: '#0077be',
    secondary: '#00a8cc',
    text: '#ffffff',
    accent: '#00d9ff'
  },
  sunset: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
    primary: '#ff6b6b',
    secondary: '#feca57',
    text: '#ffffff',
    accent: '#ff9ff3'
  }
};

export const themeManager = {
  getTheme(themeName: Theme = 'light'): ThemeColors {
    return themes[themeName] || themes.light;
  },

  saveTheme(themeName: Theme) {
    localStorage.setItem('theme', themeName);
  },

  loadTheme(): Theme {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  },

  getAllThemes(): Theme[] {
    return Object.keys(themes) as Theme[];
  }
};
