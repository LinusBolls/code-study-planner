import { Module } from "@/app/useSemesters";
import { LP } from "code-university";

export const toModule =
  (mandatoryModuleIds: string[]) =>
  (i: LP.ViewerSemesterModule | LP.SemesterModule): Module => {
    return {
      id: i.id,
      title: i.module?.title!,
      coordinatorName: i.module?.coordinator?.name!,
      url:
        "https://app.code.berlin/module/" +
        i.moduleIdentifier +
        "?shortCode=" +
        i.module?.shortCode +
        "&table=description",
      coordinatorUrl:
        "https://app.code.berlin/users/" +
        i.module?.coordinator?.id! +
        "?table=projects",
      registerUrl: "https://app.code.berlin/modules/" + i.id + "/register",
      shortCode: i.module?.simpleShortCode!,

      ects: i.module?.ects!,
      isMandatory: mandatoryModuleIds.includes(i.module!.id + "|MANDATORY"),
      isCompulsoryElective: mandatoryModuleIds.includes(
        i.module!.id + "|COMPULSORY_ELECTIVE"
      ),
      departmentId: i.module?.department?.abbreviation!,

      allowEarlyAssessment:
        i.module?.semesterModules[0]?.allowsEarlyAssessment!,
      allowAlternativeAssessment:
        !i.module?.semesterModules[0]?.disabledAlternativeAssessment,
      isGraded: i.module?.graded ?? false,
    };
  };
