import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import type { ReactNode } from "react";
import type {
  Notification,
  NotificationsPagination,
  NotificationsStats,
} from "../Types/Types";

import { useAuthContext } from "./AuthContext";
import { socket } from "../socket/socket.js";

// =========================================================
// TYPES
// =========================================================

interface NotificationsContextType {
  // Notifications
  notifications: Notification[];
  loadingNotifications: boolean;
  getNotifications: () => Promise<void>;

  // Filter
  read: boolean | undefined;
  setRead: (value: boolean | undefined) => void;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageLimit: number;
  setPageLimit: (limit: number) => void;
  pagination: NotificationsPagination | null;

  // Mark as read
  markAsRead: (id: string) => Promise<boolean>;
  loadingMarkAsRead: boolean;

  // Mark all as read
  markAllAsRead: () => Promise<boolean>;
  loadingMarkAllAsRead: boolean;

  // Statistics
  notificationsStats: NotificationsStats;
  getNotificationsStats: () => Promise<void>;
  loadingNotificationsStats: boolean;

  // Socket
  socketConnected: boolean;

  // Message
  msg: string | null;
}

// =========================================================
// HELPERS
// =========================================================

// MongoDB returns _id by default.
// The fallback supports an API that serializes the ID as id.
type NotificationRecord = Notification & {
  _id?: string;
  id?: string;
};

const getNotificationId = (
  notification: NotificationRecord
): string => {
  return String(notification._id ?? notification.id ?? "");
};

const getErrorMessage = (
  data: { message?: string; error?: string },
  fallback: string
) => {
  return data.message || data.error || fallback;
};

// =========================================================
// CONTEXT
// =========================================================

const NotificationsContext =
  createContext<NotificationsContextType | null>(null);

