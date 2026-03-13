import { BreadcrumbBar, Breadcrumb as BreadcrumbUSWDS, BreadcrumbLink, Icon } from '@trussworks/react-uswds';
import './breadcrumb.scss';

const Breadcrumb = ({ home = true, paths, href = '/', hrefText = 'Home' }) => {
  const pathLength = paths.length;

  return (
    <BreadcrumbBar className='breadcrumb-list'>
      {home && (
        <BreadcrumbUSWDS>
          <BreadcrumbLink href={href}>
            <Icon.Home className='mr-1' color='#0c66bb' size={'16px'} aria-hidden='true' focusable='false' />
            {hrefText}
          </BreadcrumbLink>
        </BreadcrumbUSWDS>
      )}
      {paths.map((item, index) => {
        if (pathLength - 1 !== index) {
          return (
            <BreadcrumbUSWDS key={index}>
              <BreadcrumbLink key={index} href={item.href}>
                <span>{item.text}</span>
              </BreadcrumbLink>
            </BreadcrumbUSWDS>
          );
        } else {
          return (
            <BreadcrumbUSWDS current className='breadcrumb-item active'>
              <span>{paths[pathLength - 1].text}</span>
            </BreadcrumbUSWDS>
          );
        }
      })}
    </BreadcrumbBar>
  );
};

export default Breadcrumb;
