import { apiHandler } from "@/lib/next/apiRoutes";
import { createPostInputSchema } from "@/lib/zod";
import { Post, prisma } from "@/prisma";
import { succeed } from "@/services/client/apiRoutes";
import type { ApiHandler } from "@/type";
import { z } from "zod";

export type CreatePostInput = z.infer<typeof createPostInputSchema>;
export type CreatePostResponse = Post;

const handlePost = apiHandler<CreatePostResponse>(async (req, res) => {
  const data = createPostInputSchema.parse(req.body);
  const tags = await prisma.tag.findMany({
    where: {
      name: { in: data.tags },
    },
  });
  const tagIds = tags.map((tag) => ({ id: tag.id }));

  console.log("Parsed tags:", tagIds);

  const postData: {
    title: string;
    content: string;
    tags?: { connect: { id: number }[] };
  } = {
    title: data.title,
    content: data.content,
  };

  if (tagIds.length > 0) {
    postData.tags = { connect: tagIds };
  } else {
    postData.tags = undefined;
  }

  const result = await prisma.post.create({
    data: postData,
  });
  res.status(201).json(succeed(result));
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
