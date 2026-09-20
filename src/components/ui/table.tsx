'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

function Table({ className, ...props }: React.ComponentProps<'table'>) { return <div className="relative w-full overflow-x-auto"><table className={cn('w-full caption-bottom text-sm', className)} {...props} /></div>; }
function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) { return <thead className={cn('[&_tr]:border-b [&_tr]:border-white/10', className)} {...props} />; }
function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) { return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />; }
function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) { return <tfoot className={cn('border-t border-white/10 bg-white/[0.04] font-medium', className)} {...props} />; }
function TableRow({ className, ...props }: React.ComponentProps<'tr'>) { return <tr className={cn('border-b border-white/10 transition-colors hover:bg-white/[0.045] data-[state=selected]:bg-white/[0.06]', className)} {...props} />; }
function TableHead({ className, ...props }: React.ComponentProps<'th'>) { return <th className={cn('h-10 whitespace-nowrap px-3 text-left align-middle text-xs font-semibold uppercase tracking-wider text-white/45', className)} {...props} />; }
function TableCell({ className, ...props }: React.ComponentProps<'td'>) { return <td className={cn('whitespace-nowrap px-3 py-2.5 align-middle', className)} {...props} />; }
function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) { return <caption className={cn('mt-4 text-sm text-white/45', className)} {...props} />; }

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
