import { Loader } from "@strapi/design-system";
import { Box } from "@strapi/design-system";
import { Layouts, Page, useFetchClient } from "@strapi/strapi/admin"
import { useEffect, useState } from "react";
import { Table } from "../components/Table/Table";
import { Flex } from "@strapi/design-system";
import { Button } from "@strapi/design-system";
import { handleSort } from "../utils/handleSort";
import { Donation, DonationResponse } from "../types/donation";
import { Typography } from "@strapi/design-system";
import { Pagination } from '../components/Pagination/Pagination';

interface PaginatedResponse {
    data: Donation[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        }
    }
}

export const DonationsPage = () => {
    const { get } = useFetchClient();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<string>('date');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
    const [selectedDonations, setSelectedDonations] = useState<Donation[]>([]);
    const [pageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    async function loadData() {
        try {
            setIsLoading(true);
            const { data: responseData } = await get<PaginatedResponse>(`/dcf/donations?populate[0]=cause&populate[1]=company&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=${sortBy}:${sortOrder}`);
            console.log(responseData);
            setDonations(responseData.data);
            setTotal(responseData.meta.pagination.total);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [page, pageSize, sortBy, sortOrder]);

    const headers = [
        { name: 'date', label: 'Date', sortable: true },
        { name: 'company', label: 'Entreprise', sortable: true },
        { name: 'cause', label: 'Cause', sortable: true },
        { name: 'amount', label: 'Montant', sortable: true },
    ];

    if (isLoading) {
        return (
            <Box padding={8} background="neutral100">
                <Loader>Chargement des dons...</Loader>
            </Box>
        );
    }

    return (
        <Page.Main>
            <Page.Title>Liste des dons</Page.Title>
            <Layouts.Header
                title="Liste des dons"
                subtitle="Gestion des dons"
            />

            <Layouts.Content>
                <Table.Root
                    headers={headers}
                    rows={donations}
                    isLoading={isLoading}
                    selectedRows={selectedDonations}
                    onSelectedRowsChange={setSelectedDonations}
                >
                    <Table.ActionBar>
                        <Flex gap={2}>
                            <Button variant="danger-light" onClick={() => setSelectedDonations([])}>
                                Annuler sélection
                            </Button>
                        </Flex>
                    </Table.ActionBar>
                    <Table.Content>
                        <Table.Head>
                            <Table.HeaderCheckboxCell />
                            {headers.map((header) => (
                                <Table.HeaderCell
                                    key={header.name}
                                    name={header.name}
                                    label={header.label}
                                    sortable={header.sortable}
                                    onSort={(name, order) => handleSort(donations, setDonations, setSortBy, setSortOrder, name, order)}
                                    currentSort={sortBy}
                                    currentOrder={sortOrder}
                                />
                            ))}
                        </Table.Head>
                        <Table.Body>
                            <Table.Loading />
                            <Table.Empty />
                            {donations.map((donation) => (
                                <Table.Row key={donation.documentId}>
                                    <Table.CheckboxCell id={donation.id} />
                                    <Table.Cell><Typography variant="omega" textColor="neutral800">{new Date(donation.date).toLocaleDateString()}</Typography></Table.Cell>
                                    <Table.Cell><Typography variant="omega" textColor="neutral800">{donation.company.name}</Typography></Table.Cell>
                                    <Table.Cell><Typography variant="omega" textColor="neutral800">{donation.cause.name}</Typography></Table.Cell>
                                    <Table.Cell><Typography variant="omega" textColor="neutral800">{donation.amount} €</Typography></Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Content>
                    <Pagination
                        page={page}
                        pageSize={pageSize}
                        total={total}
                        onPageChange={setPage}
                    />
                </Table.Root>
            </Layouts.Content>
        </Page.Main>
    );
};
