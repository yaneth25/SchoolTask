/** Paleta modo claro (por defecto) */
export const LIGHT_COLORS = {
  background: '#FFFFFF',
  drawer: '#E6D3B3',
  card: '#E6D3B3',
  headerPill: '#E6D3B3',
  accent: '#E6D3B3',
  container: '#E6D3B3',
  statusPill: '#C97C5D',
  terracotta: '#C97C5D',
  black: '#000000',
  white: '#FFFFFF',
  text: '#000000',
  titleText: '#000000',
  mutedText: '#4A4A4A',
  sectionLabel: '#4A4A4A',
  border: '#000000',
  iconText: '#000000',
  modalBackground: '#E6D3B3',
  modalButtonBg: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.4)',
  switchTrackOff: '#C5C5C5',
  switchTrackOn: '#8A8A8A',
};

/** Paleta modo oscuro */
export const DARK_COLORS = {
  background: '#1A1A1A',        // ¡Cambiado! El fondo ahora sí es oscuro
  drawer: '#8A8A8A',            // Menú lateral
  card: '#535151',              // Tarjetas y contenedores oscuros
  headerPill: '#8A8A8A',        // Pastillas de títulos (como CONFIGURACIÓN)
  accent: '#8A8A8A',
  container: '#535151',         // Contenedores internos
  statusPill: '#E6D3B3',        // Lo que antes era #C97C5D ahora es #E6D3B3
  terracotta: '#E6D3B3',
  black: '#000000',
  white: '#FFFFFF',
  text: '#FFFFFF',              // ¡Cambiado! Textos generales ahora son blancos
  titleText: '#000000',         // ¡Cambiado! Títulos principales se quedan negros (contraste con pastilla)
  mutedText: '#CCCCCC',
  sectionLabel: '#CCCCCC',
  border: '#8A8A8A',            // Bordes oscuros
  iconText: '#FFFFFF',          // Icono hamburguesa (☰) pasa a blanco
  modalBackground: '#535151',   // Fondo de las ventanas emergentes/modales
  modalButtonBg: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.6)',
  switchTrackOff: '#C5C5C5',
  switchTrackOn: '#E6D3B3',
};

/**
 * Obtiene la paleta de colores activa según el modo.
 * @param {boolean} isDarkMode 
 * @returns {object}
 */
export function getThemeColors(isDarkMode) {
  return isDarkMode ? DARK_COLORS : LIGHT_COLORS;
}

export const FONTS = {
  serif: 'serif',
};

export const RADIUS = {
  pill: 999,
  card: 28,
  button: 28,
  menuButton: 14,
  fab: 999,
  icon: 8,
  modal: 24,
};

export function getBorders(colors) {
  return {
    thin: {
      borderWidth: 1,
      borderColor: colors.border,
    },
  };
}

export const SPACING = {
  screenHorizontal: 24,
  screenVertical: 20,
  cardPadding: 16,
  elementGap: 12,
};

export const DESCRIPTION_MAX_LENGTH = 200;
