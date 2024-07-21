import {
  CreatePostInputSchemaType,
  CreateTagSchemaType,
  UpdatePostInputSchemaType,
} from "@/lib/zod";
import { Post, Tag } from "@/prisma";
import {
  handleFetchReject,
  handleFetchResolve,
} from "@/services/client/apiRoutes";
import { Result } from "@/type";

export const createPost = (
  input: CreatePostInputSchemaType
): Promise<Result<Post>> => {
  return fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then((res) => handleFetchResolve<Post>(res))
    .catch(handleFetchReject);
};

export const updatePost = (
  input: UpdatePostInputSchemaType,
  id: number
): Promise<Result<Post>> => {
  return fetch(`/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then((res) => handleFetchResolve<Post>(res))
    .catch(handleFetchReject);
};

export const createTag = (
  input: CreateTagSchemaType,
): Promise<Result<Tag>> => {
  return fetch("/api/tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then((res) => handleFetchResolve<Tag>(res))
    .catch(handleFetchReject);
};