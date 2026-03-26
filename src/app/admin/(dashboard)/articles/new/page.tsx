import ArticleForm from '@/components/admin/ArticleForm';

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e]">发布新文章</h1>
      <p className="mt-1 text-[14px] text-[#6c757d]">填写三种语言的文章内容后发布。</p>
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <ArticleForm />
      </div>
    </div>
  );
}
