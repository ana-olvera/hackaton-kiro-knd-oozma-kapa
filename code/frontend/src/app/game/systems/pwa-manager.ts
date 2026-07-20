/**
 * Gestor de PWA.
 * Maneja instalación, actualizaciones y estado offline.
 */

export class PwaManager {
  private deferredPrompt: Event | null = null;
  private isInstalled = false;

  constructor() {
    this.init();
  }

  private init(): void {
    // Escuchar evento de instalación
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });

    // Detectar si ya está instalada
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
    });

    // Detectar si corre como standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
    }
  }

  /**
   * Muestra el prompt de instalación nativo.
   */
  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) return false;

    const promptEvent = this.deferredPrompt as BeforeInstallPromptEvent;
    promptEvent.prompt();

    const result = await promptEvent.userChoice;
    this.deferredPrompt = null;

    return result.outcome === 'accepted';
  }

  /**
   * Indica si el prompt de instalación está disponible.
   */
  canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  /**
   * Indica si la app ya está instalada.
   */
  getIsInstalled(): boolean {
    return this.isInstalled;
  }

  /**
   * Verifica si hay una actualización disponible del Service Worker.
   */
  async checkForUpdate(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) return false;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        return registration.waiting !== null;
      }
    } catch {
      // Sin Service Worker
    }
    return false;
  }

  /**
   * Aplica la actualización pendiente.
   */
  async applyUpdate(): Promise<void> {
    if (!('serviceWorker' in navigator)) return;

    const registration = await navigator.serviceWorker.getRegistration();
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  /**
   * Indica si está offline.
   */
  isOffline(): boolean {
    return !navigator.onLine;
  }

  /**
   * Registra listeners de online/offline.
   */
  onConnectivityChange(callback: (online: boolean) => void): void {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
  }
}

// Tipo para el evento beforeinstallprompt (no existe en lib.dom estándar)
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
