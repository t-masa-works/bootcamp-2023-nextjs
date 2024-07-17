import { prisma } from "@/prisma";
import { GetServerSideProps } from "next";
import Link from "next/link";

type Props = {
  posts: { id: number; title: string }[];
  tag: { id: number; name: string };
};

const TagPage = ({ posts, tag }: Props) => {
  return (
    <div>
      <h1>{tag.name} の記事一覧</h1>
      <ul style={{display: "grid", gridTemplateColumns: "repeat(5,1fr)" }}>
        {posts.map((post, tag) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
      <ul>
        <li className="back">
          <Link href="/tags">Back to Tags</Link>
        </li>
        <li className="back">
          <Link href="/">Back to Top</Link>
        </li>
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tagId = parseInt(context.params?.tagId as string, 10);

  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
  });

  if (!tag) {
    return { notFound: true };
  }

  const posts = await prisma.post.findMany({
    where: {
      tags: {
        some: { id: tagId },
      },
    },
  });

  return {
    props: { posts, tag },
  };
};

export default TagPage;
