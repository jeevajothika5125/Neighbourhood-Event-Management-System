import { useState, useEffect, useRef } from 'react';

export const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [readyState, setReadyState] = useState(0);
  const reconnectTimeoutId = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      setReadyState(1);
      setSocket(ws);
    };
    
    ws.onmessage = (event) => {
      setLastMessage(event.data);
    };
    
    ws.onclose = () => {
      setReadyState(3);
      // Auto reconnect after 3 seconds
      reconnectTimeoutId.current = setTimeout(() => {
        setReadyState(0);
      }, 3000);
    };
    
    ws.onerror = () => {
      setReadyState(3);
    };

    return () => {
      if (reconnectTimeoutId.current) {
        clearTimeout(reconnectTimeoutId.current);
      }
      ws.close();
    };
  }, [url]);

  const sendMessage = (message) => {
    if (socket && readyState === 1) {
      socket.send(message);
    }
  };

  return {
    socket,
    lastMessage,
    readyState,
    sendMessage
  };
};