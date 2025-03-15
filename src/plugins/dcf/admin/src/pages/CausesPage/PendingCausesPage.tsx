import { Loader } from "@strapi/design-system";
import { Box } from "@strapi/design-system";
import { Layouts, Page, useFetchClient } from "@strapi/strapi/admin"
import { useEffect, useState } from "react";
import { Table } from "../../components/Table/Table";
import { Flex } from "@strapi/design-system";
import { Button } from "@strapi/design-system";
import { handleSort } from "../../utils/handleSort";
import { Typography } from "@strapi/design-system";
import { Status } from "@strapi/design-system";
import { Cause } from '../../types/cause';
import { Pagination } from '../../components/Pagination/Pagination';
import CauseActions from './CauseActions';
import { Tabs } from "@strapi/design-system";

interface PaginatedResponse {
    data: Cause[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        }
    }
}

export const PendingCausesPage = () => {
    const { get } = useFetchClient();
    const [causes, setCauses] = useState<Cause[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
    const [selectedCauses, setSelectedCauses] = useState<Cause[]>([]);
    const [pageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [activeTab, setActiveTab] = useState<'pending' | 'rejected'>('pending');

    async function loadData() {
        try {
            setIsLoading(true);
            const state = activeTab === 'pending' ? 'En examen' : 'Refusée';
            const { data: responseData } = await get<PaginatedResponse>(
                `/dcf/causes?populate=association&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=${sortBy}:${sortOrder}&filters[state][$eq]=${state}`
            );
            
            setCauses(responseData.data);
            setTotal(responseData.meta.pagination.total);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [page, pageSize, sortBy, sortOrder, activeTab]);

    const headers = [
        { name: 'name', label: 'Nom', sortable: true },
        { name: 'endDate', label: 'Date de fin', sortable: true },
        { name: 'state', label: 'Statut', sortable: true },
        { name: 'donations', label: 'Donations', sortable: false },
        { name: 'actions', label: 'Actions', sortable: false },
    ];

    if (isLoading) {
        return (
            <Box padding={8} background="neutral100">
                <Loader>Chargement des causes...</Loader>
            </Box>
        );
    }

    return (
        <Page.Main>
            <Page.Title>Causes en attente et refusées</Page.Title>
            <Layouts.Header
                title="Causes en attente et refusées"
                subtitle="Gestion des causes en attente et refusées"
            />

            <Layouts.Content>
                <Tabs.Root value={activeTab}>
                    <Tabs.List aria-label="Gestion des causes">
                        <Tabs.Trigger value="pending" onClick={() => setActiveTab('pending')}>En examen</Tabs.Trigger>
                        <Tabs.Trigger value="rejected" onClick={() => setActiveTab('rejected')}>Refusées</Tabs.Trigger>
                    </Tabs.List>

                    <Box padding={4}>
                        <Table.Root
                            headers={headers}
                            rows={causes}
                            isLoading={isLoading}
                            selectedRows={selectedCauses}
                            onSelectedRowsChange={setSelectedCauses}
                        >
                            <Table.ActionBar>
                                <Flex gap={2}>
                                    <Button variant="danger-light" onClick={() => setSelectedCauses([])}>
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
                                            onSort={(name, order) => handleSort(causes, setCauses, setSortBy, setSortOrder, name, order)}
                                            currentSort={sortBy}
                                            currentOrder={sortOrder}
                                        />
                                    ))}
                                </Table.Head>
                                <Table.Body>
                                    {causes.map((cause) => (
                                        <Table.Row key={cause.id}>
                                            <Table.CheckboxCell id={cause.id} />
                                            <Table.Cell><Typography variant="omega" textColor="neutral800">{cause.name}</Typography></Table.Cell>
                                            <Table.Cell><Typography variant="omega" textColor="neutral800">{cause.endDate}</Typography></Table.Cell>
                                            <Table.Cell>
                                                <Flex justifyContent="flex-start">
                                                    {cause.state === 'En examen' && (
                                                        <Status variant="warning" size="S">
                                                            <Typography fontWeight="bold" textColor="warning700">
                                                                En examen
                                                            </Typography>
                                                        </Status>
                                                    )}
                                                    {cause.state === 'Refusée' && (
                                                        <Status variant="danger" size="S">
                                                            <Typography fontWeight="bold" textColor="danger700">
                                                                Refusée
                                                            </Typography>
                                                        </Status>
                                                    )}
                                                </Flex>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Box background="neutral100" padding={2} hasRadius>
                                                    <Flex gap={2} alignItems="center">
                                                        <Box>
                                                            <Typography variant="pi" textColor="neutral600">
                                                                {cause.currentDonations?.toLocaleString('fr-DZ')} / {cause.donationGoal?.toLocaleString('fr-DZ')} DZD
                                                            </Typography>
                                                        </Box>
                                                        <Box style={{ flex: 1, minWidth: '100px' }}>
                                                            <Box
                                                                background="neutral200"
                                                                hasRadius
                                                                style={{
                                                                    height: '6px',
                                                                    width: '100%',
                                                                    position: 'relative',
                                                                    overflow: 'hidden'
                                                                }}
                                                            >
                                                                <Box
                                                                    background={cause.currentDonations >= cause.donationGoal ? "success500" : "primary600"}
                                                                    style={{
                                                                        height: '100%',
                                                                        width: `${Math.min((cause.currentDonations / cause.donationGoal) * 100, 100)}%`,
                                                                        position: 'absolute',
                                                                        transition: 'width 0.3s ease'
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Box>
                                                    </Flex>
                                                </Box>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <CauseActions
                                                    documentId={cause.documentId}
                                                    state={cause.state}
                                                    onSuccess={loadData}
                                                    cause={cause}
                                                />
                                            </Table.Cell>
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
                    </Box>
                </Tabs.Root>
            </Layouts.Content>
        </Page.Main>
    );
}; 