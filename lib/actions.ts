"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

export const createPitch = async (
  prevState: any,
  formData: FormData,
  pitch: string
) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not signed in",
    });
  }

  const { title, description, category, link } = Object.fromEntries(
    Array.from(formData).filter(([key]) => key !== "pitch")
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const startup = {
      title,
      description,
      category,
      link,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
    };

    const result = await writeClient.create({
      _type: "startup",
      ...startup,
    });

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    return parseServerActionResponse({
      status: "ERROR",
      error: JSON.stringify(error),
    });
  }
};