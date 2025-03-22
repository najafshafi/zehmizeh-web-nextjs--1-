import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsBell } from "react-icons/bs";
import {
  getNotifications,
  readNotification,
} from "@/helpers/http/notification";
import "./style.css";
// import useUsers from '@/pages/messaging/controllers/useUsers';
import { useAuth } from "@/helpers/contexts/auth-context";

interface NotificationItem {
  title: string;
  notification_id: string;
  link: string;
  is_seen: number;
}

export const NotificationDropdown = ({
  onToggle,
}: {
  onToggle?: (isOpen: boolean) => void;
}) => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { user } = useAuth();

  const unreadCount = notifications.filter((notf) => !notf.is_seen).length;

  const notificationHandler = (notifications: NotificationItem[]) => {
    const unReadNotification = notifications.filter(
      (notf: NotificationItem) => !notf.is_seen
    );
    const readNotification = notifications.filter(
      (notf: NotificationItem) => !!notf.is_seen
    );
    return [...unReadNotification, ...readNotification];
  };

  const fetchNotifications = () => {
    if (user) {
      getNotifications().then((res) => {
        const notifications = res?.notifications;
        if (notifications?.length > 0) {
          const notifyData = notificationHandler(notifications);
          setNotifications(notifyData);
        }
      });
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up polling to check for new notifications every 30 seconds
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 30000);

    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [user]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".not-main-wrapper")) {
        setShow(false);
        if (onToggle) onToggle(false);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [onToggle]);

  const toggle = () => {
    const newState = !show;
    setShow(newState);
    if (onToggle) onToggle(newState);
  };

  const seenNotification = (notification_id: string, link?: string) => {
    let updatedData = notifications.map((x) =>
      x.notification_id === notification_id ? { ...x, is_seen: 1 } : x
    );

    updatedData = notificationHandler(updatedData);
    setNotifications(updatedData);
    link = link && link.replace(/^.*\/\/[^/]+/, "");
    readNotification({ notification_id });
    if (link && link !== "/support") router.push(link);
  };

  const handleClearAll = async () => {
    const updatedData = notifications.map((notification) => ({
      ...notification,
      is_seen: 1,
    }));

    setNotifications(notificationHandler(updatedData));

    const unreadNotifications = notifications.filter((notf) => !notf.is_seen);
    await Promise.all(
      unreadNotifications.map((notification) =>
        readNotification({ notification_id: notification.notification_id })
      )
    );
  };

  return (
    <div className="not-main-wrapper">
      <div className="relative bell-wrap" onClick={toggle}>
        <BsBell size={30} className="me-4 not-icon cursor-pointer" />
        {unreadCount > 0 && <div className="not-badge">{unreadCount}</div>}
      </div>

      <div className={`notification-box ${!show && "hide"}`}>
        {unreadCount > 1 && (
          <button onClick={handleClearAll} className="clear-all-button">
            Clear All
          </button>
        )}
        <div
          className={`notification-content ${
            unreadCount > 0 ? "notification-content-with-button" : ""
          }`}
        >
          <>
            {!notifications.length ? (
              <p className="no-notifications">No notifications found</p>
            ) : (
              notifications.map((notification) => {
                const { is_seen, notification_id, title, link } = notification;
                return (
                  <p
                    key={`not-title-${notification_id}`}
                    className={`not-title ${!is_seen && "bold"}`}
                    onClick={() => seenNotification(notification_id, link)}
                  >
                    {title}
                  </p>
                );
              })
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
