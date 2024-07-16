import { Post, Tag } from "@prisma/client";
import { z } from "zod";

export const createPostInputSchema = z.object({
  title: z.string().min(1,"１文字以上のタイトルを設定してください"),
  content: z.string().max(128,"１２８文字以内で記事を投稿してください"),
  // tags: z.array(z.string()),
  // tags: z.array(z.string()).optional(),
  tags: z.array(z.string()).min(1,"最低１つのタグを選択してください"),
  // ✏️ ①
});

export const updatePostInputSchema = z.object({
  title: z.string(),
  content: z.string().max(128,"１２８文字以内で記事を編集してください"),
  tags: z.array(z.string()).min(1,"最低１つのタグを選択してください"),
  // ✏️ ②
});

export type CreatePostInputSchemaType = z.infer<typeof createPostInputSchema>;
export type UpdatePostInputSchemaType = z.infer<typeof updatePostInputSchema>;


