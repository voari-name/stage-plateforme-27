
/**
 * Ajoute une notification au système
 * @param title Titre de la notification
 * @param message Message de la notification
 */
export const addNotification = (title: string, message: string) => {
  const notification = {
    id: Date.now().toString(),
    title,
    message
  };

  // Créer et dispatcher un événement personnalisé
  const event = new CustomEvent('app:notification', { 
    detail: notification 
  });
  window.dispatchEvent(event);

  return notification;
};
