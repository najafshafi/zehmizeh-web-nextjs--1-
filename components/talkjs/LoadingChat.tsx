import  ChatLoading  from '@/public//icons/waiting.svg';
import * as T from './style';

export const LoadingChat = () => (
  <T.Loading>
    <div className="flex items-center justify-center gap-4">
      <ChatLoading />
      <p>Your chat is loading...</p>
    </div>
  </T.Loading>
);
