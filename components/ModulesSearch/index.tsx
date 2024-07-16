import { AutoSizer, List, ListRowRenderer } from "react-virtualized";
import { Droppable } from "@hello-pangea/dnd";
import { AutoComplete, Checkbox, Flex, Segmented, Typography } from "antd";
import ModulesListItem from "../ModulesListItem";
import { Module } from "@/components/util/types";
import { SegmentedLabeledOption, SegmentedOptions } from "antd/es/segmented";

const getOptions = (values: string[]) => {
  return values.map((i) => ({
    value: i,
    label: i,
  }));
};

export interface ModulesSearchProps {
  modules?: Module[];

  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;

  onlyMandatoryOrCompulsoryElective: boolean;
  onOnlyMandatoryOrCompulsoryElectiveChange: (value: boolean) => void;

  onlyAlternativeAssessment: boolean;
  onOnlyAlternativeAssessmentChange: (value: boolean) => void;

  onlyEarlyAssessment: boolean;
  onOnlyEarlyAssessmentChange: (value: boolean) => void;

  modulesTab?: string;
  onModulesTabChange: (value: string) => void;

  isLoading?: boolean;
  currentTabIsEmpty?: boolean;
}
export default function ModulesSearch({
  modules = [],

  searchQuery,
  onSearchQueryChange,

  onlyMandatoryOrCompulsoryElective: onlyMandaryOrCompulsoryElective,
  onOnlyMandatoryOrCompulsoryElectiveChange:
    onOnlyMandaryOrCompulsoryElectiveChange,

  onlyAlternativeAssessment,
  onOnlyAlternativeAssessmentChange,

  onlyEarlyAssessment,
  onOnlyEarlyAssessmentChange,

  modulesTab = "all",
  onModulesTabChange,

  isLoading = false,
  currentTabIsEmpty = false,
}: ModulesSearchProps) {
  const modulesTabs: (SegmentedLabeledOption & {
    description?: string;
    emptyText?: string;
  })[] = [
    {
      value: "all",
      label: "All",
      title: "Modules that are currently available to CODE Students",
    },
    {
      value: "my-semester",
      label: "My Semester",
      title: "Modules that you're currently registered for",
      description: "Showing all modules that you're currently registered for.",
      emptyText: "You are not registered for any\n modules this semester.",
    },
    {
      value: "my-studies",
      label: "My Studies",
      title: "Modules that you registered for in the past",
      description: "Showing all modules that you passed or failed.",
      emptyText: "You haven't taken any modules yet.",
    },
    {
      value: "not-taken",
      label: "Not taken",
      title: "Modules that aren't in your study plan yet",
      description: "Showing all modules that aren't in your study plan yet.",
      emptyText: "You took every single module lmao",
    },
  ];
  const activeTab = modulesTabs.find((tab) => tab.value === modulesTab);

  const hasSearchQuery = (searchQuery?.length ?? 0) > 0;

  const rowRenderer: ListRowRenderer = ({ key, index, style }) => {
    if (index === 0) {
      return (
        <Flex vertical gap="middle">
          <Flex vertical gap="small">
            <Segmented
              options={modulesTabs as SegmentedOptions<string>}
              block
              onChange={onModulesTabChange}
              value={modulesTab}
            />
            {activeTab?.description && (
              <Typography.Text type="secondary">
                {activeTab.description}
              </Typography.Text>
            )}
          </Flex>
          <AutoComplete
            placeholder="Search by name, study program, or professor"
            value={searchQuery}
            onChange={(value) => onSearchQueryChange?.(value)}
            allowClear
            options={
              // don't show search suggestions if there is a search term because that would be annoying
              hasSearchQuery
                ? undefined
                : [
                    {
                      label: "Some things you could search for",
                      options: getOptions(["pm", "se 10 ects", "fatma meawad"]),
                    },
                  ]
            }
          />
          <Checkbox
            checked={onlyMandaryOrCompulsoryElective}
            onChange={() =>
              onOnlyMandaryOrCompulsoryElectiveChange(
                !onlyMandaryOrCompulsoryElective
              )
            }
          >
            Mandatory/Compulsory Elective
          </Checkbox>
          <Checkbox
            checked={onlyAlternativeAssessment}
            onChange={() =>
              onOnlyAlternativeAssessmentChange(!onlyAlternativeAssessment)
            }
          >
            Allows alternative assessment
          </Checkbox>
          <Checkbox
            checked={onlyEarlyAssessment}
            onChange={() => onOnlyEarlyAssessmentChange(!onlyEarlyAssessment)}
          >
            Allows early assessment
          </Checkbox>
          {!isLoading && modules.length === 0 && (
            <Flex align="center" justify="center" style={{ height: "4rem" }}>
              <Typography.Text
                type="secondary"
                style={{
                  whiteSpace: "pre",
                  textAlign: "center",
                }}
              >
                {activeTab?.emptyText && currentTabIsEmpty
                  ? activeTab?.emptyText
                  : "No modules found."}
              </Typography.Text>
            </Flex>
          )}
        </Flex>
      );
    }
    if (isLoading)
      return (
        <ModulesListItem
          key={key}
          index={index}
          style={style}
          showPopoverOn="hover"
        />
      );

    const rowModule = modules[index - 1];

    const draggableId = rowModule
      ? "draggable:module:" + rowModule.id
      : undefined;

    return (
      <ModulesListItem
        key={key}
        draggableId={draggableId}
        index={index}
        module={rowModule}
        style={style}
        showPopoverOn="hover"
      />
    );
  };

  return (
    <div style={{ height: "calc(100vh - 10rem)" }}>
      <AutoSizer>
        {({ width, height }) => (
          <Droppable
            droppableId="droppable:modules-list"
            mode="virtual"
            renderClone={(provided, _, rubric) => {
              const rowModule = modules[rubric.source.index - 1];

              return (
                <ModulesListItem
                  isClone
                  module={rowModule}
                  showPopoverOn="hover"
                  {...provided.dragHandleProps}
                  {...provided.draggableProps}
                />
              );
            }}
          >
            {(provided) => (
              <Flex
                gap="small"
                vertical
                style={{
                  paddingBottom: "1rem",
                }}
              >
                <List
                  /** we use the key to rerender the <List /> component when modulesTab changes, to prevent the rowHeight callback from going stale */
                  key={modulesTab}
                  // ref={provided.innerRef as LegacyRef<List>}
                  id="flamingo-messenger-chat-list"
                  ref={() => {
                    const listEl = document.querySelector<HTMLDivElement>(
                      "#flamingo-messenger-chat-list"
                    );
                    provided.innerRef(listEl!);
                  }}
                  rowCount={(isLoading ? 3 : modules.length) + 1}
                  rowHeight={({ index }) => {
                    const isFirstRow = index === 0;
                    const isLastRow = index === modules.length;

                    if (isFirstRow) {
                      return (
                        194 +
                        16 +
                        (modulesTab === "all" ? 0 : 30) +
                        (!isLoading && modules.length === 0 ? 64 : 0)
                      );
                    }
                    return 64 + 8;
                  }}
                  rowRenderer={rowRenderer}
                  /** react-virtualized requires absolute values for the width and height of the <List /> component */
                  width={width}
                  height={height}
                  style={{
                    padding: "1rem 1.5rem",
                  }}
                />
              </Flex>
            )}
          </Droppable>
        )}
      </AutoSizer>
    </div>
  );
}
