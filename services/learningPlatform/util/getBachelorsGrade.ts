interface GradeInputModule {
  ects: number;
  /** optional to handle pass/fail modules */
  highestGrade?: number | null;
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
export const getBachelorsGrade = (
  modules: GradeInputModule[],
  capstoneGrade: number,
  thesisGrade: number
): number => {
  const CAPSTONE_WEIGHT = CAPSTONE_ECTS * 3;
  const THESIS_WEIGHT = THESIS_ECTS * 3;

  let grades = capstoneGrade * CAPSTONE_WEIGHT + thesisGrade * THESIS_WEIGHT;
  let ects = CAPSTONE_WEIGHT + THESIS_WEIGHT;

  for (const i of modules) {
    if (i.highestGrade != null) {
      grades += i.highestGrade * i.ects;
      ects += i.ects;
    }
  }
  const grade = grades / ects;

  const roundedDownGrade = Math.floor(grade * 10) / 10;

  return roundedDownGrade;
};
