import { describe, expect, test } from "vitest";
import { getGradeInfo } from "./getGradeInfo";

describe("getGradeInfo", () => {
  test("is invalid if the grade is not a number", () => {
    expect(getGradeInfo(null)).toEqual({
      valid: false,
      passed: false,
      level: null,
    });
    expect(getGradeInfo(undefined)).toEqual({
      valid: false,
      passed: false,
      level: null,
    });
  });
  test("is valid if the grade is between 1.0 and 4.0", () => {
    expect(getGradeInfo(1)).toEqual({
      valid: true,
      passed: true,
      level: 3,
    });
    expect(getGradeInfo(1.7)).toEqual({
      valid: true,
      passed: true,
      level: 2,
    });
    expect(getGradeInfo(2.3)).toEqual({
      valid: true,
      passed: true,
      level: 1,
    });
    expect(getGradeInfo(4)).toEqual({
      valid: true,
      passed: true,
      level: 0,
    });
  });
  test("is invalid if the grade is < 1.0", () => {
    expect(getGradeInfo(0.9)).toEqual({
      valid: false,
      passed: false,
      level: null,
    });
    expect(getGradeInfo(-69)).toEqual({
      valid: false,
      passed: false,
      level: null,
    });
  });
  test("is invalid if the grade is > 4.0", () => {
    expect(getGradeInfo(4.1)).toEqual({
      valid: false,
      passed: false,
      level: null,
    });
    expect(getGradeInfo(5.1)).toEqual({
      valid: false,
      passed: false,
      level: null,
    });
  });
  test("is failed if the grade is exactly 5.0", () => {
    expect(getGradeInfo(5)).toEqual({
      valid: true,
      passed: false,
      level: null,
    });
  });
});
