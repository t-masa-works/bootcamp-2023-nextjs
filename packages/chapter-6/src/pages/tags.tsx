import { GetServerSideProps } from 'next';
import { prisma } from '@/prisma';
import Link from 'next/link';

type Props = {
  tags: { id: number; name: string }[];
};

const TagsPage = ({ tags }: Props) => {
  return (
    <div>
      <h1>タグ一覧</h1>
      <ul>
        {tags.map(tag => (
          <li key={tag.id}>
            <Link href={`/tags/${tag.id}`}>{tag.name}</Link>
          </li>
        ))}
      </ul>
      <ul>
        <li className="back"><Link href="/">Back to Top</Link></li>
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const tags = await prisma.tag.findMany();
  return {
    props: { tags },
  };
};

export default TagsPage;
