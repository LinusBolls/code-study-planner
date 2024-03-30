/**
 * @see https://www.notion.so/codeuniversitywiki/Grades-and-Levels-91805a52f1274e7b9c48adf0a79d2fce
 */
export const getGradeInfo = (grade?: number | null) => {
  if (grade == null) return { passed: false, level: 0 };

  if (grade >= 5) return { passed: false, level: 0 };
  if (grade > 2.7) return { passed: true, level: 1 };
  if (grade > 2) return { passed: true, level: 2 };
  if (grade <= 2) return { passed: true, level: 3 };

  return { passed: false, level: 0 };
};
