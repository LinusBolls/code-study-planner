import { ExclamationCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Flex, List, Typography } from "antd";

import { Suggestion, SuggestionFix } from "./issues";

export interface SuggestionsPanelProps {
  suggestions: Suggestion[];
  applyFix: (args: SuggestionFix) => void;
  isLoading?: boolean;
}
export default function SuggestionsPanel({
  suggestions,
  applyFix,
  isLoading = false,
}: SuggestionsPanelProps) {
  if (isLoading)
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
        <Typography style={{ paddingTop: "5rem" }}>Loading...</Typography>
      </Flex>
    );

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
        locale={{
          emptyText: (
            <>
              Congrats, you&apos;re following all best practices!{" "}
              <span style={{ color: "black" }}>🎉</span>
            </>
          ),
        }}
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
                  {item.fixes?.length === 1 && (
                    <Button
                      type="link"
                      onClick={() => applyFix(item.fixes![0])}
                      style={{
                        height: "1rem",
                        padding: 0,
                        lineHeight: "1rem",
                      }}
                    >
                      {item.fixes![0].title}
                    </Button>
                  )}
                  {(item.fixes?.length ?? 0) > 1 && (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        paddingBottom: "0.5rem",
                      }}
                    >
                      {item.fixes!.map((fix, index) => (
                        <Button
                          key={index}
                          type="link"
                          onClick={() => applyFix(fix)}
                          style={{
                            height: "1rem",
                            padding: 0,
                            lineHeight: "1rem",
                          }}
                        >
                          {fix.title}
                        </Button>
                      ))}
                    </div>
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
