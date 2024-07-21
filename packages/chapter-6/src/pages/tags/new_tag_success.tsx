import Link from "next/link";
import { useRouter } from "next/router";

const TagSuccessPage = () => {
  const router = useRouter();
  const { tagName } = router.query;

  return (
    <div>
      <h1>タグ「{tagName}」を新規作成しました！</h1>
      <ul>
        <li>
          <Link href="/tags/addTag">Create New Tag</Link>
        </li>
        <li>
          <Link href="/tags">Tag List</Link>
        </li>
        <li className="back">
          <Link href="/">Back To Top</Link>
        </li>
      </ul>
    </div>
  );
};

export default TagSuccessPage;
