import React from "react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ModulesSearch from ".";
import { DragDropContext } from "@hello-pangea/dnd";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock("react-virtualized", () => ({
  List: ({ rowRenderer, rowCount }: any) => (
    <div>
      {[...Array(rowCount).keys()].map((index) =>
        rowRenderer({ key: index, index, style: {} })
      )}
    </div>
  ),
  AutoSizer: ({ children: renderFunc }: any) => (
    <div>{renderFunc(69, 420)}</div>
  ),
}));

describe("ModulesSearch", () => {
  it("renders the search filters and placeholder text when empty", async () => {
    render(
      <DragDropContext onDragEnd={() => {}}>
        <ModulesSearch
          onModulesTabChange={() => {}}
          onOnlyAlternativeAssessmentChange={() => {}}
          onOnlyEarlyAssessmentChange={() => {}}
          onOnlyMandatoryOrCompulsoryElectiveChange={() => {}}
          onSearchQueryChange={() => {}}
          onlyAlternativeAssessment={false}
          onlyEarlyAssessment={false}
          onlyMandatoryOrCompulsoryElective={false}
        />
      </DragDropContext>
    );

    const buttonElement = screen.getByText(/Allows alternative assessment/i);
    expect(buttonElement).toBeInTheDocument();

    expect(screen.getByText(/My Semester/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Search by name, study program, or professor/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/no modules found/i)).toBeInTheDocument();
  });
  it("renders the search filters and items when it has items", async () => {
    render(
      <DragDropContext onDragEnd={() => {}}>
        <ModulesSearch
          modules={[
            {
              id: "1",
              retired: false,
              allowsRegistration: true,
              moduleIdentifier: "ID_01",
              moduleId: "1",
              title: "Composition",
              coordinatorName: "Martin Knobel",
              url: "#",
              registerUrl: "#",
              coordinatorUrl: "#",
              shortCode: "ID_01",
              ects: 5,
              isMandatory: false,
              isCompulsoryElective: false,
              departmentId: "ID",
              allowEarlyAssessment: true,
              allowAlternativeAssessment: true,
              isGraded: true,

              frequency: "EVERY_SEMESTER",
              prerequisites: [],
              prerequisiteFor: [],
            },
          ]}
          onModulesTabChange={() => {}}
          onOnlyAlternativeAssessmentChange={() => {}}
          onOnlyEarlyAssessmentChange={() => {}}
          onOnlyMandatoryOrCompulsoryElectiveChange={() => {}}
          onSearchQueryChange={() => {}}
          onlyAlternativeAssessment={false}
          onlyEarlyAssessment={false}
          onlyMandatoryOrCompulsoryElective={false}
        />
      </DragDropContext>
    );

    const buttonElement = screen.getByText(/Allows alternative assessment/i);
    expect(buttonElement).toBeInTheDocument();

    expect(screen.getByText(/My Semester/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Search by name, study program, or professor/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Composition/i)).toBeInTheDocument();
  });
});
