'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ArticleForm from '@/components/admin/ArticleForm';

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/articles/${id}`)
      .then((r) => r.json())
      .then(setArticle);
  }, [id]);

  if (!article) {
    return <p className="text-[14px] text-[#6c757d]">加载中...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e]">编辑文章</h1>
      <p className="mt-1 text-[14px] text-[#6c757d]">修改三种语言的文章内容。</p>
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <ArticleForm initial={article} />
      </div>
    </div>
  );
}
