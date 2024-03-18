import { Droppable } from "@hello-pangea/dnd";
import { Checkbox, Flex, Input } from "antd";
import ModulesListItem from "./ModulesListItem";
import { Module } from "@/app/useSemesters";

export interface ModulesSearchProps {
  modules: Module[];

  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;

  onlyMandaryOrCompulsoryElective: boolean;
  onOnlyMandaryOrCompulsoryElectiveChange: (value: boolean) => void;

  onlyAlternativeAssessment: boolean;
  onOnlyAlternativeAssessmentChange: (value: boolean) => void;

  onlyEarlyAssessment: boolean;
  onOnlyEarlyAssessmentChange: (value: boolean) => void;
}
export default function ModulesSearch({
  modules,

  searchQuery,
  onSearchQueryChange,

  onlyMandaryOrCompulsoryElective,
  onOnlyMandaryOrCompulsoryElectiveChange,

  onlyAlternativeAssessment,
  onOnlyAlternativeAssessmentChange,

  onlyEarlyAssessment,
  onOnlyEarlyAssessmentChange,
}: ModulesSearchProps) {
  return (
    <Flex
      vertical
      gap="middle"
      style={{
        height: "calc(100vh - 6rem)",
        padding: "1rem 1.5rem 0 1.5rem",
        overflowY: "scroll",
      }}
    >
      <Input
        type="search"
        placeholder="Search by name, study program, or professor"
        value={searchQuery}
        onChange={(e) => onSearchQueryChange?.(e.target.value)}
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
      <Droppable droppableId="droppable:modules-list">
        {(provided) => (
          <Flex
            gap="small"
            vertical
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              paddingBottom: "1rem",
            }}
          >
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
