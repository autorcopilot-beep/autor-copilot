import { ChevronRight, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/cn';

function Breadcrumb(props: React.ComponentProps<'nav'>) { return <nav aria-label="Navegação estrutural" {...props} />; }
function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) { return <ol className={cn('flex flex-wrap items-center gap-1.5 text-sm text-muted', className)} {...props} />; }
function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) { return <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />; }
function BreadcrumbLink({ className, ...props }: React.ComponentProps<'a'>) { return <a className={cn('transition-colors hover:text-ink', className)} {...props} />; }
function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) { return <span aria-current="page" className={cn('font-medium text-ink', className)} {...props} />; }
function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<'li'>) { return <li role="presentation" aria-hidden="true" className={cn('[&>svg]:size-3.5', className)} {...props}>{children ?? <ChevronRight />}</li>; }
function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>) { return <span aria-hidden="true" className={cn('flex size-7 items-center justify-center', className)} {...props}><MoreHorizontal className="size-4" /></span>; }

export { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator };
