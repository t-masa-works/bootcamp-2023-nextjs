import { apiHandler } from "@/lib/next/apiRoutes";
import { createTagSchema } from "@/lib/zod";
import { Tag, prisma } from "@/prisma";
import { succeed } from "@/services/client/apiRoutes";
import type { ApiHandler } from "@/type";
import { z } from "zod";

export type createTag = z.infer<typeof createTagSchema>;
export type CreateTagResponse = Tag;

const handlePost = apiHandler<CreateTagResponse>(async (req, res) => {
  const data = createTagSchema.parse(req.body);
  const tag = await prisma.tag.create({ data });
  res.status(201).json(succeed(tag));
});

const handler: ApiHandler = (req, res) => {
  switch (req.method) {
    case "POST":
      return handlePost(req, res);
    default:
      res.status(405).end();
      return;
  }
};

export default handler;
