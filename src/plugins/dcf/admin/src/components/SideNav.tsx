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
                    <SubNavLink
                        key={2}
                        tag={NavLink}
                        to={{
                            pathname: '/plugins/dcf/causes',
                        }}
                    >
                        Causes
                    </SubNavLink>
                    <SubNavLink
                        key={3}
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