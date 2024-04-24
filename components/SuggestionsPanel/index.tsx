import { Button, Flex, List, Typography } from "antd";
import { ExclamationCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Suggestion, SuggestionFix } from "./issues";

export interface SuggestionsPanelProps {
  suggestions: Suggestion[];
  applyFix: (args: SuggestionFix) => void;
}
export default function SuggestionsPanel({
  suggestions,
  applyFix,
}: SuggestionsPanelProps) {
  return (
    <Flex
      vertical
      gap="middle"
      style={{
        height: "calc(100vh - 10rem)",
        padding: "1rem 1.5rem 0 1.5rem",
        overflowY: "scroll",
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={suggestions}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                item.level === "warning" ? (
                  <WarningOutlined
                    style={{
                      color: "#faad14",
                    }}
                  />
                ) : (
                  <ExclamationCircleOutlined style={{ color: "#cf1322" }} />
                )
              }
              title={
                <Flex justify="space-between">
                  <Typography.Text strong>{item.title}</Typography.Text>
                  {item.fixes?.length && (
                    <Button
                      type="link"
                      onClick={() => applyFix(item.fixes![0])}
                      style={{
                        height: "1rem",
                        padding: 0,
                        lineHeight: "1rem",
                      }}
                    >
                      Fix
                    </Button>
                  )}
                </Flex>
              }
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Flex>
  );
}
