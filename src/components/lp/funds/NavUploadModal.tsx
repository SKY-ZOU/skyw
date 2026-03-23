'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, CheckCircle, AlertCircle, FileText } from 'lucide-react'

interface PreviewRow {
  date: string
  nav: string
}

interface Props {
  fundId: string
  fundName: string
  onClose: () => void
  onSuccess: () => void
}

function parsePreview(text: string): { rows: PreviewRow[]; error: string | null } {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length < 2) return { rows: [], error: 'CSV 至少需要表头和一行数据' }

  const header = lines[0].toLowerCase().split(',').map(h => h.trim())
  const dateIdx = header.indexOf('date')
  const navIdx = header.indexOf('nav')
  if (dateIdx === -1 || navIdx === -1) return { rows: [], error: 'CSV 必须包含 date 和 nav 两列' }

  const rows = lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim())
    return { date: cols[dateIdx] || '', nav: cols[navIdx] || '' }
  }).filter(r => r.date && r.nav)

  return { rows, error: null }
}

export function NavUploadModal({ fundId, fundName, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<PreviewRow[]>([])
  const [parseError, setParseError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    setResult(null)
    const text = await f.text()
    const { rows, error } = parsePreview(text)
    setParseError(error)
    setPreview(rows.slice(0, 5))
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const handleSubmit = async () => {
    if (!file || parseError) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('fund_id', fundId)
      formData.append('file', file)

      const res = await fetch('/api/lp/admin/nav-upload', {
        method: 'POST',
        body: formData,
      })
      const json = await res.json()
      if (json.success) {
        setResult({ success: true, message: json.message })
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 1500)
      } else {
        setResult({ success: false, message: json.error || '上传失败' })
      }
    } catch {
      setResult({ success: false, message: '网络错误，请重试' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">上传净值</h2>
            <p className="text-sm text-slate-500 mt-0.5">{fundName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Format hint */}
          <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3 font-mono">
            CSV 格式：第一行为表头 <span className="text-blue-600">date,nav</span>，之后每行为一条净值记录<br />
            例：2026-01-01,1.2345
          </div>

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400'
            }`}
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div className="text-left">
                  <p className="font-medium text-slate-800">{file.name}</p>
                  <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">拖拽 CSV 文件到此处</p>
                <p className="text-slate-400 text-sm mt-1">或点击选择文件</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          {/* Parse error */}
          {parseError && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {parseError}
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && !parseError && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">预览（前5行）</p>
              <div className="rounded-lg border border-slate-100 overflow-hidden text-sm">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs text-slate-500">日期</th>
                      <th className="px-4 py-2 text-right text-xs text-slate-500">净值</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {preview.map((row, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 text-slate-700">{row.date}</td>
                        <td className="px-4 py-2 text-right font-mono text-slate-900">{row.nav}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
              result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {result.success
                ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                : <AlertCircle className="w-4 h-4 flex-shrink-0" />
              }
              {result.message}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || !!parseError || uploading || !!result?.success}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium transition"
          >
            {uploading ? '上传中...' : '确认上传'}
          </button>
        </div>
      </div>
    </div>
  )
}
