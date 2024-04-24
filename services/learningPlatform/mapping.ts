import { Module } from "@/components/util/types";
import { LP } from "code-university";
import dayjs from "dayjs";

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
      frequency: i.module?.frequency!,
      prerequisites: i.module?.prerequisites?.map((i) => i.id) ?? [],
      prerequisiteFor: i.module?.prerequisiteFor?.map((i) => i.id) ?? [],
    };
  };

export const getModuleUrl = (moduleIdentifier: string, shortCode: string) => {
  if (!moduleIdentifier) {
    return "#";
  }
  return (
    "https://app.code.berlin/module/" +
    moduleIdentifier +
    // "?shortCode=" + shortCode +
    "?table=description"
  );
};

export const getModuleRegisterUrl = (moduleId: string) => {
  if (!moduleId) {
    return "#";
  }
  return "https://app.code.berlin/modules/" + moduleId + "/register";
};

export const getUserUrl = (coordinatorId: string) => {
  if (!coordinatorId) {
    return "#";
  }
  return "https://app.code.berlin/users/" + coordinatorId + "?table=projects";
};

export const getSemesterName = (startDate?: dayjs.Dayjs | null) => {
  if (!startDate) return "Unknown Semester";

  const isSpringSemester = startDate.month() < 6;

  const season = isSpringSemester ? "Spring" : "Fall";

  return season + " " + startDate.year();
};

export const getRelativeSemesterTime = (offset: number) => {
  if (offset === 0) {
    return "Current semester";
  }
  if (offset === 1) {
    return "Next semester";
  }
  if (offset === -1) {
    return "6 months ago";
  }
  if (offset === 2) {
    return `In 1 year`;
  }
  if (offset === -2) {
    return `1 year ago`;
  }
  if (offset > 0) {
    return `In ${offset / 2} years`;
  }
  if (offset < 0) {
    return `${Math.abs(offset) / 2} years ago`;
  }
};
