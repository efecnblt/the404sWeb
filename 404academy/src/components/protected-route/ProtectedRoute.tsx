import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../firebase/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: number[]; // Belirli rollerin erişimini kontrol etmek için
    allowedForGuests?: boolean; // Sadece oturum açmamış kullanıcıların erişimine izin ver
}

const ProtectedRoute = ({ children, allowedRoles = [], allowedForGuests = false }: ProtectedRouteProps) => {
    const { user } = useAuth();
    const location = useLocation();

    // Eğer yalnızca misafirler için erişim izni verildiyse ve kullanıcı giriş yapmışsa, ana sayfaya yönlendir
    if (allowedForGuests && user) {
        return <Navigate to="/" replace />;
    }

    // Eğer kullanıcı giriş yapmamışsa ve misafirler için izin verilmemişse, giriş sayfasına yönlendir
    if (!user && !allowedForGuests) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Belirli roller kontrolü
    if (allowedRoles.length > 0) {
        const userRoles = user?.claims?.map(claim => claim.id) || [];
        const hasRequiredRole = userRoles.some(role => allowedRoles.includes(role));

        if (!hasRequiredRole) {
            // Kullanıcının rolü yetkili değilse, ana sayfaya yönlendir
            return <Navigate to="/" replace />;
        }
    }

    // Erişim izni varsa, içerik göster
    return <>{children}</>;
};

export default ProtectedRoute;
