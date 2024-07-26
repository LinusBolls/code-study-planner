import { describe, expect, test } from "vitest";

import { getBachelorsGrade } from "./getBachelorsGrade";

describe("getBachelorsGrade", () => {
  test("adds up the weighted grades", () => {
    const modules = [
      {
        ects: 5,
        grade: 2.7,
      },
      {
        ects: 4,
        grade: 2.3,
      },
      {
        ects: 10,
        grade: 2,
      },
    ];
    expect(getBachelorsGrade(modules)).toBe(2.2);
  });
  test("ignores ungraded modules", () => {
    const modules = [
      {
        ects: 5,
        grade: 0,
      },
      {
        ects: 5,
        grade: 2.7,
      },
      {
        ects: 5,
        grade: 2.3,
      },
      {
        ects: 5,
        grade: null,
      },
      {
        ects: 5,
        grade: 2,
      },
      {
        ects: 4,
        grade: null,
      },
      {
        ects: 8,
        grade: 0,
      },
      {
        ects: 4,
        grade: null,
      },
      {
        ects: 4,
        grade: 0,
      },
    ];
    expect(getBachelorsGrade(modules)).toBe(2.3);
  });
  test("ignores failed modules", () => {
    const modules = [
      {
        ects: 5,
        grade: 2.7,
      },
      {
        ects: 5,
        grade: 2.3,
      },
      {
        ects: 5,
        grade: 2,
      },
      {
        ects: 8,
        grade: 5,
      },
      {
        ects: 4,
        grade: 5,
      },
      {
        ects: 4,
        grade: 5,
      },
    ];
    expect(getBachelorsGrade(modules)).toBe(2.3);
  });
  test("weighs thesis and capstone correctly", () => {
    const modules = [
      {
        ects: 5,
        grade: 2.7,
      },
      {
        ects: 5,
        grade: 2.3,
      },
      {
        ects: 5,
        grade: 2,
      },
      {
        ects: 8,
        grade: 5,
      },
      {
        ects: 4,
        grade: 5,
      },
      {
        ects: 4,
        grade: 5,
      },
      {
        isThesis: true,
        ects: 15,
        grade: 2,
      },
      {
        isCapstone: true,
        ects: 15,
        grade: 1.6,
      },
    ];
    expect(getBachelorsGrade(modules)).toBe(1.8);
  });
});
