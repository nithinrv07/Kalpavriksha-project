import { NextResponse } from "next/server";
import {
  getStandardCurriculum,
  getSubjectsForStandard,
  isSupportedStandard,
  SUPPORTED_STANDARDS,
} from "@/lib/curriculum";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const standardParam = searchParams.get("standard");

  if (!standardParam) {
    return NextResponse.json({
      supportedStandards: SUPPORTED_STANDARDS,
      message: "Specify ?standard=N (4 to 12) to retrieve standard-specific subjects and chapters.",
    });
  }

  const standard = parseInt(standardParam, 10);
  if (!isSupportedStandard(standard)) {
    return NextResponse.json(
      { error: `Standard ${standardParam} is not supported. Choose a standard between 4 and 12.` },
      { status: 404 },
    );
  }

  const curriculum = getStandardCurriculum(standard);
  const subjects = getSubjectsForStandard(standard);

  return NextResponse.json({
    standard,
    curriculum,
    subjects,
    totalSubjects: subjects.length,
  });
}
