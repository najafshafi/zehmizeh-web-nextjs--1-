import { talkjsApiKey, talkjsSecretKey } from '@/helpers/utils/helper';
import React, { useState } from 'react';
import styled from 'styled-components';
import  Download  from '@/public/icons/download-message.svg';

interface User {
  id: string;
  name: string;
  custom?: {
    first_name?: string;
    last_name?: string;
  };
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

// interface ChatData {
//   messages: Message[];
// }

interface ExportChatProps {
  conversationId: string;
}

const ExportChat: React.FC<ExportChatProps> = ({ conversationId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userCache, setUserCache] = useState<Record<string, string>>({});

  const makeRequest = async ({ path, verb, body }: { path: string; verb: string; body?: any }) => {
    const secretKey = talkjsSecretKey();
    const apiKey = talkjsApiKey();

    try {
      const response = await fetch(`https://api.talkjs.com/v1/${apiKey}/${path}`, {
        method: verb,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secretKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return null;
    }
  };

  const formatUserName = (userData: User): string => {
    if (userData.custom?.first_name && userData.custom?.last_name) {
      return `${userData.custom.first_name} ${userData.custom.last_name}`;
    }
    return userData.name || 'Unknown User';
  };

  const getUserName = async (userId: string): Promise<string> => {
    if (!userId) return 'Unknown User';
    if (userCache[userId]) return userCache[userId];

    try {
      const path = `users/${userId}`;
      const userData = await makeRequest({ path, verb: 'GET' });

      if (userData) {
        const formattedName = formatUserName(userData);
        setUserCache((prev) => ({ ...prev, [userId]: formattedName }));
        return formattedName;
      }
      return 'Unknown User';
    } catch {
      return 'Unknown User';
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const processAttachments = (msg: any): FileAttachment[] => {
    const attachments: FileAttachment[] = [];
    const processedUrls = new Set(); // To prevent duplicates

    // Process content array
    if (Array.isArray(msg.content)) {
      msg.content.forEach((item: any) => {
        if (item.type === 'file' && !processedUrls.has(item.url)) {
          processedUrls.add(item.url);
          attachments.push({
            size: item.size,
            type: item.type,
            filename: item.filename,
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
        size: msg.attachment.size,
        type: 'file',
        filename: msg.attachment.filename || 'attachment',
        width: msg.attachment.dimensions?.width,
        height: msg.attachment.dimensions?.height,
        url: msg.attachment.url,
      });
    }

    return attachments;
  };

  const getMessages = async ({ conversationId }: { conversationId: string }): Promise<Message[]> => {
    if (!conversationId) return [];

    try {
      const path = `conversations/${conversationId}/messages?limit=100`;
      const messagesResponse = await makeRequest({ path, verb: 'GET' });
      const messages = messagesResponse?.data || [];

      if (!Array.isArray(messages)) return [];

      const userIds = [...new Set(messages.map((msg: any) => msg.senderId))];
      const userNames = await Promise.all(
        userIds.map(async (userId: string) => ({
          userId,
          name: await getUserName(userId),
        }))
      );

      const userNameMap = Object.fromEntries(userNames.map((user) => [user.userId, user.name]));

      return messages.map((msg: any) => ({
        text: msg.text || '',
        senderName: userNameMap[msg.senderId] || 'Unknown User',
        timestamp: formatTimestamp(msg.createdAt),
        attachments: processAttachments(msg),
      }));
    } catch {
      return [];
    }
  };

  const exportToCSV = (messages: Message[]) => {
    const csvRows = [
      ['Date & Time', 'Sender', 'Message', 'Attachments'],
      ...messages.map((msg) => {
        const attachmentInfo = msg.attachments?.map((att) => `${att.filename} (${att.url})`).join('; ') || '';

        return [
          msg.timestamp,
          msg.senderName,
          `"${msg.text.replace(/"/g, '""')}"`,
          `"${attachmentInfo.replace(/"/g, '""')}"`,
        ];
      }),
    ];
    const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    return csvContent;
  };

  const handleExport = async (format: 'json' | 'csv') => {
    if (loading) return;
    setLoading(true);

    try {
      const messages = await getMessages({ conversationId });
      const chatData = { messages };
      const fileContent = format === 'json' ? JSON.stringify(chatData, null, 2) : exportToCSV(messages);

      const blob = new Blob([fileContent], {
        type: format === 'json' ? 'application/json' : 'text/csv',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `chat-${conversationId}.${format}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HoverWrapper>
      <div className="export-icon">
        <Download width={33} />
      </div>
      <div className="hover-menu">
        <div className="option" onClick={() => handleExport('csv')}>
          {loading ? 'Loading...' : 'Export as CSV'}
        </div>
        <div className="option" onClick={() => handleExport('json')}>
          {loading ? 'Loading...' : 'Export as JSON'}
        </div>
      </div>
    </HoverWrapper>
  );
};

export default ExportChat;

const HoverWrapper = styled.div`
  position: relative;

  .export-icon {
    padding: 0.5rem;
    border-radius: 7px;
    cursor: pointer;
    &:hover {
      background: ${(props) => props.theme.colors.gray2};
      & + .hover-menu {
        display: block;
      }
    }
  }

  .hover-menu {
    display: none;
    position: absolute;
    right: -100%;
    top: 100%;
    margin-top: 0;
    background: white;
    border-radius: 8px;
    min-width: 150px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;

    &:hover {
      display: block;
    }

    .option {
      padding: 0.75rem 1rem;
      cursor: pointer;
      &:hover {
        background: ${(props) => props.theme.colors.gray2};
      }
    }
  }
`;
