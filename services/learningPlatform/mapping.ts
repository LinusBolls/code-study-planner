import { Module } from "@/app/useSemesters";
import { LP } from "code-university";

export const toModule =
  (mandatoryModuleIds: string[]) =>
  (i: LP.ViewerSemesterModule | LP.SemesterModule): Module => {
    const moduleId = i.module!.id;

    const isMandatory = mandatoryModuleIds.includes(moduleId + "|MANDATORY");
    const isCompulsoryElective = mandatoryModuleIds.includes(
      moduleId + "|COMPULSORY_ELECTIVE"
    );
    return {
      id: i.id,
      moduleIdentifier: i.moduleIdentifier!,
      moduleId,
      title: i.module?.title!,
      coordinatorName: i.module?.coordinator?.name!,
      url: getModuleUrl(i.moduleIdentifier!, i.module?.simpleShortCode!),
      registerUrl: getModuleRegisterUrl(i.id),
      coordinatorUrl: getUserUrl(i.module?.coordinator?.id!),
      shortCode: i.module?.simpleShortCode!,

      ects: i.module?.ects!,
      isMandatory,
      isCompulsoryElective,
      departmentId: i.module?.department?.abbreviation!,

      allowEarlyAssessment:
        i.module?.semesterModules[0]?.allowsEarlyAssessment!,
      allowAlternativeAssessment:
        !i.module?.semesterModules[0]?.disabledAlternativeAssessment,
      isGraded: i.module?.graded ?? false,
    };
  };

export const getModuleUrl = (moduleIdentifier: string, shortCode: string) => {
  return (
    "https://app.code.berlin/module/" +
    moduleIdentifier +
    // "?shortCode=" + shortCode +
    "?table=description"
  );
};

export const getModuleRegisterUrl = (moduleId: string) => {
  return "https://app.code.berlin/modules/" + moduleId + "/register";
};

export const getUserUrl = (coordinatorId: string) => {
  return "https://app.code.berlin/users/" + coordinatorId + "?table=projects";
};
