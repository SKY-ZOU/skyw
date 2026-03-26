'use client';

interface DeleteConfirmProps {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirm({ open, title, onConfirm, onCancel }: DeleteConfirmProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-[#1a1a2e]">确认删除</h3>
        <p className="mt-2 text-body-md text-[#6c757d]">
          确定要删除「{title}」吗？此操作无法撤销。
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-body-sm font-medium text-[#6c757d] transition-colors hover:bg-[#f8f9fa]"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-body-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  );
}
