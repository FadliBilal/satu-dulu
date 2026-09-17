// ==============================================================================
// SATUDULU — Notification Service (PWA / Browser Notifications)
// Tagline: "Besok butuh keputusan."
// ==============================================================================

export class NotificationService {
  public static isSupported(): boolean {
    return typeof window !== "undefined" && "Notification" in window;
  }

  public static getPermission(): NotificationPermission {
    if (!this.isSupported()) return "denied";
    return Notification.permission;
  }

  public static async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    const res = await Notification.requestPermission();
    return res === "granted";
  }

  public static sendLocalNotification(title: string, body: string): boolean {
    if (!this.isSupported() || Notification.permission !== "granted") {
      return false;
    }

    try {
      new Notification(title, {
        body,
        icon: "/icon.svg",
        badge: "/icon.svg",
      });
      return true;
    } catch (err) {
      console.warn("Could not dispatch notification:", err);
      return false;
    }
  }

  public static scheduleEveningReminder(time: string = "21:00") {
    if (!this.isSupported() || Notification.permission !== "granted") return;
    // Store reminder preference in localStorage
    try {
      localStorage.setItem("satudulu_notification_time", time);
    } catch {}
  }
}
