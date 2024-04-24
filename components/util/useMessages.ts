import { message } from "antd";
import { JointContent } from "antd/es/message/interface";

export function useMessages() {
  const [messageApi, contextHolder] = message.useMessage();

  const showInfoMessage = (content: JointContent) => {
    message.info(content);
  };

  const showErrorMessage = (content: JointContent) => {
    message.error(content);
  };

  return {
    messageApi,
    contextHolder,
    showInfoMessage,
    showErrorMessage,
  };
}
