import { talkjsApiKey, talkjsSecretKey } from "@/helpers/utils/helper";
import React, { useState } from "react";
import Download from "@/public/icons/download-message.svg";

interface User {
  id: string;
  name: string;
  custom?: {
    first_name?: string;
    last_name?: string;
  };
  [key: string]: unknown;
}

interface FileAttachment {
  size: number;
  type: string;
  filename: string;
  width?: number;
  height?: number;
  url: string;
}

interface Message {
  text: string;
  senderName: string;
  timestamp: string;
  attachments?: FileAttachment[];
}

// Raw message structure from the API
interface RawMessage {
  text?: string;
  senderId: string;
  createdAt: number;
  content?: Array<{
    type: string;
    url?: string;
    size?: number;
    filename?: string;
    width?: number;
    height?: number;
  }>;
  attachment?: {
    url: string;
    size?: number;
    filename?: string;
    dimensions?: {
      width?: number;
      height?: number;
    };
  };
}

interface MessagesResponse {
  data: RawMessage[];
  [key: string]: unknown;
}

interface ExportChatProps {
  conversationId: string;
}

const ExportChat: React.FC<ExportChatProps> = ({ conversationId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userCache, setUserCache] = useState<Record<string, string>>({});

  const makeRequest = async <
    T extends Record<string, unknown> = Record<string, unknown>,
  >({
    path,
    verb,
    body,
  }: {
    path: string;
    verb: string;
    body?: Record<string, unknown>;
  }): Promise<T | null> => {
    const secretKey = talkjsSecretKey();
    const apiKey = talkjsApiKey();

    try {
      const response = await fetch(
        `https://api.talkjs.com/v1/${apiKey}/${path}`,
        {
          method: verb,
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return (await response.json()) as T;
    } catch {
      return null;
    }
  };

  const formatUserName = (userData: User): string => {
    if (userData.custom?.first_name && userData.custom?.last_name) {
      return `${userData.custom.first_name} ${userData.custom.last_name}`;
    }
    return userData.name || "Unknown User";
  };

  const getUserName = async (userId: string): Promise<string> => {
    if (!userId) return "Unknown User";
    if (userCache[userId]) return userCache[userId];

    try {
      const path = `users/${userId}`;
      const userData = await makeRequest<User & Record<string, unknown>>({
        path,
        verb: "GET",
      });

      if (userData) {
        const formattedName = formatUserName(userData as User);
        setUserCache((prev) => ({ ...prev, [userId]: formattedName }));
        return formattedName;
      }
      return "Unknown User";
    } catch {
      return "Unknown User";
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const processAttachments = (msg: RawMessage): FileAttachment[] => {
    const attachments: FileAttachment[] = [];
    const processedUrls = new Set<string>(); // To prevent duplicates

    // Process content array
    if (Array.isArray(msg.content)) {
      msg.content.forEach((item) => {
        if (item.type === "file" && item.url && !processedUrls.has(item.url)) {
          processedUrls.add(item.url);
          attachments.push({
            size: item.size || 0,
            type: item.type,
            filename: item.filename || "unnamed",
            width: item.width,
            height: item.height,
            url: item.url,
          });
        }
      });
    }

    // Process single attachment if it has a unique URL
    if (msg.attachment?.url && !processedUrls.has(msg.attachment.url)) {
      attachments.push({
        size: msg.attachment.size ?? 0,
        type: "file",
        filename: msg.attachment.filename || "attachment",
        width: msg.attachment.dimensions?.width,
        height: msg.attachment.dimensions?.height,
        url: msg.attachment.url,
      });
    }

    return attachments;
  };

  const getMessages = async ({
    conversationId,
  }: {
    conversationId: string;
  }): Promise<Message[]> => {
    if (!conversationId) return [];

    try {
      const path = `conversations/${conversationId}/messages?limit=100`;
      const messagesResponse = await makeRequest<MessagesResponse>({
        path,
        verb: "GET",
      });
      const messages = messagesResponse?.data || [];

      if (!Array.isArray(messages)) return [];

      const userIds = [
        ...new Set(messages.map((msg: RawMessage) => msg.senderId)),
      ];
      const userNames = await Promise.all(
        userIds.map(async (userId: string) => ({
          userId,
          name: await getUserName(userId),
        }))
      );

      const userNameMap = Object.fromEntries(
        userNames.map((user) => [user.userId, user.name])
      );

      return messages.map((msg: RawMessage) => ({
        text: msg.text || "",
        senderName: userNameMap[msg.senderId] || "Unknown User",
        timestamp: formatTimestamp(msg.createdAt),
        attachments: processAttachments(msg),
      }));
    } catch {
      return [];
    }
  };

  const exportToCSV = (messages: Message[]) => {
    const csvRows = [
      ["Date & Time", "Sender", "Message", "Attachments"],
      ...messages.map((msg) => {
        const attachmentInfo =
          msg.attachments
            ?.map((att) => `${att.filename} (${att.url})`)
            .join("; ") || "";

        return [
          msg.timestamp,
          msg.senderName,
          `"${msg.text.replace(/"/g, '""')}"`,
          `"${attachmentInfo.replace(/"/g, '""')}"`,
        ];
      }),
    ];
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    return csvContent;
  };

  const handleExport = async (format: "json" | "csv") => {
    if (loading) return;
    setLoading(true);

    try {
      const messages = await getMessages({ conversationId });
      const chatData = { messages };
      const fileContent =
        format === "json"
          ? JSON.stringify(chatData, null, 2)
          : exportToCSV(messages);

      const blob = new Blob([fileContent], {
        type: format === "json" ? "application/json" : "text/csv",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `chat-${conversationId}.${format}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group">
      <div className="p-2 rounded-md cursor-pointer hover:bg-gray-200">
        <Download width={33} />
      </div>
      <div className="hidden group-hover:block hover:block absolute right-[-100%] top-full mt-0 bg-white rounded-lg min-w-[150px] shadow-md z-[1000]">
        <div
          className="py-3 px-4 cursor-pointer hover:bg-gray-200"
          onClick={() => handleExport("csv")}
        >
          {loading ? "Loading..." : "Export as CSV"}
        </div>
        <div
          className="py-3 px-4 cursor-pointer hover:bg-gray-200"
          onClick={() => handleExport("json")}
        >
          {loading ? "Loading..." : "Export as JSON"}
        </div>
      </div>
    </div>
  );
};

export default ExportChat;
