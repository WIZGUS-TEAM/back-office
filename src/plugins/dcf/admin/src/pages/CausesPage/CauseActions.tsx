import React, { useState } from 'react';
import { IconButton, SimpleMenu, MenuItem, Modal, Typography, Button, Flex, Box, Status } from '@strapi/design-system';
import { More, Eye } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';

interface CauseActionsProps {
  documentId: string;
  state: string;
  onSuccess?: () => void;
  cause?: {
    name: string;
    description: string;
    donationGoal: number;
    currentDonations: number;
    endDate: string;
    state: string;
  };
}

const CauseActions = ({ documentId, state, onSuccess, cause }: CauseActionsProps) => {
  const { post } = useFetchClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleRequestWithdrawal = async () => {
    setIsLoading(true);
    try {
      console.log('documentId', documentId);
      await post(`/dcf/causes/${documentId}/request-withdrawal`);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const getStatusVariant = (state: string) => {
    switch (state) {
      case 'Validée':
        return 'success';
      case 'En examen':
        return 'warning';
      case 'Refusée':
        return 'danger';
      case 'En attente de retrait':
        return 'primary';
      default:
        return 'neutral';
    }
  };

  return (
    <>
      <SimpleMenu 
        label="Actions"
        tag={IconButton}
        icon={<More />}
      >
        <MenuItem onSelect={() => setIsViewModalOpen(true)}>
          <Flex gap={2}>
            <Eye />
            Visualiser
          </Flex>
        </MenuItem>
        {state === 'Validée' && (
          <MenuItem onSelect={() => setIsOpen(true)}>
            Demander un retrait
          </MenuItem>
        )}
      </SimpleMenu>

      <Modal.Root onOpenChange={setIsOpen} open={isOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              Confirmation de retrait
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Box padding={4}>
              <Typography>
                Êtes-vous sûr de vouloir demander un retrait pour cette cause ?
              </Typography>
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="tertiary" disabled={isLoading}>
                Annuler
              </Button>
            </Modal.Close>
            <Button 
              variant="danger-light" 
              onClick={handleRequestWithdrawal}
              loading={isLoading}
              disabled={isLoading}
            >
              Confirmer
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>

      <Modal.Root onOpenChange={setIsViewModalOpen} open={isViewModalOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              Détails de la cause
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Box padding={6} background="neutral100" hasRadius>
              <Flex direction="column" gap={5}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Typography variant="sigma" textColor="neutral600">
                    Nom de la cause
                  </Typography>
                  <Typography variant="omega" fontWeight="bold">
                    {cause?.name}
                  </Typography>
                </Flex>

                <Box>
                  <Typography variant="sigma" textColor="neutral600" style={{ marginBottom: '8px' }}>
                    Description
                  </Typography>
                  <Box background="neutral0" padding={3} hasRadius>
                    <Typography variant="omega">
                      {cause?.description}
                    </Typography>
                  </Box>
                </Box>

                <Flex justifyContent="space-between" gap={4}>
                  <Flex justifyContent="space-between" alignItems="center" style={{ flex: 1 }} background="neutral0" padding={3} hasRadius>
                    <Typography variant="sigma" textColor="neutral600">
                      Objectif
                    </Typography>
                    <Typography variant="omega" fontWeight="bold">
                      {cause?.donationGoal?.toLocaleString('fr-DZ')} DZD
                    </Typography>
                  </Flex>
                  
                  <Flex justifyContent="space-between" alignItems="center" style={{ flex: 1 }} background="neutral0" padding={3} hasRadius>
                    <Typography variant="sigma" textColor="neutral600">
                      Montant collecté
                    </Typography>
                    <Typography variant="omega" fontWeight="bold">
                      {cause?.currentDonations?.toLocaleString('fr-DZ')} DZD
                    </Typography>
                  </Flex>
                </Flex>

                <Flex justifyContent="space-between" alignItems="center">
                  <Typography variant="sigma" textColor="neutral600">
                    Date de fin
                  </Typography>
                  <Typography variant="omega">
                    {new Date(cause?.endDate || '').toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Typography>
                </Flex>

                <Flex justifyContent="space-between" alignItems="center">
                  <Typography variant="sigma" textColor="neutral600">
                    Statut
                  </Typography>
                  <Status variant={getStatusVariant(cause?.state || '')} size="M" style={{ padding: '6px 12px' }}>
                    <Typography fontWeight="bold">
                      {cause?.state}
                    </Typography>
                  </Status>
                </Flex>

                <Box>
                  <Flex justifyContent="space-between" alignItems="center" style={{ marginBottom: '8px' }}>
                    <Typography variant="sigma" textColor="neutral600">
                      Progression
                    </Typography>
                    <Typography variant="pi" fontWeight="bold">
                      {cause?.currentDonations?.toLocaleString('fr-DZ')} / {cause?.donationGoal?.toLocaleString('fr-DZ')} DZD
                    </Typography>
                  </Flex>
                  <Box background="neutral0" padding={3} hasRadius>
                    <Box
                      background="neutral200"
                      hasRadius
                      style={{
                        height: '8px',
                        width: '100%',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        background={(cause?.currentDonations || 0) >= (cause?.donationGoal || 0) ? "success500" : "primary600"}
                        style={{
                          height: '100%',
                          width: `${Math.min(((cause?.currentDonations || 0) / (cause?.donationGoal || 1)) * 100, 100)}%`,
                          position: 'absolute',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Flex>
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="secondary">
                Fermer
              </Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};

export default CauseActions;