import React from 'react';
import { Box, Flex, Typography, VisuallyHidden } from '@strapi/design-system';
import { ChevronLeft, ChevronRight } from '@strapi/icons';
import { ActionLinkWrapper, PageLinkWrapper } from './styles';

interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    page,
    pageSize,
    total,
    onPageChange,
}) => {
    const pageCount = Math.ceil(total / pageSize);

    if (pageCount <= 1) {
        return null;
    }

    return (
        <Box padding={4}>
            <Flex justifyContent="space-between" alignItems="center">
                <Typography variant="pi">
                    {total} résultats
                </Typography>
                <Flex gap={2} as="nav" aria-label="Pagination">
                    <ActionLinkWrapper 
                        as="button"
                        aria-disabled={page === 1}
                        disabled={page === 1}
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                    >
                        <VisuallyHidden>Aller à la page précédente</VisuallyHidden>
                        <ChevronLeft aria-hidden />
                    </ActionLinkWrapper>

                    <PageLinkWrapper
                        as="button"
                        $active={page === 1}
                        onClick={() => onPageChange(1)}
                    >
                        <VisuallyHidden>Aller à la page 1</VisuallyHidden>
                        <Typography aria-hidden variant="pi" fontWeight={page === 1 ? 'bold' : undefined}>
                            1
                        </Typography>
                    </PageLinkWrapper>

                    {page > 3 && <Typography variant="pi">...</Typography>}

                    {page > 2 && (
                        <PageLinkWrapper
                            as="button"
                            onClick={() => onPageChange(page - 1)}
                        >
                            <VisuallyHidden>Aller à la page {page - 1}</VisuallyHidden>
                            <Typography aria-hidden variant="pi">
                                {page - 1}
                            </Typography>
                        </PageLinkWrapper>
                    )}

                    {page !== 1 && page !== pageCount && (
                        <PageLinkWrapper as="button" $active>
                            <VisuallyHidden>Page actuelle, page {page}</VisuallyHidden>
                            <Typography aria-hidden variant="pi" fontWeight="bold">
                                {page}
                            </Typography>
                        </PageLinkWrapper>
                    )}

                    {page < pageCount - 1 && (
                        <PageLinkWrapper
                            as="button"
                            onClick={() => onPageChange(page + 1)}
                        >
                            <VisuallyHidden>Aller à la page {page + 1}</VisuallyHidden>
                            <Typography aria-hidden variant="pi">
                                {page + 1}
                            </Typography>
                        </PageLinkWrapper>
                    )}

                    {page < pageCount - 2 && <Typography variant="pi">...</Typography>}

                    {pageCount > 1 && (
                        <PageLinkWrapper
                            as="button"
                            $active={page === pageCount}
                            onClick={() => onPageChange(pageCount)}
                        >
                            <VisuallyHidden>Aller à la page {pageCount}</VisuallyHidden>
                            <Typography 
                                aria-hidden 
                                variant="pi"
                                fontWeight={page === pageCount ? 'bold' : undefined}
                            >
                                {pageCount}
                            </Typography>
                        </PageLinkWrapper>
                    )}

                    <ActionLinkWrapper 
                        as="button"
                        aria-disabled={page >= pageCount}
                        disabled={page >= pageCount}
                        onClick={() => onPageChange(Math.min(pageCount, page + 1))}
                    >
                        <VisuallyHidden>Aller à la page suivante</VisuallyHidden>
                        <ChevronRight aria-hidden />
                    </ActionLinkWrapper>
                </Flex>
            </Flex>
        </Box>
    );
}; 