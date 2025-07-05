import {useAuth} from '../auth/AuthProvider'

export default function DynamicButton({ allowedRoles = [], children, ...props }) {
  const { user } = useAuth(); // Assuming your provider exposes `user.roles`

  // Check if user has at least one allowed role
  const hasAccess = user?.roles?.some(role => allowedRoles.includes(role));

  if (!hasAccess) return null;

  return (
    <button
      {...props}
      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
    >
      {children}
    </button>
  );
}
