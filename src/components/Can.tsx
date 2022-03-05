import { useCan } from '../hooks/useCan';

interface CanProps {
  permissions?: Array<string>;
  roles?: Array<string>;
}

export const Can: React.FC<CanProps> = ({ children, permissions, roles }) => {
  const userCanSeeComponent = useCan({
    permissions,
    roles,
  });

  if (!userCanSeeComponent) return null;

  return <>{children}</>;
};
