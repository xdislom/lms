import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  action?: React.ReactNode;
}

export const PageHeader = ({ title, description, breadcrumbs, action }: PageHeaderProps) => {
  return (
    <div className="flex items-end justify-between mb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">{title}</h1>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-[13px] font-medium text-slate-500">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="w-1 h-1 rounded-full bg-slate-400 mx-1"></span>}
                {item.href ? (
                  <Link href={item.href} className="hover:text-blue-500 transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[#1a1a1a]">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
