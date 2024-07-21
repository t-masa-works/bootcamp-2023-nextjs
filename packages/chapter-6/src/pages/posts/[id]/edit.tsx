import { ErrorMessage } from "@/components/ErrorMessage";
import { gssp } from "@/lib/next/gssp";
import { updatePostInputSchema, UpdatePostInputSchemaType } from "@/lib/zod";
import { Post, prisma, Tag } from "@/prisma";
import { updatePost } from "@/services/client/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  post: Post & { tags: Tag[] };
  tags: Tag[];
};

const Page = ({ post, tags }: Props) => {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const { handleSubmit, register, formState, setValue } =
    useForm<UpdatePostInputSchemaType>({
      defaultValues: {
        title: post.title,
        content: post.content || "",
        tags: post.tags.map((tag) => tag.id.toString()),
      }, // 📌:6-3 サーバーで取得したデータを、初期値として設定
      resolver: zodResolver(updatePostInputSchema),
    });

  useEffect(() => {
    if (post.tags) {
      const tagIds = post.tags.map((tag) => tag.id.toString());
      setValue("tags", tagIds);
    }
  }, [tags, setValue]);

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        console.log(values);
        const { data, err } = await updatePost(values, post.id);
        if (err) {
          setError(err.message);
          return;
        }
        router.push(`/posts/${data.id}`);
      })}
    >
      <fieldset style={{ padding: "16px" }}>
        <legend>記事を編集する</legend>
        <div>
          <label>
            title:
            <input type="text" {...register("title")} />
            <ErrorMessage message={formState.errors.title?.message} />
          </label>
        </div>
        <div>
          <label>
            content:
            <textarea {...register("content")} />
            <ErrorMessage message={formState.errors.content?.message} />
          </label>
        </div>
        <div>
          <label>tags:</label>
          {tags.map((tag) => (
            <div key={tag.id}>
              <input
                type="checkbox"
                id={tag.id.toString()}
                value={tag.name}
                defaultChecked={post.tags.some((t) => t.id === tag.id)}
                {...register("tags")}
              />
              <label>{tag.name}</label>
            </div>
          ))}
          <ErrorMessage message={formState.errors.tags?.message} />
        </div>
        {/* <div> ✏️ ② </div> */}
      </fieldset>
      <hr />
      <button>submit</button>
      <ErrorMessage message={error} />
      <hr />
      <ul>
        <li className="back">
          <Link href="/">Back to Top</Link>
        </li>
      </ul>
    </form>
  );
};

export const getServerSideProps = gssp<Props>(async ({ query }) => {
  // パスパラメーターの id を取得、数値として評価できるかを検証
  const { id } = z.object({ id: z.coerce.number() }).parse(query);
  // 📌:6-2 Postテーブルから ID が一致するレコードを取得
  const post = await prisma.post.findUnique({
    where: { id },
    include: { tags: true },
  });
  const tags = await prisma.tag.findMany();
  if (!post) return { notFound: true };
  return { props: { post, tags } };
});

export default Page;
