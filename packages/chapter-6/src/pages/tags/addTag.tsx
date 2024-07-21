import { ErrorMessage } from "@/components/ErrorMessage";
import { createTagSchema, CreateTagSchemaType } from "@/lib/zod";
import { prisma, Tag } from "@/prisma";
import { createTag } from "@/services/client/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  allTag: Tag[];
};

const AddTag = ({ allTag }: Props) => {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const { handleSubmit, register, formState } = useForm<CreateTagSchemaType>({
    resolver: zodResolver(createTagSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        console.log(values);
        const duplicateTag = allTag.find((tag) => tag.name === values.name);

        if (duplicateTag) {
          setError(
            "同一のタグ名が既に存在します。別のタグ名を使用してください。"
          );
          return;
        }

        const { data, err } = await createTag(values);
        if (err) {
          setError(err.message);
          return;
        }
        router.push(
          `/tags/new_tag_success?tagName=${encodeURIComponent(values.name)}`
        );
      })}
    >
      <fieldset style={{ padding: "16px" }}>
        <legend>新規タグの追加</legend>
        <div>
          <label>
            New Tag:
            <input type="text" {...register("name")} />
            <ErrorMessage message={formState.errors.name?.message} />
          </label>
        </div>
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

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const allTag = await prisma.tag.findMany();
  return { props: { allTag } };
};

export default AddTag;
