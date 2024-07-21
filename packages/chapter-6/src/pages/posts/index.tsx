import { gssp } from "@/lib/next/gssp";
import { Post, Tag, prisma } from "@/prisma";
import Link from "next/link";

type PostWithTags = Post & { tags: Tag[] };

type Props = {
  posts: PostWithTags[];
  tags: Tag[];
};

const Page = ({ posts, tags }: Props) => {
  return (
    <div>
      <ul>
        <li className="back">
          <Link href={`/`}>Back to Top</Link>
        </li>
      </ul>
      <h2>タグ一覧</h2>
      <ul style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)" }}>
        {tags.map((tag) => (
          <li key={tag.id}>
            <Link href={`/tags/${tag.id}`}>{tag.name}</Link>
          </li>
        ))}
      </ul>
      <hr />
      <h1>記事一覧</h1>
      <ul>
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  style={{
                    marginLeft: "10px",
                    fontSize: "12px",
                    color: "gray",
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </li>
          ))
        ) : (
          <p>記事がありません</p>
        )}
      </ul>
    </div>
  );
};

export const getServerSideProps = gssp<Props>(async () => {
  // 📌:6-1 Postテーブルから全件取得
  try {
    const posts = await prisma.post.findMany({
      include: {
        tags: true,
      },
    });
    const tags = await prisma.tag.findMany();
    return { props: { posts, tags } };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { props: { posts: [], tags: [] } };
  }
});

export default Page;
