/**
 * @see https://www.notion.so/codeuniversitywiki/Grades-and-Levels-91805a52f1274e7b9c48adf0a79d2fce
 */
export const getGradeInfo = (grade?: number | null) => {
  if (grade == null || grade > 4) return { passed: false, level: null };

  if (grade == 1) return { passed: true, level: 3 };
  if (grade <= 1.7) return { passed: true, level: 2 };
  if (grade <= 2.3) return { passed: true, level: 1 };
  if (grade <= 4) return { passed: true, level: 0 };

  return { passed: false, level: null };
};
