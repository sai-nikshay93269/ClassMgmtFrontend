class UnifiedSocket {
    constructor() {
      this.ws = null;
      this.listeners = [];
      this.connected = false;
      this.reconnectInterval = 5000;
      this.subscriptions = [];
    }
  
    connect(rooms) {
        if (this.connected && this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ subscribe: rooms }));
          return;
        }
      
        this.subscriptions = rooms;
        this.ws = new WebSocket("ws://localhost:5000/ws-chat");
      
        this.ws.onopen = () => {
          this.connected = true;
          console.log("🟢 UnifiedSocket connected");
          this.ws.send(JSON.stringify({ subscribe: rooms }));
        };
      
        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.listeners.forEach((fn) => fn(data));
          } catch (err) {
            console.error("❌ UnifiedSocket parse error:", err.message);
          }
        };
      
        this.ws.onclose = () => {
          this.connected = false;
          console.warn("🔴 UnifiedSocket disconnected");
          setTimeout(() => this.connect(this.subscriptions), this.reconnectInterval);
        };
      
        this.ws.onerror = (err) => {
          console.error("⚠️ UnifiedSocket error:", err.message);
          this.ws.close();
        };
      }
      
  
    onMessage(callback) {
      this.listeners.push(callback);
    }
  
    close() {
      if (this.ws) {
        this.ws.close();
      }
    }
  }
  
  const unifiedSocket = new UnifiedSocket();
  export default unifiedSocket;
  