// =========================================================
// PROVIDER
// =========================================================

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { token, user } = useAuthContext();

  const API_URL = import.meta.env.VITE_API_URL;

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loadingNotifications, setLoadingNotifications] =
    useState(false);

  // =====================================================
  // FILTER
  // =====================================================

  const [read, setRead] = useState<boolean | undefined>(
    undefined
  );

  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);

  const [pagination, setPagination] =
    useState<NotificationsPagination | null>(null);

  // =====================================================
  // MARK AS READ
  // =====================================================

  const [loadingMarkAsRead, setLoadingMarkAsRead] =
    useState(false);

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  const [loadingMarkAllAsRead, setLoadingMarkAllAsRead] =
    useState(false);

  // =====================================================
  // STATISTICS
  // =====================================================

  const [notificationsStats, setNotificationsStats] =
    useState<NotificationsStats>({
      total: 0,
      unread: 0,
      read: 0,
    });

  const [loadingNotificationsStats, setLoadingNotificationsStats] =
    useState(false);

  // =====================================================
  // SOCKET
  // =====================================================

  const [socketConnected, setSocketConnected] = useState(
    socket.connected
  );

  // =====================================================
  // MESSAGE
  // =====================================================

  const [msg, setMsg] = useState<string | null>(null);

  // =====================================================
  // GET NOTIFICATIONS
  // =====================================================

  const getNotifications = useCallback(async () => {
    if (!token || !user) return;

    try {
      setLoadingNotifications(true);
      setMsg(null);

      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(pageLimit),
      });

      if (read !== undefined) {
        params.set("read", String(read));
      }

      const response = await fetch(
        `${API_URL}/api/v1/notifications?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Erreur lors de la récupération des notifications"
          )
        );
      }

      setNotifications(data.data ?? []);
      console.log("Notifications : ", data.data);
      setPagination(data.pagination ?? null);
    } catch (error) {
      console.error("Get notifications error:", error);

      setMsg(
        error instanceof Error
          ? error.message
          : "Impossible de récupérer les notifications"
      );
    } finally {
      setLoadingNotifications(false);
    }
  }, [
    API_URL,
    token,
    user,
    currentPage,
    pageLimit,
    read,
  ]);

  // =====================================================
  // GET NOTIFICATION STATISTICS
  // =====================================================

  const getNotificationsStats = useCallback(async () => {
    if (!token || !user) return;

    try {
      setLoadingNotificationsStats(true);

      const response = await fetch(
        `${API_URL}/api/v1/notifications/stats`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Erreur lors de la récupération des statistiques"
          )
        );
      }

      setNotificationsStats(data.data);
    } catch (error) {
      console.error("Get notification stats error:", error);
    } finally {
      setLoadingNotificationsStats(false);
    }
  }, [API_URL, token, user]);

  // =====================================================
  // KEEP THE LATEST REFRESH FUNCTIONS FOR SOCKET EVENTS
  // =====================================================

  const refreshRef = useRef({
    getNotifications,
    getNotificationsStats,
  });

  useEffect(() => {
    refreshRef.current = {
      getNotifications,
      getNotificationsStats,
    };
  }, [getNotifications, getNotificationsStats]);

  // =====================================================
  // MARK ONE NOTIFICATION AS READ
  // =====================================================

  const markAsRead = useCallback(
    async (id: string): Promise<boolean> => {
      if (!token || !user) return false;

      try {
        setLoadingMarkAsRead(true);
        setMsg(null);

        const response = await fetch(
          `${API_URL}/api/v1/notifications/${id}/read`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            getErrorMessage(
              data,
              "Erreur lors de la lecture de la notification"
            )
          );
        }

        const updatedNotification =
          data.data as NotificationRecord;

        const updatedId = getNotificationId(updatedNotification);

        setNotifications((previous) =>
          previous.map((notification) => {
            const currentId = getNotificationId(
              notification as NotificationRecord
            );

            return currentId === (updatedId || id)
              ? { ...notification, read: true }
              : notification;
          })
        );

        // The backend confirms the update.
        // Refetch stats to avoid incorrect counts.
        await getNotificationsStats();

        return true;
      } catch (error) {
        console.error("Mark notification as read error:", error);

        setMsg(
          error instanceof Error
            ? error.message
            : "Erreur réseau, veuillez réessayer"
        );

        return false;
      } finally {
        setLoadingMarkAsRead(false);
      }
    },
    [API_URL, token, user, getNotificationsStats]
  );

  // =====================================================
  // MARK ALL NOTIFICATIONS AS READ
  // =====================================================

  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    if (!token || !user) return false;

    try {
      setLoadingMarkAllAsRead(true);
      setMsg(null);

      const response = await fetch(
        `${API_URL}/api/v1/notifications/read-all`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Erreur lors de la lecture des notifications"
          )
        );
      }

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read: true,
        }))
      );

      await getNotificationsStats();

      return true;
    } catch (error) {
      console.error("Mark all notifications as read error:", error);

      setMsg(
        error instanceof Error
          ? error.message
          : "Erreur réseau, veuillez réessayer"
      );

      return false;
    } finally {
      setLoadingMarkAllAsRead(false);
    }
  }, [API_URL, token, user, getNotificationsStats]);

  // =====================================================
  // SOCKET.IO CONNECTION
  // =====================================================

  useEffect(() => {
    if (!token || !user) {
      socket.disconnect();
      setSocketConnected(false);
      setNotifications([]);
      setPagination(null);
      setNotificationsStats({
        total: 0,
        unread: 0,
        read: 0,
      });

      return;
    }

    let active = true;

    // Authenticate the socket using the current JWT.
    socket.auth = { token };

    const handleConnect = () => {
      if (!active) return;

      setSocketConnected(true);

      // Refresh data after connecting or reconnecting.
      // This also recovers notifications missed while offline.
      void refreshRef.current.getNotifications();
      void refreshRef.current.getNotificationsStats();
    };

    const handleDisconnect = () => {
      if (active) {
        setSocketConnected(false);
      }
    };

    const handleConnectError = (error: Error) => {
      if (!active) return;

      setSocketConnected(false);
      console.error("Socket connection error:", error.message);
    };

    const handleNewNotification = (
      notification: Notification
    ) => {
      if (!active) return;

      const incoming = notification as NotificationRecord;
      const incomingId = getNotificationId(incoming);

      setNotifications((previous) => {
        const alreadyExists = previous.some(
          (item) =>
            getNotificationId(item as NotificationRecord) ===
            incomingId
        );

        if (alreadyExists || read === true) {
          return previous;
        }

        // A new notification belongs at the top of page one.
        if (currentPage !== 1) {
          return previous;
        }

        return [notification, ...previous].slice(0, pageLimit);
      });

      // Refresh authoritative counts from the backend.
      // This avoids duplicate increments after reconnection.
      void refreshRef.current.getNotificationsStats();

      // Keep the current page's pagination in sync.
      if (currentPage === 1 && read !== true) {
        void refreshRef.current.getNotifications();
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("notification:new", handleNewNotification);

    socket.connect();

    // Account for an already-connected shared socket.
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      active = false;

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("notification:new", handleNewNotification);

      socket.disconnect();
      setSocketConnected(false);
    };
  }, [token, user, currentPage, pageLimit, read]);


  useEffect(() => {
    if (!token || !user) {
        socket.disconnect();
        return;
    }

    socket.auth = { token };
    socket.connect();

    return () => {
        socket.disconnect();
    };
}, [token, user?._id]);

  // =====================================================
  // RESET PAGE WHEN FILTER OR LIMIT CHANGES
  // =====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [read, pageLimit]);

  // =====================================================
  // LOAD NOTIFICATIONS WHEN QUERY CHANGES
  // =====================================================

  useEffect(() => {
    if (!token || !user) return;

    void getNotifications();
  }, [token, user, getNotifications]);

  // =====================================================
  // LOAD STATISTICS WHEN AUTHENTICATION CHANGES
  // =====================================================

  useEffect(() => {
    if (!token || !user) return;

    void getNotificationsStats();
  }, [token, user, getNotificationsStats]);

  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loadingNotifications,
        getNotifications,

        read,
        setRead,

        currentPage,
        setCurrentPage,
        pageLimit,
        setPageLimit,
        pagination,

        markAsRead,
        loadingMarkAsRead,

        markAllAsRead,
        loadingMarkAllAsRead,

        notificationsStats,
        getNotificationsStats,
        loadingNotificationsStats,

        socketConnected,

        msg,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

// =========================================================
// HOOK
// =========================================================

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error(
      "useNotificationsContext must be used inside NotificationsProvider"
    );
  }

  return context;
};