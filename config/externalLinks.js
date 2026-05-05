import { Alert, Linking } from 'react-native';

/**
 * URL pública de la página “olvidé contraseña” (Vercel / hosting HTTPS).
 * Debe coincidir con el dominio que añadiste en Supabase → Authentication → Redirect URLs.
 */
export const PASSWORD_RESET_WEB_URL =
  'https://passwordreset-z6x3.vercel.app/index.html';

export async function openPasswordRecovery() {
  const url = PASSWORD_RESET_WEB_URL;
  if (!url || typeof url !== 'string' || url.trim() === '') {
    Alert.alert(
      'Recuperación de contraseña',
      'Aún no hay URL configurada. Edita PASSWORD_RESET_WEB_URL en config/externalLinks.js cuando tengas la página lista.'
    );
    return;
  }
  const can = await Linking.canOpenURL(url);
  if (!can) {
    Alert.alert('Enlace inválido', 'No se pudo abrir la URL configurada.');
    return;
  }
  await Linking.openURL(url);
}
