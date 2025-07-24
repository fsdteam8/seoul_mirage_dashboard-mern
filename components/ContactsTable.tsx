"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

interface Contact {
    _id: string;
    name: string;
    email: string;
    how_can_we_help: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
}

interface CustomerApiResponse {
    success: boolean;
    data: Contact[];
    params: {
        page: string;
    };
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        from: number;
        to: number;
        links: Array<{
            url: string;
            label: string;
            active: boolean;
        }>;
    };
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

function EnhancedPagination({
    currentPage,
    totalPages,
    totalCount,
    itemsPerPage,
    onPageChange,
}: PaginationProps) {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, currentPage + 2);

            if (currentPage <= 3) end = Math.min(5, totalPages);
            else if (currentPage >= totalPages - 2) start = Math.max(1, totalPages - 4);

            for (let i = start; i <= end; i++) pages.push(i);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalCount);

    return (
        <div className="flex items-center justify-between border-t bg-white px-6 py-4">
            <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startItem}</span> to{" "}
                <span className="font-medium">{endItem}</span> of{" "}
                <span className="font-medium">{totalCount}</span> results
            </div>

            <div className="flex items-center space-x-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-9 w-9 text-sm"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center space-x-1 mx-2">
                    {pageNumbers.map((pageNum) => (
                        <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(pageNum)}
                            className={`h-9 w-9 p-0 ${currentPage === pageNum
                                ? "bg-gray-900 text-white hover:bg-gray-800"
                                : "hover:bg-gray-50"
                                }`}
                        >
                            {pageNum}
                        </Button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="h-9 px-3 text-sm"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export function ContactsTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const session = useSession();
    const token = session?.data?.accessToken ?? "";

    const { data, isLoading } = useQuery<CustomerApiResponse>({
        queryKey: ["contacts", currentPage, searchTerm, statusFilter],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.set("page", currentPage.toString());

            if (searchTerm.trim()) params.set("search", searchTerm);
            if (statusFilter !== "All Status") params.set("status", statusFilter);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/contacts?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                }
            );
            if (!res.ok) throw new Error("Failed to fetch contacts");
            return res.json();
        },
    });

    const contactList = data?.data ?? [];
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-brand-text-dark">All Contacts</h2>

            <div className="flex flex-col sm:flex-row items-center gap-4 border p-6 rounded-[15px]">
                <div className="relative w-full sm:w-auto sm:flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-10 w-[265px] h-[49px]"
                    />
                </div>

                <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                }}>
                    <SelectTrigger className="w-full sm:w-[180px] h-[49px]">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All Status">All Status</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-lg border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>How Can We Help</TableHead>
                            <TableHead>Created At</TableHead>
                            {/* <TableHead>Updated At</TableHead> */}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading
                            ? Array.from({ length: 10 }).map((_, rowIdx) => (
                                <TableRow key={`skeleton-${rowIdx}`}>
                                    {Array.from({ length: 6 }).map((_, colIdx) => (
                                        <TableCell key={colIdx}>
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                            : contactList.length > 0
                                ? contactList.map((contact, i) => (
                                    <TableRow key={contact?._id ?? i}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>{contact?.name ?? "-"}</TableCell>
                                        <TableCell>{contact?.email ?? "-"}</TableCell>
                                        <TableCell>
                                            {contact?.how_can_we_help
                                                ? contact.how_can_we_help.length > 40
                                                    ? contact.how_can_we_help.slice(0, 40) + "..."
                                                    : contact.how_can_we_help
                                                : "-"}
                                        </TableCell>
                                        <TableCell>{contact?.createdAt ? new Date(contact.createdAt).toLocaleDateString() : "-"}</TableCell>
                                        {/* <TableCell>{contact?.updatedAt ? new Date(contact.updatedAt).toLocaleDateString() : "-"}</TableCell> */}
                                    </TableRow>
                                ))
                                : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">
                                            No contacts found.
                                        </TableCell>
                                    </TableRow>
                                )}
                    </TableBody>
                </Table>

                {data && data?.pagination.last_page > 1 && (
                    <EnhancedPagination
                        currentPage={data.pagination.current_page}
                        totalPages={data.pagination.last_page}
                        totalCount={data.pagination.total}
                        itemsPerPage={data.pagination.per_page}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                )}
            </div>
        </div>
    );
}