import { SubNav, SubNavHeader, SubNavSections, SubNavSection, SubNavLink } from '@strapi/design-system';
import { NavLink } from 'react-router-dom';

export const SideNav = () => {

    return (
        <SubNav aria-label="RSE">
            <SubNavHeader label="Mon association" />
            <SubNavSections>
                <SubNavSection key={0} label="Gestion">
                    <SubNavLink
                        key={1}
                        tag={NavLink}
                        to={{
                            pathname: '/plugins/dcf/',
                        }}
                        end>
                        Accueil
                    </SubNavLink>
                </SubNavSection>
                <SubNavSection key={1} label="Causes">
                    <SubNavLink
                        key={11}
                        tag={NavLink}
                        to={{
                            pathname: '/plugins/dcf/causes',
                        }}
                    >
                        Toutes les causes
                    </SubNavLink>
                    <SubNavLink
                        key={12}
                        tag={NavLink}
                        to={{
                            pathname: '/plugins/dcf/active-causes',
                        }}
                    >
                        Causes actives
                    </SubNavLink>  
                    <SubNavLink
                        key={13}
                        tag={NavLink}
                        to={{
                            pathname: '/plugins/dcf/pending-causes',
                        }}
                    >
                        Causes en attente
                    </SubNavLink>
                </SubNavSection>
                <SubNavSection key={2} label="Donations">
                    <SubNavLink
                        key={21}
                        tag={NavLink}
                        to={{
                            pathname: '/plugins/dcf/donations',
                        }}
                    >
                        Donations
                    </SubNavLink>
                </SubNavSection>
            </SubNavSections>
        </SubNav>
    );
}