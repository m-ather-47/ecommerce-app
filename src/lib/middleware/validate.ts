import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { errorResponse } from "@/lib/errors";

type RouteContext = { params: Promise<Record<string, string>> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyHandlerFn = (req: any, context: RouteContext) => Promise<NextResponse>;

export function withValidation(schema: ZodSchema) {
  return (handler: AnyHandlerFn): AnyHandlerFn => {
    return async (req: NextRequest, context: RouteContext): Promise<NextResponse> => {
      try {
        const body = await req.clone().json();
        schema.parse(body);
        return handler(req, context);
      } catch (error) {
        return errorResponse(error);
      }
    };
  };
}
