import { NextResponse } from "next/server";

const apiError = (success: boolean, message: string, status: number) => {
  return NextResponse.json(
    {
      success,
      message,
    },
    { status }
  );
};

export default apiError;
