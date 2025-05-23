// src/components/ui/invoices/table.tsx

import { UpdateInvoice, DeleteInvoice } from "~/components/ui/invoices/buttons";
import { InvoiceStatus } from "~/components/ui/invoices/status";
import { formatDateToLocal, formatCurrency } from "~/lib/utils";

import { component$, Resource, useResource$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { fetchFilteredInvoices } from "~/lib/data";
import { InvoicesTableSkeleton } from "../skeletons";

export const Table = component$(() => {
  const loc = useLocation();

  const invoicesResource = useResource$(async ({ track }) => {
    track(() => loc.url.search); // Track the URL search params
    const searchParams = loc.url.searchParams;
    const query = searchParams.get("query") || "";
    const currentPage = Number(searchParams.get("page")) || 1;
    const filteredInvoices = await fetchFilteredInvoices(query, currentPage);
    return filteredInvoices;
  });
  return (
    <Resource
      value={invoicesResource}
      onResolved={(invoices) => {
        return (
          <div class="mt-6 flow-root">
            <div class="inline-block min-w-full align-middle">
              <div class="rounded-lg bg-gray-50 p-2 md:pt-0">
                <div class="md:hidden">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      class="mb-2 w-full rounded-md bg-white p-4"
                    >
                      <div class="flex items-center justify-between border-b pb-4">
                        <div>
                          <div class="mb-2 flex items-center">
                            <img
                              src={invoice.image_url}
                              class="mr-2 rounded-full"
                              width={28}
                              height={28}
                              alt={`${invoice.name}'s profile picture`}
                            />
                            <p>{invoice.name}</p>
                          </div>
                          <p class="text-sm text-gray-500">{invoice.email}</p>
                        </div>
                        <InvoiceStatus status={invoice.status} />
                      </div>
                      <div class="flex w-full items-center justify-between pt-4">
                        <div>
                          <p class="text-xl font-medium">
                            {formatCurrency(invoice.amount)}
                          </p>
                          <p>{formatDateToLocal(invoice.date)}</p>
                        </div>
                        <div class="flex justify-end gap-2">
                          <UpdateInvoice />
                          <DeleteInvoice />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <table class="hidden min-w-full text-gray-900 md:table">
                  <thead class="rounded-lg text-left text-sm font-normal">
                    <tr>
                      <th scope="col" class="px-4 py-5 font-medium sm:pl-6">
                        Customer
                      </th>
                      <th scope="col" class="px-3 py-5 font-medium">
                        Email
                      </th>
                      <th scope="col" class="px-3 py-5 font-medium">
                        Amount
                      </th>
                      <th scope="col" class="px-3 py-5 font-medium">
                        Date
                      </th>
                      <th scope="col" class="px-3 py-5 font-medium">
                        Status
                      </th>
                      <th scope="col" class="relative py-3 pl-6 pr-3">
                        <span class="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white">
                    {invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        class="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                      >
                        <td class="whitespace-nowrap py-3 pl-6 pr-3">
                          <div class="flex items-center gap-3">
                            <img
                              src={invoice.image_url}
                              class="rounded-full"
                              width={28}
                              height={28}
                              alt={`${invoice.name}'s profile picture`}
                            />
                            <p>{invoice.name}</p>
                          </div>
                        </td>
                        <td class="whitespace-nowrap px-3 py-3">
                          {invoice.email}
                        </td>
                        <td class="whitespace-nowrap px-3 py-3">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td class="whitespace-nowrap px-3 py-3">
                          {formatDateToLocal(invoice.date)}
                        </td>
                        <td class="whitespace-nowrap px-3 py-3">
                          <InvoiceStatus status={invoice.status} />
                        </td>
                        <td class="whitespace-nowrap py-3 pl-6 pr-3">
                          <div class="flex justify-end gap-3">
                            <UpdateInvoice />
                            <DeleteInvoice />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }}
      onPending={() => <InvoicesTableSkeleton />}
      onRejected={(error) => {
        console.error(error);
        return <div>Error</div>;
      }}
    />
  );
});