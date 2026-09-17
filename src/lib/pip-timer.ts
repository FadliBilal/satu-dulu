// ==============================================================================
// SATUDULU — Picture-in-Picture (PiP) Floating Focus Timer Engine
// Uses HTML5 Canvas + Video stream to render a native floating stopwatch window
// ==============================================================================

export class PipTimerController {
  private canvas: HTMLCanvasElement | null = null;
  private video: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private isPipActive: boolean = false;
  private onLeaveCallback?: () => void;

  constructor() {
    if (typeof window !== "undefined") {
      this.canvas = document.createElement("canvas");
      this.canvas.width = 440;
      this.canvas.height = 240;

      this.video = document.createElement("video");
      this.video.muted = true;
      this.video.playsInline = true;

      this.video.addEventListener("leavepictureinpicture", () => {
        this.isPipActive = false;
        if (this.onLeaveCallback) {
          this.onLeaveCallback();
        }
      });
    }
  }

  public isSupported(): boolean {
    if (typeof document === "undefined") return false;
    return Boolean(
      "pictureInPictureEnabled" in document && document.pictureInPictureEnabled
    );
  }

  public isActive(): boolean {
    return this.isPipActive;
  }

  public async startPip(
    formattedTime: string,
    taskTitle: string,
    onLeave?: () => void
  ): Promise<boolean> {
    if (!this.isSupported() || !this.canvas || !this.video) {
      return false;
    }

    this.onLeaveCallback = onLeave;
    this.drawFrame(formattedTime, taskTitle);

    try {
      if (!this.stream) {
        // @ts-ignore - captureStream exists on HTMLCanvasElement in modern browsers
        this.stream = this.canvas.captureStream(10);
        this.video.srcObject = this.stream;
        await this.video.play();
      }

      if (document.pictureInPictureElement !== this.video) {
        await this.video.requestPictureInPicture();
        this.isPipActive = true;
        return true;
      }
      return true;
    } catch (err) {
      console.warn("Could not start Picture-in-Picture:", err);
      this.isPipActive = false;
      return false;
    }
  }

  public updateTime(formattedTime: string, taskTitle: string) {
    if (!this.canvas) return;
    this.drawFrame(formattedTime, taskTitle);
  }

  public async exitPip(): Promise<void> {
    if (typeof document !== "undefined" && document.pictureInPictureElement) {
      try {
        await document.exitPictureInPicture();
      } catch (err) {
        console.warn("Error exiting PiP:", err);
      }
    }
    this.isPipActive = false;
  }

  private drawFrame(formattedTime: string, taskTitle: string) {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Background: Dark Slate Blue
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(0, 0, w, h);

    // Subtle decorative border
    ctx.strokeStyle = "#1E293B";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, w - 4, h - 4);

    // Accent line at top
    ctx.fillStyle = "#2563EB";
    ctx.fillRect(0, 0, w, 6);

    // Header Tag
    ctx.fillStyle = "#60A5FA";
    ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";
    ctx.fillText("SATUDULU • FOKUS AKTIF", 24, 38);

    // Large Stopwatch Display
    ctx.fillStyle = "#F8FAFC";
    ctx.font = "bold 56px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillText(formattedTime, 24, 114);

    // Dividing separator
    ctx.strokeStyle = "#1E293B";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, 138);
    ctx.lineTo(w - 24, 138);
    ctx.stroke();

    // Task Title
    ctx.fillStyle = "#94A3B8";
    ctx.font = "12px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";
    ctx.fillText("KOMITMEN:", 24, 162);

    ctx.fillStyle = "#F1F5F9";
    ctx.font = "600 17px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";
    
    // Truncate task title if needed
    let displayTitle = taskTitle;
    if (displayTitle.length > 32) {
      displayTitle = displayTitle.substring(0, 30) + "...";
    }
    ctx.fillText(displayTitle, 24, 192);

    // Footer indicator
    ctx.fillStyle = "#38BDF8";
    ctx.beginPath();
    ctx.arc(w - 32, 34, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}
