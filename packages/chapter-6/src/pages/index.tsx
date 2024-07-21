import Link from "next/link";

const Page = () => {
  return (
    <ul>
      <li>
        <Link href="/posts">Posts</Link>
      </li>
      <li>
        <Link href="/posts/new">Posts New</Link>
      </li>
      <li>
        <Link href="/tags">Tag List</Link>
      </li>
      <li>
        <Link href="/tags/addTag">Create New Tag</Link>
      </li>
    </ul>
  );
};

export default Page;
