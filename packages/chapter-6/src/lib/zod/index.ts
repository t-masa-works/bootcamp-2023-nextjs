import { z } from "zod";

export const createPostInputSchema = z.object({
  title: z.string(),
  content: z.string().max(128,"１２８文字以内で記事を投稿してください"),
  // tags: z.array(z.string()),
  tags: z.string().array(),
  // ✏️ ①
});

export const updatePostInputSchema = z.object({
  title: z.string(),
  content: z.string().max(128,"１２８文字以内で記事を編集してください"),
  // ✏️ ②
});

export type CreatePostInputSchemaType = z.infer<typeof createPostInputSchema>;
export type UpdatePostInputSchemaType = z.infer<typeof updatePostInputSchema>;
