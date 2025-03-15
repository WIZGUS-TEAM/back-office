import styled from 'styled-components';
import { Button } from '@strapi/design-system';

export const LinkWrapper = styled(Button)`
  padding: ${({ theme }) => theme.spaces[3]};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ $active, theme }) => ($active ? theme.shadows.filterShadow : undefined)};
  text-decoration: none;
  display: flex;

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.filterShadow};
  }
`;

export const ActionLinkWrapper = styled(LinkWrapper)`
  font-size: 1.1rem;

  svg path {
    fill: ${(p) => (p['aria-disabled'] ? p.theme.colors.neutral300 : p.theme.colors.neutral600)};
  }

  &:focus,
  &:hover {
    svg path {
      fill: ${(p) => (p['aria-disabled'] ? p.theme.colors.neutral300 : p.theme.colors.neutral700)};
    }
  }

  ${(p) =>
    p['aria-disabled']
      ? `
  pointer-events: none;
    `
      : undefined}
`;

export const PageLinkWrapper = styled(LinkWrapper)<{ $active?: boolean }>`
  color: ${({ theme, $active }) => ($active ? theme.colors.primary700 : theme.colors.neutral800)};
  background: ${({ theme, $active }) => ($active ? theme.colors.neutral0 : undefined)};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.filterShadow};
  }
`; 