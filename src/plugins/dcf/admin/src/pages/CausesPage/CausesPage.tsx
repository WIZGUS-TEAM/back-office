import { Loader } from "@strapi/design-system";
import { Box } from "@strapi/design-system";
import { Layouts, Page, useFetchClient } from "@strapi/strapi/admin"
import { useEffect, useState } from "react";
import { Table } from "../../components/Table/Table";
import { Flex } from "@strapi/design-system";
import { Button } from "@strapi/design-system";
import { handleSort } from "../../utils/handleSort";
import { fetchCauses, newCause as createNewCause } from "../../api/api";
import { Modal, Field, Status } from "@strapi/design-system";
import { TextInput } from "@strapi/design-system";
import { Textarea } from "@strapi/design-system";
import { Typography } from "@strapi/design-system";
import { Plus } from "@strapi/icons";
import { Cause, CreateCauseDto } from '../../types/cause';
import { Pagination } from '../../components/Pagination/Pagination';
import CauseActions from './CauseActions';

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

export const CausesPage = () => {
    const { get, post } = useFetchClient();
    const [causes, setCauses] = useState<Cause[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
    const [selectedCauses, setSelectedCauses] = useState<Cause[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newCause, setNewCause] = useState<CreateCauseDto>({ 
        name: '', 
        description: '', 
        donationGoal: 0 
    });
    const [pageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    async function loadData() {
        try {
            setIsLoading(true);
            const { data: responseData } = await get<PaginatedResponse>(
                `/dcf/causes?populate=association&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=${sortBy}:${sortOrder}`
            );

            console.log('responseData', responseData)
            
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
    }, [page, pageSize, sortBy, sortOrder]);

    const headers = [
        { name: 'name', label: 'Nom', sortable: true },
        { name: 'endDate', label: 'Date de fin', sortable: true },
        { name: 'state', label: 'Statut', sortable: true },
        { name: 'donations', label: 'Donations', sortable: false },
        { name: 'actions', label: 'Actions', sortable: false },
    ];

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            await createNewCause(post, newCause);
            await loadData();
            setNewCause({ name: '', description: '', donationGoal: 0 });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
            setIsModalVisible(false);
        }
    };

    if (isLoading) {
        return (
            <Box padding={8} background="neutral100">
                <Loader>Chargement des entreprises...</Loader>
            </Box>
        );
    }

    return (
        <Page.Main>
            <Page.Title>Liste des causes</Page.Title>
            <Layouts.Header
                title="Liste des causes"
                subtitle="Gestion des causes"
                primaryAction={
                    <Modal.Root open={isModalVisible} onOpenChange={setIsModalVisible}>
                        <Modal.Trigger>
                            <Button startIcon={<Plus />}>
                                Ajouter une cause
                            </Button>
                        </Modal.Trigger>
                        <Modal.Content>
                            <Modal.Header>
                                <Modal.Title>
                                    Créer une nouvelle cause
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Box padding={4}>
                                    <Field.Root name="name" required>
                                        <Field.Label>Nom</Field.Label>
                                        <Field.Input
                                            onChange={(e: { target: { value: string } }) => setNewCause(prev => ({ ...prev, name: e.target.value }))}
                                            value={newCause.name}
                                        />
                                    </Field.Root>
                                    <Box paddingTop={4}>
                                        <Field.Root name="description" required>
                                            <Field.Label>Description</Field.Label>
                                            <Textarea
                                                type="textarea"
                                                onChange={(e: { target: { value: string } }) => setNewCause(prev => ({ ...prev, description: e.target.value }))}
                                                value={newCause.description}
                                            />
                                        </Field.Root>
                                    </Box>
                                    <Box paddingTop={4}>
                                        <Field.Root name="donationGoal" required>
                                            <Field.Label>Objectif de donation (DZD)</Field.Label>
                                            <Field.Input
                                                type="number"
                                                min="0"
                                                onChange={(e: { target: { value: string } }) => setNewCause(prev => ({ 
                                                    ...prev, 
                                                    donationGoal: parseInt(e.target.value) || 0 
                                                }))}
                                                value={newCause.donationGoal}
                                            />
                                        </Field.Root>
                                    </Box>
                                </Box>
                            </Modal.Body>
                            <Modal.Footer>
                                <Modal.Close>
                                    <Button variant="tertiary" disabled={isSubmitting}>Annuler</Button>
                                </Modal.Close>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                >
                                    Enregistrer
                                </Button>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Root>
                }
            />

            <Layouts.Content>
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
                                            {cause.state === 'Validée' && (
                                                <Status variant="success" size="S">
                                                    <Typography fontWeight="bold" textColor="success700">
                                                        Validée
                                                    </Typography>
                                                </Status>
                                            )}
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
                                            {cause.state === 'En attente de retrait' && (
                                                <Status variant="primary" size="S">
                                                    <Typography fontWeight="bold" textColor="primary700">
                                                        En attente de retrait
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
            </Layouts.Content>
        </Page.Main>
    );
};
