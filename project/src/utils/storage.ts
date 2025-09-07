// LocalStorage ile veri yönetimi
export class LocalStorageManager {
  private static instance: LocalStorageManager;
  
  static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  // Veri kaydetme
  setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('LocalStorage kayıt hatası:', error);
    }
  }

  // Veri okuma
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('LocalStorage okuma hatası:', error);
      return null;
    }
  }

  // Veri silme
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('LocalStorage silme hatası:', error);
    }
  }

  // Tüm verileri temizle
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('LocalStorage temizleme hatası:', error);
    }
  }

  // Çevrimdışı veri senkronizasyonu
  syncOfflineData(): void {
    const offlineData = this.getItem('offlineData') || [];
    if (Array.isArray(offlineData) && offlineData.length > 0) {
      // Çevrimiçi olduğunda verileri senkronize et
      console.log('Çevrimdışı veriler senkronize ediliyor:', offlineData);
      // Burada API çağrıları yapılabilir
      this.removeItem('offlineData');
    }
  }
}

// Çevrimdışı durum yönetimi
export class OfflineManager {
  private static callbacks: Array<(isOnline: boolean) => void> = [];

  static init(): void {
    window.addEventListener('online', () => {
      this.notifyStatusChange(true);
      LocalStorageManager.getInstance().syncOfflineData();
    });

    window.addEventListener('offline', () => {
      this.notifyStatusChange(false);
    });
  }

  static isOnline(): boolean {
    return navigator.onLine;
  }

  static onStatusChange(callback: (isOnline: boolean) => void): void {
    this.callbacks.push(callback);
  }

  private static notifyStatusChange(isOnline: boolean): void {
    this.callbacks.forEach(callback => callback(isOnline));
  }
}