import { LearningPlatformClient } from "code-university";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

import { AppDataSource, connectToDatabase } from "@/backend/datasource";
import { ModuleHandbook } from "@/backend/entities/moduleHandbook.entity";
import { Semester } from "@/backend/entities/semester.entity";
import { StudyPlan } from "@/backend/entities/studyPlan.entity";
import {
  CollaboratorRole,
  StudyPlanCollaborator,
} from "@/backend/entities/studyPlanCollaborator.entity";
import { User } from "@/backend/entities/user.entity";
import { issueAccessToken } from "@/backend/jwt";
import { isDefined } from "@/services/learningPlatform/util/isDefined";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const body: { learningPlatformToken: string } = await req.json();

  const learningPlatform = await LearningPlatformClient.fromAnyToken(
    body.learningPlatformToken,
  );
  const learningPlatformUser = await learningPlatform!.raw
    .query<"me">(`query currentUser {
    me {
      id
      firstName
      lastName
      name
      email
      avatarUrl
      role
      grants
      mandatoryModules
      permissions
      userEventStreamLink
      __typename

      moduleHandbooks {
        moduleHandbook {
          id
        }
      }
    }
    underMaintanance
  }`);

  const userRepository = AppDataSource.getRepository(User);
  const moduleHandbookRepository = AppDataSource.getRepository(ModuleHandbook);

  const moduleHandbookLpId =
    learningPlatformUser.me.moduleHandbooks![0]?.moduleHandbook?.id;

  const moduleHandbook = await moduleHandbookRepository.findOne({
    where: {
      lpId: moduleHandbookLpId,
    },
  });

  if (!moduleHandbook) {
    return NextResponse.json(
      {
        message: `module handbook with learningplatform id '${moduleHandbookLpId}' not found in database`,
      },
      { status: 400 },
    );
  }

  const existingUser = await userRepository.findOneBy({
    lpId: learningPlatformUser.me.id,
  });

  const isSignup = existingUser == null;

  let newUser: User | null = null;

  if (isSignup) {
    await AppDataSource.transaction(async (transaction) => {
      newUser = new User();

      newUser.lpId = learningPlatformUser.me.id;

      const studyPlan = new StudyPlan();

      studyPlan.moduleHandbookId = moduleHandbook.id;

      const newStudyPlan = await transaction
        .getRepository(StudyPlan)
        .save(studyPlan);

      const studyPlanCollaborator = new StudyPlanCollaborator();
      studyPlanCollaborator.hasAccepted = true;
      studyPlanCollaborator.role = CollaboratorRole.Owner;

      studyPlanCollaborator.studyPlanId = newStudyPlan.id;

      await transaction
        .getRepository(StudyPlanCollaborator)
        .save(studyPlanCollaborator);

      newUser.studyPlanCollaboratorId = studyPlanCollaborator.id;

      await transaction.getRepository(User).save(newUser);

      const myStudiesData = await learningPlatform.raw.query(
        `query myStudies($filter: ModuleFilter) {
        myStudies(filter: $filter) {
          ...myStudies
          __typename
        }
        coordinatorUsers {
          ...UserListItem
          __typename
        }
      }
      
      fragment myStudies on MyStudiesModule {
        id
        simpleShortCode
        status
        title
        coordinator {
          id
          name
          __typename
        }
        moduleType
        moduleIdentifier
        ...Assessments
        __typename
      }
      
      fragment Assessments on MyStudiesModule {
        assessments {
          # this is new
          semester {
            id
            name
          }
          assessmentStyle
          submittedOn
          # / this is new
          id
          proposalStatus
          assessor {
            id
            name
            __typename
          }
          grade
          externalFeedback
          assessmentType
          assessmentStatus
          event {
            id
            startTime
            createdAt
            __typename
          }
          createdAt
          semesterModule {
            id
            module {
              id
              title
              shortCode
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      
      fragment UserListItem on User {
        id
        firstName
        lastName
        name
        email
        inactive
        role
        slackLink
        skills {
          id
          isHighlighted
          skill {
            name
            __typename
          }
          __typename
        }
        avatarUrl
        __typename
      }`,
      );

      const myPastAssessments = myStudiesData
        .myStudies!.filter(isDefined)
        .flatMap((i) => i.assessments?.map((j) => ({ ...j, module: i })) ?? []);

      const semestersData = await learningPlatform.raw.query(
        `query allSemesters($pagination: OffsetPaginationInput) {
        semesters(pagination: $pagination) {
            id
            name
            startDate
        }
      }`,
      );

      const allSemesters = (semestersData.semesters ?? []).toReversed();

      const indexOfFirstSemesterWithAssessments =
        myPastAssessments
          .map((i) => allSemesters.findIndex((j) => j.id === i.semester!.id))
          .toSorted((a, b) => a - b)[0] ?? 0;

      const semestersInScope = allSemesters.slice(
        indexOfFirstSemesterWithAssessments,
      );

      const semesterRepository = transaction.getRepository(Semester);

      const numVirtualSemesters = Math.max(0, 10 - semestersInScope.length);

      const lastExistingSemesterDate = dayjs(
        semestersInScope[semestersInScope.length - 1]?.startDate ?? new Date(),
      );

      for (const semester of semestersInScope) {
        const newSemester = new Semester();

        newSemester.lpId = semester.id;
        newSemester.studyPlanId = newStudyPlan.id;
        newSemester.startDate = semester.startDate;

        await semesterRepository.save(newSemester);
      }

      for (let i = 0; i < numVirtualSemesters; i++) {
        const newSemester = new Semester();

        newSemester.studyPlanId = newStudyPlan.id;
        newSemester.startDate = lastExistingSemesterDate
          .add((i + 1) * 6, "months")
          .toDate();

        await semesterRepository.save(newSemester);
      }
    });
  }
  const studyPlannerUser = (newUser || existingUser)!;

  const accessToken = await issueAccessToken(studyPlannerUser);

  const res = NextResponse.json(
    {
      studyPlannerUser,
      learningPlatformUser,
      accessToken,
    },
    { status: isSignup ? 201 : 200 },
  );
  res.headers.set("set-cookie", accessToken);

  return res;
}
