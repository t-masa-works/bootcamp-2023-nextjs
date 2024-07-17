import { ErrorMessage } from "@/components/ErrorMessage";
import { createPostInputSchema, CreatePostInputSchemaType } from "@/lib/zod";
import { prisma } from "@/prisma";
import { createPost } from "@/services/client/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  tags: { id: number; name: string;}[];
}

const Page = ({ tags }: Props) => {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const { handleSubmit, register, formState } =
    useForm<CreatePostInputSchemaType>({
      resolver: zodResolver(createPostInputSchema),
      defaultValues: { tags: [] },
    });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        console.log(values);
        const { data, err } = await createPost(values);
        if (err) {
          setError(err.message);
          return;
        }
        router.push(`/posts/${data.id}`);
      })}
    >
      <fieldset style={{ padding: "16px" }}>
        <legend>記事を書く</legend>
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
                {...register("tags")}
              />
              <label>{tag.name}</label>
            </div>
          ))}
          <ErrorMessage message={formState.errors.tags?.message} />
        </div>
        {/* <div> ✏️ ① </div> */}
      </fieldset>
      <hr />
      <button>submit</button>
      <ErrorMessage message={error} />
      <hr />
      <ul>
        <li className="back"><Link href="/">Back to Top</Link></li>
      </ul>
    </form>
  );
};


export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const tags = await prisma.tag.findMany();
    return {
      props: { tags },
    };
  } catch (error) {
    console.error("Failed to fetch tags", error);
    return {
      notFound: true,
    };
  }
};

export default Page;
