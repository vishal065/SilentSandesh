import { NextResponse } from "next/server";

const apiResponse = (
  success: boolean,
  message: string,
  status: number,
  data?: unknown
) => {
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    { status }
  );
};

export default apiResponse;
