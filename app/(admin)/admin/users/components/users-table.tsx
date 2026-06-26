import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { UserRow } from "../lib/users-types";
import { UserActionIcon } from "./user-action-icon";

type UsersTableProps = {
  users: UserRow[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
};

export function UsersTable({ users, pagination }: UsersTableProps) {
  return (
    <Card className='overflow-hidden rounded-2xl border-slate-100! bg-white! text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!'>
      <Table className='min-w-full divide-y divide-gray-100'>
        <TableHeader className='bg-gray-50/80'>
          <TableRow className='hover:bg-transparent'>
            <TableHead className='w-20 px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              No
            </TableHead>

            <TableHead className='px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Username
            </TableHead>

            <TableHead className='px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Email
            </TableHead>

            <TableHead className='px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Join
            </TableHead>

            <TableHead className='px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className='divide-y divide-gray-100 bg-white'>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className='group border-gray-100 transition-colors hover:bg-emerald-50/30'
            >
              <TableCell className='whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-500 sm:px-8'>
                {user.no}
              </TableCell>

              <TableCell className='whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-700 transition-colors group-hover:text-emerald-700 sm:px-8'>
                {user.username}
              </TableCell>

              <TableCell className='whitespace-nowrap px-6 py-5 text-sm text-gray-500 sm:px-8'>
                {user.email}
              </TableCell>

              <TableCell className='whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-700 sm:px-8'>
                {user.join}
                <div className='mt-1 text-xs font-normal text-gray-500'>
                  Registered user
                </div>
              </TableCell>

              <TableCell className='whitespace-nowrap px-6 py-5 text-right text-sm font-medium sm:px-8'>
                <div className='flex items-center justify-end gap-2'>
                  <Link
                    href={`/admin/users/${user.id}`}
                    title='View'
                    className='inline-flex h-10 w-10 items-center justify-center rounded-xl p-0 text-gray-400 transition-all duration-200 hover:bg-sky-50! hover:text-sky-700'
                  >
                    <UserActionIcon type='view' />
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {users.length === 0 ? (
        <div className='border-t border-gray-100 bg-white px-6 py-8 text-sm font-semibold text-gray-500 sm:px-8'>
          Belum ada data user.
        </div>
      ) : null}

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
      />
    </Card>
  );
}
