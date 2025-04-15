import unifiedSocket from "../components/Conversation/UnifiedSocket";
const subscribedRooms = new Set();

export const subscribeRooms = (roomIds) => {
  const newRooms = roomIds.filter((roomId) => !subscribedRooms.has(roomId));
  if (newRooms.length) {
    unifiedSocket.connect(newRooms);
    newRooms.forEach((id) => subscribedRooms.add(id));
  }
};

export const unsubscribeAllRooms = () => {
  unifiedSocket.close(); // Or use a more granular `leave` if you have it
  subscribedRooms.clear();
};
