import { Droppable } from "@hello-pangea/dnd";
import { AutoComplete, Checkbox, Flex, Segmented, Typography } from "antd";
import ModulesListItem from "../ModulesListItem";
import { Module } from "@/app/useSemesters";
import { SegmentedLabeledOption, SegmentedOptions } from "antd/es/segmented";

const getOptions = (values: string[]) => {
  return values.map((i) => ({
    value: i,
    label: i,
  }));
};

export interface ModulesSearchProps {
  modules: Module[];

  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;

  onlyMandatoryOrCompulsoryElective: boolean;
  onOnlyMandatoryOrCompulsoryElectiveChange: (value: boolean) => void;

  onlyAlternativeAssessment: boolean;
  onOnlyAlternativeAssessmentChange: (value: boolean) => void;

  onlyEarlyAssessment: boolean;
  onOnlyEarlyAssessmentChange: (value: boolean) => void;

  modulesTab: string;
  onModulesTabChange: (value: string) => void;

  isLoading?: boolean;
  currentTabIsEmpty?: boolean;
}
export default function ModulesSearch({
  modules,

  searchQuery,
  onSearchQueryChange,

  onlyMandatoryOrCompulsoryElective: onlyMandaryOrCompulsoryElective,
  onOnlyMandatoryOrCompulsoryElectiveChange:
    onOnlyMandaryOrCompulsoryElectiveChange,

  onlyAlternativeAssessment,
  onOnlyAlternativeAssessmentChange,

  onlyEarlyAssessment,
  onOnlyEarlyAssessmentChange,

  modulesTab,
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
  ];
  const activeTab = modulesTabs.find((tab) => tab.value === modulesTab);

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
        options={getOptions([
          "se 10 ects",
          "fatma meawad",
          "requires project",
          "mandatory",
          "level 0",
        ])}
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
      <Droppable droppableId="droppable:modules-list">
        {(provided) => (
          <Flex
            gap="small"
            vertical
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              paddingBottom: "1rem",
              // boxShadow: "inner rgba(29, 35, 41, 0.05) 0px 2px 8px 0px",
            }}
          >
            {isLoading && (
              <>
                <ModulesListItem
                  index={0}
                  draggableId={"draggable:semester-module:" + module.id}
                />
                <ModulesListItem
                  index={1}
                  draggableId={"draggable:semester-module:" + module.id}
                />
                <ModulesListItem
                  index={2}
                  draggableId={"draggable:semester-module:" + module.id}
                />
              </>
            )}
            {modules.map((module, idx) => (
              <ModulesListItem
                draggableId={"draggable:module:" + module.id}
                key={module.id}
                index={idx}
                module={module}
              />
            ))}
          </Flex>
        )}
      </Droppable>
    </Flex>
  );
}
