import { NextResponse } from "next/server";

export const successResponse = () => NextResponse.json({ ok: true });
export const badRequestResponse = () =>
  NextResponse.json({ ok: false }, { status: 400 });
export const unauthorizedResponse = () =>
  NextResponse.json({ ok: false }, { status: 401 });
export const internalServerErrorResponse = () =>
  NextResponse.json({ ok: false }, { status: 500 });

export type StudyPlanParams = {
  params: {
    id: string;
  };
};
