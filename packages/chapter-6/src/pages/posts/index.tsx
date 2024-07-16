import { gssp } from "@/lib/next/gssp";
import { Post, Tag, prisma } from "@/prisma";
import Link from "next/link";

// type PostWithTags = Post[] & {tags:Tag[]};

type Props = {
  posts: Post[];
  tags: Tag[];
};

const Page = ({ posts, tags }: Props) => {
  return (
    <div>
        <h2>タグ一覧</h2>
      <ul style={{display: "grid", gridTemplateColumns: "repeat(5,1fr)"}}>
        {tags.map((tag) => (
          <li key={tag.id}>
            <Link href={`/tags/${tag.id}`}>{tag.name}</Link>
          </li>
        ))}
      </ul>
      <h1>記事一覧</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps = gssp<Props>(async () => {
  // 📌:6-1 Postテーブルから全件取得
  const posts = await prisma.post.findMany();
  const tags = await prisma.tag.findMany();
  return { props: { posts, tags } };
});

export default Page;
