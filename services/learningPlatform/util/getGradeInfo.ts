export type GradeInfo =
  | {
      valid: false;
      passed: false;
      level: null;
    }
  | {
      valid: true;
      passed: false;
      level: null;
    }
  | {
      valid: true;
      passed: true;
      level: number | null;
    };

/**
 * @returns {Object} - an object with the following properties:
 * - valid: boolean - whether the grade is either (1) a number between 1 inclusive and 4 inclusive, (2) exactly 5, or (3) exactly 0
 * - passed: boolean - whether the grade is a number between 1 inclusive and 4 inclusive, or exactly 0 for ungraded modules
 * - level: number | null - the level of the grade, if it is valid and passed
 *
 * @see https://www.notion.so/codeuniversitywiki/Grades-and-Levels-91805a52f1274e7b9c48adf0a79d2fce
 */
export const getGradeInfo = (grade?: number | null): GradeInfo => {
  if (
    typeof grade !== "number" ||
    (grade > 4 && grade !== 5) ||
    (grade < 1 && grade !== 0)
  )
    return { valid: false, passed: false, level: null };

  if (grade === 0) return { valid: true, passed: true, level: null };
  if (grade === 1) return { valid: true, passed: true, level: 3 };
  if (grade <= 1.7) return { valid: true, passed: true, level: 2 };
  if (grade <= 2.3) return { valid: true, passed: true, level: 1 };
  if (grade <= 4) return { valid: true, passed: true, level: 0 };
  if (grade === 5) return { valid: true, passed: false, level: null };

  throw new Error(
    "[getGradeInfo] reached an impossible state for grade " + grade,
  );
};
