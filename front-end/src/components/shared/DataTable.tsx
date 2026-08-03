import React from 'react';
import { Loader2, Search, ArrowDownToLine, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyTitle?: string;
  isLoading?: boolean;
  variant?: 'default' | 'courses';
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  emptyTitle = 'Ma\'lumotlar topilmadi',
  isLoading = false,
  variant = 'default',
}: DataTableProps<T>) {
  
  const renderPaginationRight = () => (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-medium text-slate-500">Bir sahifada:</span>
        <Select defaultValue="10">
          <SelectTrigger className="h-8 w-[70px] text-[13px] bg-transparent border-none shadow-none focus:ring-0 p-0 font-medium">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-1 text-[13px] font-medium text-slate-500">
        <button className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center text-[#1a1a1a]">1</button>
        <button className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center">2</button>
        <button className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center">3</button>
        <span className="px-1">..</span>
        <button className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center">15</button>
        <button className="ml-2 hover:text-[#1a1a1a]">Keyingi</button>
      </div>
    </div>
  );

  const renderTopToolbarDefault = () => (
    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between py-4 border-b border-slate-200 gap-4 xl:gap-0">
      <div className="flex items-center gap-6">
        <span className="text-[13px] font-medium text-[#1a1a1a]">
          Sahifada 0-10 gacha. Umumiy {data.length}ta
        </span>
        <button className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">X</span>
          </div>
          (2) Yuklab olish .XLS
        </button>
      </div>
      {renderPaginationRight()}
    </div>
  );

  const renderTopToolbarCourses = () => (
    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between py-4 border-b border-slate-200 gap-4 xl:gap-0">
      <div className="relative w-[300px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Izlash"
          className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] outline-none focus:border-blue-500 transition-all text-[#1a1a1a] placeholder:text-slate-400"
        />
        <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 cursor-pointer" />
      </div>
      {renderPaginationRight()}
    </div>
  );

  const renderBottomToolbar = () => (
    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between py-4 border-t border-slate-200 gap-4 xl:gap-0 mt-4">
      <div className="flex items-center gap-6">
        <span className="text-[13px] font-medium text-[#1a1a1a]">
          Sahifada 0-10 gacha. Umumiy {data.length}ta
        </span>
        <button className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">X</span>
          </div>
          (2) Yuklab olish .XLS
        </button>
      </div>
      {renderPaginationRight()}
    </div>
  );

  return (
    <div className="bg-white rounded-[20px] shadow-sm overflow-hidden flex flex-col w-full border border-slate-100 p-6">
      {/* Top Toolbar */}
      {variant === 'default' ? renderTopToolbarDefault() : renderTopToolbarCourses()}

      {/* Search Bar (Default Only) */}
      {variant === 'default' && (
        <div className="flex items-center gap-3 py-6">
          <div className="relative flex-1 max-w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Izlash..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] outline-none focus:border-blue-500 transition-all text-[#1a1a1a] placeholder:text-slate-400"
            />
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 h-10 text-[13px] font-semibold">
            Izlash
          </Button>
        </div>
      )}

      {/* Table */}
      <div className={`overflow-x-auto min-h-[300px] ${variant === 'courses' ? 'mt-4' : ''}`}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="text-slate-500 text-sm">Yuklanmoqda...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <h3 className="text-lg font-semibold text-slate-800">{emptyTitle}</h3>
          </div>
        ) : (
          <table className="w-full text-[13px] text-left">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className="px-4 py-4 font-bold text-[#1a1a1a] border-b-2 border-slate-100 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {col.header}
                      {col.header !== '' && <ArrowDownToLine className="w-3 h-3 text-slate-400" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  {columns.map((col, index) => (
                    <td key={index} className="px-4 py-4 text-slate-600 font-medium whitespace-nowrap">
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Bottom Toolbar */}
      {renderBottomToolbar()}
    </div>
  );
}
