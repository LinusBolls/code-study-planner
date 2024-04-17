interface GradeInputModule {
  ects: number;
  /** optional to handle pass/fail modules */
  grade?: number | null;

  isCapstone?: boolean;
  isThesis?: boolean;
}

export const CAPSTONE_ECTS = 15;
export const THESIS_ECTS = 15;

/**
 * implementation of §9 (for V1/V2) or §10 (for V3) of the Programme Specific Study and Examination Regulations:
 *
 * > Final grades are calculated as follows: with the exception of the Bachelor Thesis and Capstone Project modules, all graded modules are weighted depending on their ECTS credit points and are included in the final grade. The Bachelor Thesis and Capstone Project modules are weighted at three times their ECTS credit points.
 *
 * @see https://www.notion.so/codeuniversitywiki/Determination-of-Final-Grade-8e0be16695934a44bf3ba0a4c4c0bedd
 */
export const getBachelorsGrade = (modules: GradeInputModule[]): number => {
  let grades = 0;
  let ects = 0;

  for (const i of modules) {
    if (i.grade != null) {
      const multiplier = i.isCapstone || i.isThesis ? 3 : 1;

      grades += i.grade * i.ects * multiplier;
      ects += i.ects * multiplier;
    }
  }
  const grade = grades / ects;

  const roundedDownGrade = Math.floor(grade * 10) / 10;

  return roundedDownGrade;
};
